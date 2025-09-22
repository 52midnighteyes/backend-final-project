import prisma from "../lib/prisma";
import { AppError } from "../classes/appError.class";

import {
  IAddOn,
  ICreateOnGoingTransaction,
  ICreateTransaction,
  IPricing,
  IUpdatePaymentStatus,
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
  ensureRows,
  checkRoomAvailibility,
  updateHoldByRange,
  addOnValidator,
  findPropertyAndRoomById,
  findRoomPricingsByRange,
  createTransaction,
  createManyAddOnTransactions,
  findUserById,
  updateTransactionStatus,
  moveHoldToBookedByRange,
} from "../repositories/transactions.repository";
import { error } from "console";
import { cloudinaryUpload } from "../utils/cloudinary";
import en from "zod/v4/locales/en.cjs";

// ketika ketik transaksi, kita buat dulu ongoing transaction.
export async function CreateOnGoingTransaction(
  params: ICreateOnGoingTransaction
) {
  try {
    const start = toMidnight(params.start_date);
    const end = toMidnight(params.end_date);
    if (end <= start)
      throw new AppError(400, "end_date must be greater than start_date");

    const nights = enumerateNights(start, end);

    const user = await findUserById(prisma, params.user_id);

    const property = await findPropertyAndRoomById(
      prisma,
      params.property_id,
      params.room_type_id
    );

    const room_type = property.room_types[0];

    await checkRoomAvailibility(prisma, nights, room_type.id, 1);

    const transaction = await prisma.transaction.create({
      data: {
        user_id: params.user_id,
        property_id: property.id,
        room_type_id: room_type.id,
        amount: room_type.base_price * nights.length, //temp price
        status: "ON_GOING",
        start_date: start,
        end_date: end,
      },
    });

    return transaction;
  } catch (err) {
    throw err;
  }
}

export async function CreateTransactionService(params: ICreateTransaction) {
  try {
    const start = toMidnight(params.start_date);
    const end = toMidnight(params.end_date);
    if (end <= start)
      throw new AppError(400, "end_date must be after start_date");

    const user = await findUserById(prisma, params.user_id);

    const property = await findPropertyAndRoomById(
      prisma,
      params.property_id,
      params.room_type_id
    );

    const roomType = property.room_types[0];

    const pricing = await findRoomPricingsByRange(
      prisma,
      roomType.id,
      start,
      end
    );

    const response = await prisma.$transaction(async (tx) => {
      const days = await ensureRows(
        tx,
        roomType.total_rooms,
        roomType.id,
        start,
        end
      );

      await checkRoomAvailibility(tx, days, roomType.id, 1);

      const checkPrice = roomPriceCalculator(
        new Decimal(roomType.base_price),
        start,
        end,
        pricing as IPricing[]
      );

      const { nights, totalPrice } = checkPrice;

      const addOnsList: IAddOn[] = await addOnValidator(
        tx,
        params.add_on,
        property.id
      );

      const grandTotal = roomAndAddOnsCalculator(
        totalPrice,
        nights,
        addOnsList
      );

      const updateTransaction = tx.transaction.update({
        where: {
          id: params.transaction_id,
        },
        data: {
          amount: grandTotal,
          special_request: params.special_request || null,
        },
      });

      //gak dimodularin karena cuma sekali pake
      const data = await tx.transaction.findFirst({
        where: {
          id: params.transaction_id,
        },
        include: {
          transaction_add_ons: true,
          room_type: true,
          property: true,
        },
      });

      await updateHoldByRange(tx, days, roomType.id, 1);

      return { data, addOnsList };
    });

    if (!response.data)
      throw new AppError(400, "Bad Request: Transaction Failed");

    const payload = {
      guestName: (user.first_name, user.last_name),
      guestEmail: user.email,
      grandTotal: response.data.amount,
      checkIn: start.toISOString().slice(0, 10),
      checkOut: end.toISOString().slice(0, 10),
      roomType: response.data.room_type.name,
      addons: response.addOnsList,
    };

    return payload;
  } catch (err) {
    throw err;
  }
}

// export async function UploadPaymentProof(params: IUploadPaymentProof) {
//   let payment_proof: string = "";
//   if (params.file) {
//     const { secure_url } = await cloudinaryUpload(params.file);
//   }

//   try {
//     const user = await findUserById(prisma, params.user_id);
//     if (!user) throw new AppError(404, "No user with that id");

//     const response = await prisma.transaction.update({
//       where: {
//         id: params.transaction_id,
//         user_id: user.id,
//       },
//       data: {
//         payment_proof,
//       },
//     });

//     if (!response) throw new AppError(404, "We cant find your transaction");
//     return response;
//   } catch (err) {
//     throw err;
//   }
// }

// export async function UpdatePaymentStatus(params: IUpdatePaymentStatus) {
//   try {
//     const transaction = await updateTransactionStatus(
//       prisma,
//       params.transaction_id,
//       params.owner_id,
//       params.status
//     );

//     const days = enumerateNights(transaction.start_date, transaction.end_date);

//     if (transaction.status === "PAID")
//       await moveHoldToBookedByRange(prisma, days, transaction.room_type_id, 1);

//     if(transaction.status === "CANCELED")
//   } catch (err) {
//     throw err;
//   }
// }
