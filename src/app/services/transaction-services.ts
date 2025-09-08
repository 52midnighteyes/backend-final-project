import prisma from "../lib/prisma";
import { AppError } from "../classes/appError.class";

export interface ICreateTransaction {
  user_id: string;
  property_id: string;
  room_type_id: string;
  special_request: string;
  start_date: Date;
  end_date: Date;
  add_on: string[];
}

export async function CreateTransactionService(params: ICreateTransaction) {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: params.property_id,
      },
    });

    const response = await prisma.$transaction(async (tx) => {});
  } catch (err) {
    throw err;
  }
}
