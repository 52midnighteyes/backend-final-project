import prisma from "../lib/prisma";
import { AppError } from "../classes/appError.class";
import {
  findUserById,
  updateUserProfile,
} from "../repositories/user.repository";
import bcrypt, { genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY, FE_URL } from "../configs/config";
import path from "path";
import fs from "fs/promises";
import Handlebars from "handlebars";
import mailer from "../lib/nodemailer";
import {
  createTemporaryToken,
  deleteTemporaryToken,
  findTemporaryToken,
} from "../repositories/auth.repository";
import {
  IUpdateUserProfileParams,
  IUserProfile,
  IResendVerifyEmailResponse,
  IConfirmVerifyEmailParams,
} from "../interfaces/user.types";

// Get Profile
export async function getUserProfileService(
  userId: string
): Promise<IUserProfile> {
  const user = await findUserById(prisma, userId);
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    avatar: user.avatar,
    phone_number: user.phone_number,
    role: user.role,
    isVerified: user.isVerified,
    created_at: user.created_at,
  };
}

// Update Profile
export async function updateUserProfileService(
  userId: string,
  params: IUpdateUserProfileParams
): Promise<IUserProfile> {
  const user = await findUserById(prisma, userId);
  const updateData: any = {};

  if (params.first_name) updateData.first_name = params.first_name;
  if (params.last_name) updateData.last_name = params.last_name;
  if (params.phone_number) updateData.phone_number = params.phone_number;
  if (params.avatar) updateData.avatar = params.avatar;

  if (params.password) {
    const salt = await genSalt(10);
    updateData.password = await hash(params.password, salt);
  }

  if (params.email && params.email !== user.email) {
    updateData.email = params.email;
    updateData.isVerified = false;

    const payload = { email: params.email, type: "RESET_EMAIL" };
    const token = sign(payload, SECRET_KEY as string, { expiresIn: "1d" });
    const expired_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await createTemporaryToken(
      prisma,
      token,
      expired_at,
      "RESET_EMAIL",
      user.id
    );

    const hbsPath = path.join(
      __dirname,
      "../templates/verifyEmail.template.hbs"
    );
    const readHbs = await fs.readFile(hbsPath, "utf-8");
    const compiledHbs = Handlebars.compile(readHbs);
    const html = compiledHbs({
      email: params.email,
      feurl: `${FE_URL}/user/verify-email/confirm`,
      token,
      year: new Date().getFullYear(),
    });

    await mailer.sendMail({
      to: params.email,
      subject: "RESTIFY - Verify Your New Email",
      html,
    });
  }

  const updated = await updateUserProfile(prisma, userId, updateData);

  return {
    id: updated.id,
    first_name: updated.first_name,
    last_name: updated.last_name,
    email: updated.email,
    avatar: updated.avatar,
    phone_number: updated.phone_number,
    role: updated.role,
    isVerified: updated.isVerified,
    created_at: updated.created_at,
  };
}

// Resend verification email
export async function resendVerifyEmailService(
  userId: string
): Promise<IResendVerifyEmailResponse> {
  const user = await findUserById(prisma, userId);
  if (user.isVerified) throw new AppError(400, "Email already verified");

  const payload = { email: user.email, type: "RESET_EMAIL" };
  const token = sign(payload, SECRET_KEY as string, { expiresIn: "1d" });
  const expired_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await createTemporaryToken(prisma, token, expired_at, "RESET_EMAIL", user.id);

  const hbsPath = path.join(__dirname, "../templates/verifyEmail.template.hbs");
  const readHbs = await fs.readFile(hbsPath, "utf-8");
  const compiledHbs = Handlebars.compile(readHbs);
  const html = compiledHbs({
    email: user.email,
    feurl: `${FE_URL}/user/verify-email/confirm`,
    token,
    year: new Date().getFullYear(),
  });

  await mailer.sendMail({
    to: user.email,
    subject: "RESTIFY - Verify Your Email",
    html,
  });

  return { message: "Verification email sent" };
}

// Confirm verify email
export async function confirmVerifyEmailService(
  params: IConfirmVerifyEmailParams
): Promise<string> {
  const tempToken = await findTemporaryToken(
    prisma,
    params.token,
    "RESET_EMAIL"
  );
  if (!tempToken) throw new AppError(400, "Invalid or expired token");

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: tempToken.user_id as string },
      data: { isVerified: true },
    });
    await deleteTemporaryToken(tx, params.token);
  });

  return "Email verified successfully";
}
