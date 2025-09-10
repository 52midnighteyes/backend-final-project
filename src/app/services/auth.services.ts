import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { transporter } from "../utils/mailer";
import prisma from "../lib/prisma";
import {
  findUserByEmail,
  registerUser,
  saveTemporaryToken,
  findTemporaryToken,
  // deleteTemporaryToken,
} from "../repositories/auth.repository";
import {
  ILoginParam,
  IRegisterParam,
  ICompleteProfileParam,
} from "../interfaces/auth.types";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");


// LOGIN
export async function loginService({ email, password }: ILoginParam) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  if (!user.isVerified) throw new Error("Please verify your email first");
  if (!user.password)
    throw new Error("Password not set, complete profile first");

  // const validPassword = await bcrypt.compare(password, user.password);
  // if (!validPassword) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user, token };
}


// REGISTER
export async function registerService(data: IRegisterParam) {
  const existing = await findUserByEmail(data.email);
  if (existing) throw new Error("Email already registered");

  const user = await registerUser({
    id: data.id,
    email: data.email,
    role: data.role || "USER",
    isVerified: false, 
  });

  const verifyToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  await saveTemporaryToken(
    user.id,
    verifyToken,
    new Date(Date.now() + 60 * 60 * 1000)
  );

  const verifyUrl = `${
    process.env.FE_URL || "http://localhost:3000/"
  }auth/verify?token=${verifyToken}`;

  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: user.email,
    subject: "Verify your email",
    html: `<p>Hi,</p>
           <p>Click below to verify your email:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
  });

  return user;
}


// VERIFY EMAIL

export async function verifyEmailService(token: string) {
  const tempToken = await findTemporaryToken(token);
  if (!tempToken) throw new Error("Token not found");
  if (tempToken.expired_at < new Date()) {
    // await deleteTemporaryToken(tempToken.id);
    throw new Error("Token expired");
  }

  // verifikasi akun user
  const user = await prisma.user.update({
    where: { id: tempToken.user_id },
    data: { isVerified: true },
  });

  // await deleteTemporaryToken(tempToken.id);

  return { success: true, message: "Email verified successfully", user };
}


// COMPLETE PROFILE
export async function completeProfileService({
  id,
  password,
  first_name,
  last_name,
  phone_number,
  role = "USER",
}: ICompleteProfileParam & { role?: "USER" | "TENANT" | "ADMIN" }) {
  if (!id) throw new Error("User ID is required to complete profile");

  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new Error("User not found");


  if (!existingUser.isVerified) {
    throw new Error("Please verify your email before completing profile");
  }


  let hashedPassword = existingUser.password;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // update profile
  const user = await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      role,
      first_name,
      last_name,
      phone_number,
    },
  });

  // token baru
  const token = jwt.sign(
    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    success: true,
    message: "Profile completed successfully",
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    },
    token,
  };
}
