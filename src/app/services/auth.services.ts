import { sign } from "jsonwebtoken";
import bcrypt, { genSalt, hash } from "bcrypt";
import path from "path";
import fs from "fs/promises";
import prisma from "../lib/prisma";
import {
  findUserByEmail,
  saveTemporaryToken,
  findTemporaryToken,
  isUserExists,
  createNewUser,
  deleteRegisterToken,
} from "../repositories/auth.repository";

import {
  ICompleteRegisterParams,
  ILoginParams,
} from "../interfaces/auth.types";
import { AppError } from "../classes/appError.class";
import { IUserParams } from "../../user";
import { FE_URL, SECRET_KEY } from "../configs/config";
import Handlebars from "handlebars";
import mailer from "../lib/nodemailer";

/**
 * User Login service
 * - Cari user by email
 * - Validasi password
 * - Generate JWT token (exp: 4h)
 *
 * @param params - object berisi email & password
 * @returns user object + JWT token
 * @throws AppError(401) jika credentials invalid
 * @throws AppError(404) jika user tidak ditemukan
 */
export async function userLoginService(params: ILoginParams) {
  try {
    const { email, password } = params;
    const user = await findUserByEmail(prisma, email);
    if (user.role !== "USER") {
      throw new AppError(403, "Only USER role can login on this page");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!validPassword) throw new AppError(401, "Invalid credentials");

    const userPayload: IUserParams = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar || null,
      role: user.role,
    };

    const token = sign(userPayload, SECRET_KEY as string, { expiresIn: "4h" });

    return { userPayload, token };
  } catch (err) {
    throw err;
  }
}

/**
 * Tenant Login Service
 * - Cari user by email
 * - Validasi password
 * - Generate JWT token (exp: 4h)
 *
 * @param params - object berisi email & password
 * @returns tenant object + JWT token
 * @throws AppError(401) jika credentials invalid
 * @throws AppError(404) jika tenant tidak ditemukan
 * @throws AppError(403) jika role bukan TENANT
 */
export async function tenantLoginService(params: ILoginParams) {
  try {
    const { email, password } = params;
    const user = await findUserByEmail(prisma, email);

    if (user.role !== "TENANT") {
      throw new AppError(403, "Only TENANT role can login on this page");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!validPassword) throw new AppError(401, "Invalid credentials");

    const tenantPayload: IUserParams = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar || null,
      role: user.role,
    };

    const token = sign(tenantPayload, SECRET_KEY as string, {
      expiresIn: "4h",
    });

    return { tenantPayload, token };
  } catch (err) {
    throw err;
  }
}

/**
 * Service untuk handle registrasi awal user.
 *
 * Alur:
 * 1. Cek apakah user dengan email sudah ada.
 * 2. Buat JWT token verifikasi (expire 1 hari).
 * 3. Simpan token sementara ke tabel Temporary_Tokens.
 * 4. Render email template (Handlebars) untuk verifikasi.
 * 5. Kirim email ke user dengan link verifikasi.
 *
 * @param params - object berisi data registrasi (email)
 * @returns response dari saveTemporaryToken (berisi token, expired_at, dsb)
 *
 * Error handling:
 * - Jika email sudah terdaftar → lempar AppError(409, "User already exists")
 * - Jika terjadi error saat DB / email → dilempar ke errorHandler Express
 */

export async function registerService(email: string) {
  const message = "Registration successful.";
  try {
    await isUserExists(prisma, email);

    const payload = {
      email,
    };

    const verifyToken = sign(payload, SECRET_KEY as string, {
      expiresIn: "1d",
    });
    const expired_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const response = await saveTemporaryToken(
      prisma,
      verifyToken,
      expired_at,
      "REGISTRATION"
    );

    // Send Mail Disini
    const hbsPath = path.join(
      __dirname,
      "../templates/registerService.template.hbs"
    );
    const readHbs = await fs.readFile(hbsPath, "utf-8");
    const compiledHbs = Handlebars.compile(readHbs);
    const html = compiledHbs({
      email: email,
      feurl: `${FE_URL}/auth/complate_registration`,
      token: response.token,
      year: new Date().getFullYear(),
    });

    await mailer.sendMail({
      to: email,
      subject: "Complete Your Registration",
      html,
    });

    return message;
  } catch (err) {
    throw err;
  }
}

// Complete Registration
/**
 * Service untuk menyelesaikan registrasi user setelah verifikasi email.
 *
 * Flow:
 * 1. Pastikan token REGISTRATION valid (findTemporaryToken).
 * 2. Hash password dengan bcrypt (saltRounds = 10).
 * 3. Gunakan transaksi:
 *    - Insert user baru ke tabel Users.
 *    - Hapus token REGISTRATION agar tidak bisa dipakai ulang.
 * 4. Return message sukses.
 *
 * @param params - data registrasi lengkap:
 *  - first_name, last_name, password, role, token, email
 *
 * @returns string - pesan "Registration successful."
 *
 * @throws AppError jika:
 *  - token tidak valid
 *  - email sudah dipakai (unique constraint)
 *  - DB error lain saat transaksi
 *
 * Catatan:
 * - Password disimpan dalam bentuk hash (bukan plain text).
 * - Transaksi memastikan atomicity (jika createUser gagal, token tidak terhapus).
 * - Return hanya message.
 */
export async function completeRegisterService(params: ICompleteRegisterParams) {
  const { first_name, last_name, password, role, token, email } = params;
  const message = "Registration successful.";
  try {
    await isUserExists(prisma, email);
    await findTemporaryToken(prisma, params.token, "REGISTRATION");

    const salt = await genSalt(10);
    const hashed = await hash(params.password, salt);

    await prisma.$transaction(async (tx) => {
      await createNewUser(tx, email, first_name, last_name, role, hashed);

      await deleteRegisterToken(tx, token);
    });

    return message;
  } catch (err) {
    throw err;
  }
}
