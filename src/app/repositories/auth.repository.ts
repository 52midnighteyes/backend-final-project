import prisma from "../lib/prisma";
import { Db } from "../interfaces/prisma.types";
import { AppError } from "../classes/appError.class";
import { Temporary_Token_Type, User_Role } from "@prisma/client";
import { equal } from "assert";
// Cari user berdasarkan email
export async function findUserByEmail(db: Db, email: string) {
  try {
    const response = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!response) throw new AppError(404, "User Not Found");

    return response;
  } catch (err) {
    throw err;
  }
} // cari apakah user sudah ada
export async function isUserExists(db: Db, email: string): Promise<void> {
  try {
    const user = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (user) throw new AppError(409, "User already exists");
  } catch (err) {
    throw err;
  }
}

// Simpan temporary token untuk verifikasi email
export async function saveTemporaryToken(
  db: Db,
  token: string,
  expired_at: Date,
  type: Temporary_Token_Type,
  user_id?: string
) {
  try {
    const response = db.temporary_Token.create({
      data: {
        token,
        expired_at,
        type,
      },
    });

    return response;
  } catch (err) {
    throw err;
  }
}

// Cari temporary token
export async function findTemporaryToken(
  db: Db,
  token: string,
  type: Temporary_Token_Type
): Promise<void> {
  try {
    await db.temporary_Token.findFirst({
      where: {
        token,
        type,
        expired_at: {
          gte: new Date(Date.now()),
        },
      },
    });

    if (!token) throw new AppError(404, "no token found");
  } catch (err) {
    throw err;
  }
}

export async function createNewUser(
  db: Db,
  email: string,
  first_name: string,
  last_name: string,
  role: User_Role,
  password: string
) {
  try {
    const response = await db.user.create({
      data: {
        email,
        first_name,
        last_name,
        password,
        role,
        isVerified: true,
      },
    });

    return response;
  } catch (err) {
    throw err;
  }
}

// Hapus temporary token
export async function deleteRegisterToken(db: Db, token: string) {
  try {
    await db.temporary_Token.delete({
      where: {
        token,
      },
    });
  } catch (err) {
    throw err;
  }
}
