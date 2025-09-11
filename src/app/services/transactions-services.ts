import prisma from "../lib/prisma";
import { AppError } from "../classes/appError.class";

import {
  ICreateTransaction,
  IPricing,
} from "../interfaces/transactions-interface";
import { roomAndAddOnsCalculator } from "../utils/calculatePrice-utils";
import { Decimal } from "@prisma/client/runtime/library";
import { roomPriceCalculator } from "../utils/roomPriceCalculator-utils";
import { toMidnight } from "../utils/roomPriceCalculator-utils";

export async function CreateTransactionService(params: ICreateTransaction) {
  try {
    const start = toMidnight(params.start_date);
    const end = toMidnight(params.end_date);
    if (end <= start)
      throw new AppError(400, "end_date must be after start_date");

    const property = await prisma.property.findFirst({
      where: { id: params.property_id },
      include: {
        room_types: {
          where: { id: params.room_type_id },
          select: { id: true, base_price: true, total_rooms: true },
        },
      },
    });

    if (!property || property.room_types.length < 1) {
      throw new AppError(404, "There's no such property or room with that id");
    }
    const roomType = property.room_types[0];

    const pricing = await prisma.pricing.findMany({
      where: {
        room_type_id: roomType.id,
        start_date: { lte: end },
        end_date: { gte: start },
      },
      select: {
        value: true,
        type: true,
        is_rentable: true,
        start_date: true,
        end_date: true,
      },
      orderBy: { start_date: "asc" },
    });

    const response = await prisma.$transaction(async (tx) => {
      const checkPrice = roomPriceCalculator(
        new Decimal(roomType.base_price),
        start,
        end,
        pricing as IPricing[]
      );

      const { nights, totalPrice } = checkPrice;
      const grandTotal = roomAndAddOnsCalculator(
        totalPrice,
        nights,
        params.add_on
      );

      const transaction = await tx.transaction.create({
        data: {
          user_id: params.user_id,
          property_id: property.id,
          room_type_id: roomType.id,
          amount: grandTotal,
          special_request: params.special_request || null,
          status: "WAITING_FOR_PAYMENT",
          start_date: start,
          end_date: end,
          expired_at: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      if (params.add_on.length > 0) {
        await tx.transaction_AddOn.createMany({
          data: params.add_on.map((a) => ({
            transaction_id: transaction.id,
            add_on_id: a.id,
            unit_price: a.price,
          })),
        });
      }

      const data = await tx.transaction.findFirst({
        where: {
          id: transaction.id,
        },
        include: {
          transaction_add_ons: true,
          room_type: true,
          property: true,
        },
      });

      return data;
    });

    return response;
  } catch (err) {
    throw err;
  }
}
