// import prisma from "../lib/prisma";
// import { UserRepository } from "../repositories/user.repository";
// import { User } from "@prisma/client";
// import { hashSync, genSaltSync } from "bcrypt";
// import { transporter } from "../lib/mailer";
// import { generateVerificationToken } from "./token.service";
// import { BE_URL, FE_URL } from "../../configs/config"; // or env usage

// export async function getProfile(userId: string) {
//   const user = await UserRepository.findById(userId);
//   if (!user) throw new Error("User not found");
//   return user;
// }

// export async function updateProfile(
//   userId: string,
//   payload: {
//     first_name?: string;
//     last_name?: string;
//     phone_number?: number;
//     avatar?: string;
//   }
// ) {
//   const data: any = {};
//   if (payload.first_name !== undefined) data.first_name = payload.first_name;
//   if (payload.last_name !== undefined) data.last_name = payload.last_name;
//   if (payload.phone_number !== undefined)
//     data.phone_number = payload.phone_number;
//   if (payload.avatar !== undefined) data.avatar = payload.avatar;
//   const updated = await UserRepository.update(userId, data);
//   return updated;
// }

// export async function changePassword(
//   userId: string,
//   oldPassword: string | undefined,
//   newPassword: string
// ) {
//   const user = await UserRepository.findById(userId);
//   if (!user) throw new Error("User not found");

//   // if user has existing password, validate oldPassword
//   if (user.password) {
//     if (!oldPassword) throw new Error("Current password required");
//     const ok = await import("bcrypt").then((b) =>
//       b.compare(oldPassword, user.password!)
//     );
//     if (!ok) throw new Error("Current password incorrect");
//   }

//   const salt = genSaltSync(10);
//   const hashed = hashSync(newPassword, salt);
//   await UserRepository.update(userId, { password: hashed });
//   return true;
// }

// export async function updateEmailRequest(userId: string, newEmail: string) {
//   // check existing email
//   const existing = await UserRepository.findById(userId);
//   if (!existing) throw new Error("User not found");

//   const emailTaken = (await UserRepository.findById)
//     ? await prisma.user.findUnique({ where: { email: newEmail } })
//     : null;
//   if (emailTaken && emailTaken.id !== userId) {
//     throw new Error("Email already in use");
//   }

//   // update email and set isVerified = false
//   await UserRepository.update(userId, { email: newEmail, isVerified: false });

//   // generate token and send verify mail
//   const tokenRec = await generateVerificationToken(userId);
//   const verifyUrl = `${FE_URL}/auth/verify?token=${tokenRec.token}`; // FE URL
//   await transporter.sendMail({
//     from: process.env.NODEMAILER_EMAIL,
//     to: newEmail,
//     subject: "Verify your new email",
//     html: `Please verify your new email by clicking: <a href="${verifyUrl}">${verifyUrl}</a>`,
//   });

//   return true;
// }

// export async function resendVerification(userId: string) {
//   const user = await UserRepository.findById(userId);
//   if (!user) throw new Error("User not found");
//   if (user.isVerified) throw new Error("Already verified");

//   const tokenRec = await generateVerificationToken(userId);
//   const verifyUrl = `${FE_URL}/auth/verify?token=${tokenRec.token}`;
//   await transporter.sendMail({
//     from: process.env.NODEMAILER_EMAIL,
//     to: user.email,
//     subject: "Verify your email",
//     html: `Please verify your email by clicking: <a href="${verifyUrl}">${verifyUrl}</a>`,
//   });

//   return true;
// }
