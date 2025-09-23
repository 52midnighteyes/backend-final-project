import prisma from "../lib/prisma";
import { AppError } from "../classes/appError.class";

import {
  IAddOn,
  IConfirmPayment,
  ICreateOnGoingTransaction,
  ICreateTransaction,
  IPricing,
  IUploadPaymentProof,
} from "../interfaces/transactions.interface";
import { roomAndAddOnsCalculator } from "../utils/calculatePrice-utils";
import { Decimal } from "@prisma/client/runtime/library";
import {
  enumerateNights,
  roomPriceCalculator,
} from "../utils/roomPriceCalculator-utils";
import { toMidnight } from "../utils/roomPriceCalculator-utils";

import {
  checkRoomAvailibility,
  addOnValidator,
  findPropertyAndRoomById,
  findRoomPricingsByRange,
  createManyAddOnTransactions,
  findUserById,
  findUserTransactionById,
  updateTransactionStatus,
  addBookedRoom,
  ensureRows,
  findTranscationById,
} from "../repositories/transactions.repository";
import { cloudinaryUpload } from "../utils/cloudinary";
import path, { format } from "path";
import fs from "fs/promises";
import Handlebars, { compile } from "handlebars";
import mailer from "../lib/nodemailer";
import { formatTime } from "../utils/dateConverter.utils";
import { en } from "zod/v4/locales";

export async function createOnGoingTransactionService(
  params: ICreateOnGoingTransaction
) {
  const start = toMidnight(params.start_date);
  const end = toMidnight(params.end_date);
  if (end <= start)
    throw new AppError(400, "end_date must be greater than start_date");

  const enumeratedNights = enumerateNights(start, end);

  try {
    const user = await findUserById(prisma, params.user_id);
    const property = await findPropertyAndRoomById(
      prisma,
      params.property_id,
      params.room_type_id
    );
    const room_type = property.room_types[0];

    await ensureRows(prisma, room_type.total_rooms, room_type.id, start, end);
    await checkRoomAvailibility(prisma, enumeratedNights, room_type.id, 1);

    const pricing = await findRoomPricingsByRange(
      prisma,
      room_type.id,
      start,
      end
    );

    const { nights, totalPrice } = roomPriceCalculator(
      new Decimal(room_type.base_price),
      start,
      end,
      pricing
    );

    const grandTotal = roomAndAddOnsCalculator(totalPrice, nights);

    const response = await prisma.$transaction(async (tx) => {
      const transaction = await prisma.transaction.create({
        data: {
          user_id: params.user_id,
          property_id: property.id,
          room_type_id: room_type.id,
          amount: grandTotal,
          nights_total: nights,
          status: "ON_GOING",
          start_date: start,
          end_date: end,
          expired_at: new Date(Date.now() + 60 * 5 * 1000),
        },
      });

      return transaction;
    });

    const payload = {
      id: response.id,
      room_type_id: room_type.id,
      property_id: property.id,
      property_name: property.name,
      nights_total: response.nights_total,
      room_type: room_type.name,
      amount: response.amount,
      start_date: response.start_date,
      end_date: response.end_date,
      expired_at: response.expired_at,
    };

    return payload;
  } catch (err) {
    throw err;
  }
}

export async function createTransactionService(params: ICreateTransaction) {
  try {
    const transaction = await findUserTransactionById(
      prisma,
      params.transaction_id,
      params.user_id
    );

    const property = await findPropertyAndRoomById(
      prisma,
      transaction.property_id,
      transaction.room_type_id
    );

    if (transaction.status !== "ON_GOING") {
      throw new AppError(422, "Transaction status must be ON_GOING");
    }

    if (new Date(transaction.expired_at as Date) <= new Date(Date.now())) {
      throw new AppError(422, "Transaction has expired");
    }

    const start = toMidnight(transaction.start_date);
    const end = toMidnight(transaction.end_date);
    const roomType = property.room_types[0];

    const response = await prisma.$transaction(async (tx) => {
      const validAddOns = await addOnValidator(
        tx,
        params.add_on,
        transaction.property_id
      );

      const grandTotal = roomAndAddOnsCalculator(
        transaction.amount,
        transaction.nights_total as number,
        validAddOns
      );

      const updateTransaction = await tx.transaction.update({
        where: {
          id: transaction.id,
          user_id: transaction.user_id,
        },
        data: {
          amount: grandTotal,
          special_request: params.special_request || null,
          expired_at: new Date(Date.now() + 1000 * 60 * 10),
          status: "WAITING_FOR_PAYMENT",
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
          room_type: true,
          transaction_add_ons: {
            where: {
              transaction_id: transaction.id,
            },
          },
        },
      });

      await createManyAddOnTransactions(tx, updateTransaction.id, validAddOns);

      return { ...updateTransaction, addOns: params.add_on };
    });

    const payload = {
      id: response.id,
      room_type_id: roomType.id,
      property_id: property.id,
      property_name: property.name,
      nights_total: response.nights_total,
      room_type: roomType.name,
      amount: response.amount,
      start_date: response.start_date,
      end_date: response.end_date,
      expired_at: response.expired_at,
    };

    return payload;
  } catch (err) {
    throw err;
  }
}

