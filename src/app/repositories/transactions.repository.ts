import { Db } from "../interfaces/prisma.types";
import { Transaction_Status } from "@prisma/client";
import {
  IAddOn,
  TransactionStatus,
} from "../interfaces/transactions.interface";
import {
  enumerateNights,
  toMidnight,
} from "../utils/roomPriceCalculator-utils";
import { AppError } from "../classes/appError.class";
import { Decimal } from "@prisma/client/runtime/library";

//-> INI CEK ROWS, KALO BELOM ADA BIKIN DULU
export async function ensureRows(
  db: Db,
  total_rooms: number,
  room_type_id: string,
  start_date: Date,
  end_date: Date
) {
  const s = toMidnight(start_date);
  const e = toMidnight(end_date);
  const days = enumerateNights(s, e);

  try {
    for (const day of days) {
      await db.availability_Daily.upsert({
        where: {
          room_type_id_date: {
            room_type_id,
            date: day,
          },
        },
        create: {
          room_type_id,
          date: day,
          total_rooms,
        },
        update: {},
      });
    }

    return days;
  } catch (err) {
    throw err;
  }
}

//-> CEK AVAILIBILITY ROOM
export async function checkRoomAvailibility(
  db: Db,
  days: Date[],
  room_type_id: string,
  qty: number
) {
  const status: Transaction_Status[] = [
    "WAITING_FOR_PAYMENT",
    "WAITING_FOR_CONFIRMATION",
    "ON_GOING",
  ];
  try {
    const rows = await db.availability_Daily.findMany({
      where: { room_type_id, date: { in: days } },
    });

    for (const r of rows) {
      const activeTxCount = await db.transaction.count({
        where: {
          room_type_id,
          status: { in: status },
          start_date: { lte: r.date },
          end_date: { gt: r.date },
        },
      });

      const available = r.total_rooms - (r.booked_count + activeTxCount);

      if (available < qty) {
        const ds = r.date.toISOString().slice(0, 10);
        throw new AppError(422, `Not enough rooms on ${ds}`);
      }
    }

    return;
  } catch (err) {
    throw err;
  }
}

//-> Kalo transaksi berhasil dicreate, berarti tambah holder sesuai tanggalnya
export async function updateHoldByRange(
  db: Db,
  days: Date[],
  room_type_id: string,
  qty: number
): Promise<void> {
  try {
    for (const day of days) {
      db.availability_Daily.update({
        where: { room_type_id_date: { room_type_id, date: day } },
        data: { held_count: { increment: qty } },
      });
    }
  } catch (err) {
    throw err;
  }
}

//-> KALO TRANSAKSI BERHASIL LANGSUNG UPDATE
export async function addBookedRoom(
  db: Db,
  days: Date[],
  room_type_id: string,
  qty: number
) {
  try {
    for (const day of days) {
      await db.availability_Daily.update({
        where: { room_type_id_date: { room_type_id, date: day } },
        data: {
          booked_count: { increment: qty },
        },
      });
    }
  } catch (err) {
    throw err;
  }
}

//-> kalo transaski gagal/cancel juga keupdate
export async function decreaseHoldWhenFailed(
  db: Db,
  days: Date[],
  room_type_id: string,
  qty: number
) {
  try {
    for (const day of days) {
      await db.availability_Daily.update({
        where: { room_type_id_date: { room_type_id, date: day } },
        data: {
          held_count: { decrement: qty },
        },
      });
    }
  } catch (err) {
    throw err;
  }
}

//-> cek apakah add-on valid
export async function addOnValidator(
  db: Db,
  addOns: IAddOn[],
  property_id: string
): Promise<IAddOn[]> {
  try {
    console.log("ini addon->", addOns);
    if (!addOns || addOns.length === 0) return [];

    const addOnIds = addOns.map((a) => a.id);
    const uniqueIds = Array.from(new Set(addOnIds));

    const found = await db.add_On.findMany({
      where: { id: { in: uniqueIds }, property_id },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    const foundIds = new Set(found.map((a) => a.id));
    const missingId = uniqueIds.filter((id) => !foundIds.has(id));
    if (missingId.length > 0) {
      throw new AppError(404, `addOn(s) not found: ${missingId.join(", ")}`);
    }
    return found as IAddOn[];
  } catch (err) {
    throw err;
  }
}

//-> Cari property include room by id
export async function findPropertyAndRoomById(
  db: Db,
  property_id: string,
  room_type_id: string
) {
  try {
    const property = await db.property.findFirst({
      where: { id: property_id },
      include: {
        room_types: {
          where: { id: room_type_id },
          select: { id: true, base_price: true, total_rooms: true },
        },
      },
    });
    if (!property || property.room_types.length < 1) {
      throw new AppError(404, "There's no such property or room with that id");
    }
    return property;
  } catch (err) {
    throw err;
  }
}

//-> find pricing yang overlap sama tanggal checkin dan checkout(eksklusif)
export async function findRoomPricingsByRange(
  db: Db,
  room_type_id: string,
  start_date: Date,
  end_date: Date
) {
  try {
    const pricing = await db.pricing.findMany({
      where: {
        room_type_id,
        start_date: { lte: end_date },
        end_date: { gte: start_date },
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

    return pricing;
  } catch (err) {
    throw err;
  }
}

//-> create transaction

export async function createTransaction(
  db: Db,
  user_id: string,
  property_id: string,
  room_type_id: string,
  amount: Decimal,
  start_date: Date,
  end_date: Date,
  special_request?: string
) {
  try {
    const transaction = await db.transaction.create({
      data: {
        user_id,
        property_id,
        room_type_id,
        amount,
        special_request: special_request ?? null,
        status: "WAITING_FOR_PAYMENT",
        start_date,
        end_date,
        expired_at: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return transaction;
  } catch (err) {
    throw err;
  }
}

//-> create add on (create many)
export async function createManyAddOnTransactions(
  db: Db,
  transaction_id: string,
  addOns: IAddOn[]
) {
  try {
    if (addOns.length === 0) return [];
    const data = await db.transaction_AddOn.createMany({
      data: addOns.map((a) => ({
        transaction_id,
        add_on_id: a.id,
        unit_price: a.price,
      })),
    });

    return data;
  } catch (err) {
    throw err;
  }
}

//-> find user by id

export async function findUserById(db: Db, id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new AppError(404, "Not Found: No such user with that id");

    return user;
  } catch (err) {
    throw err;
  }
}

//-> find transaction

export async function updateTransactionStatus(
  db: Db,
  transaction_id: string,
  owner_id: string,
  status: TransactionStatus
) {
  try {
    const transaction = await db.transaction.update({
      where: {
        id: transaction_id,
        property: {
          user_id: owner_id,
        },
      },
      data: {
        status,
      },
    });

    return transaction;
  } catch (err) {
    throw err;
  }
}

//find transaction and tx owner

export async function findTransactionById(
  db: Db,
  transaction_id: string,
  user_id: string
) {
  try {
    const response = await db.transaction.findUnique({
      where: {
        id: transaction_id,
        user_id,
      },
      include: {
        room_type: true,
      },
    });

    if (!response) throw new AppError(404, "No transaction found");

    return response;
  } catch (err) {
    throw err;
  }
}
