import prisma from "../lib/prisma";
import { Db } from "../interfaces/prisma.types";
import { AppError } from "../classes/appError.class";
import {
  Temporary_Token,
  Temporary_Token_Type,
  User_Role,
} from "@prisma/client";

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
}

// Cek apakah user sudah ada
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

// Buat temporary token
export async function createTemporaryToken(
  db: Db,
  token: string,
  expired_at: Date,
  type: Temporary_Token_Type,
  userId?: string
) {
  try {
    const data: any = {
      token,
      expired_at,
      type,
    };

    if (userId) {
      data.user = { connect: { id: userId } };
    }

    const response = await db.temporary_Token.create({ data });
    return response;
  } catch (err) {
    throw err;
  }
}
// Cari temporary token valid
export async function findTemporaryToken(
  db: Db,
  token: string,
  type: Temporary_Token_Type
): Promise<Temporary_Token> {
  try {
    const temp = await db.temporary_Token.findFirst({
      where: {
        token,
        type,
        expired_at: {
          gte: new Date(Date.now()),
        },
      },
    });

    if (!temp) throw new AppError(404, "No token found");

    return temp;
  } catch (err) {
    throw err;
  }
}

// Buat user baru
export async function createNewUser(
  db: Db,
  email: string,
  first_name: string,
  last_name: string,
  role: User_Role,
  password: string
) {
  try {
    return await db.user.create({
      data: {
        email,
        first_name,
        last_name,
        password,
        role,
        isVerified: true,
      },
    });
  } catch (err) {
    throw err;
  }
}

// Hapus temporary token
export async function deleteTemporaryToken(db: Db, token: string) {
  try {
    await db.temporary_Token.delete({ where: { token } });
  } catch (err) {
    throw err;
  }
}

// Update password user
export async function updateUserPassword(
  db: Db,
  user_id: string,
  hashedPassword: string
) {
  try {
    return await db.user.update({
      where: { id: user_id },
      data: { password: hashedPassword },
    });
  } catch (err) {
    throw err;
  }
}