export async function uploadPaymentProofService(params: IUploadPaymentProof) {
  if (!params.file) throw new AppError(404, "No file found. try to reupload");
  try {
    const user = await findUserById(prisma, params.user_id);

    const { secure_url } = await cloudinaryUpload(params.file);

    const response = await prisma.transaction.update({
      where: {
        id: params.transaction_id,
      },
      data: {
        payment_proof: secure_url,
        status: "WAITING_FOR_CONFIRMATION",
        expired_at: null,
      },
      include: {
        property: {
          select: {
            name: true,
          },
        },
      },
    });

    const hbsPath = path.join(
      __dirname,
      "../templates/waiting-for-confirmation.template.hbs"
    );
    const readHbs = await fs.readFile(hbsPath, "utf-8");
    const compileHbs = Handlebars.compile(readHbs);
    const html = compileHbs({
      email: user.email,
      property_name: response.property.name,
      check_in: formatTime(response.start_date, "2 PM"),
      check_out: formatTime(response.end_date, "12 PM"),
      year: new Date().getFullYear(),
    });

    await mailer.sendMail({
      to: user.email,
      subject: "Payment Received",
      html,
    });

    return response;
  } catch (err) {
    throw err;
  }
}

export async function confirmPaymentService(params: IConfirmPayment) {
  try {
    const response = await prisma.$transaction(async (tx) => {
      const transaction = await updateTransactionStatus(
        tx,
        params.transaction_id,
        params.owner_id,
        params.status
      );

      const user = await findUserById(tx, transaction.user_id);
      const property = await findPropertyAndRoomById(
        tx,
        transaction.property_id,
        transaction.room_type_id
      );

      if (transaction.status === "PAID") {
        const s = toMidnight(transaction.start_date);
        const e = toMidnight(transaction.end_date);
        const nights = enumerateNights(s, e);
        await addBookedRoom(tx, nights, transaction.room_type_id, 1);

        const hbsPath = path.join(
          __dirname,
          "../templates/paymentAccepted.template.hbs"
        );
        const readHbs = await fs.readFile(hbsPath, "utf-8");
        const compileHbs = Handlebars.compile(readHbs);
        const html = compileHbs({
          email: user.email,
          property_name: property.name,
          check_in: formatTime(transaction.start_date, "2 PM"),
          check_out: formatTime(transaction.end_date, "12 PM"),
          year: new Date().getFullYear(),
        });

        await mailer.sendMail({
          to: user.email,
          subject: "Payment Approved",
          html,
        });
      }

      if (transaction.status === "PAYMENT_PROOF_REJECTED") {
        const hbsPath = path.join(
          __dirname,
          "../templates/paymentRejected.template.hbs"
        );
        const readHbs = await fs.readFile(hbsPath, "utf-8");
        const compileHbs = Handlebars.compile(readHbs);
        const html = compileHbs({
          email: user.email,
          transaction_id: transaction.id,
          property_name: property.name,
          year: new Date().getFullYear(),
        });

        await mailer.sendMail({
          to: user.email,
          subject: "Payment Rejected",
          html,
        });
      }

      return transaction;
    });
    return response;
  } catch (err) {
    throw err;
  }
}

export async function getTransactionService(id: string) {
  try {
    const response = await findTranscationById(prisma, id);
    const property = await findPropertyAndRoomById(
      prisma,
      response.property_id,
      response.room_type_id
    );

    const roomType = property.room_types[0];

    const payload = {
      id: response.id,
      room_type_id: roomType.id,
      property_id: property.id,
      property_name: property.name,
      nights_total: response.nights_total,
      room_type: roomType.name,
      amount: response.amount,
      start_date: response.start_date,
      end_date: response.end_date,
      expired_at: response.expired_at,
    };

    return payload;
  } catch (err) {
    throw err;
  }
}
