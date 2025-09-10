import prisma from "../lib/prisma";
import { IRegisterParam } from "../interfaces/auth.types";

// Cari user berdasarkan email
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Daftar user baru
export async function registerUser(data: IRegisterParam) {
  return prisma.user.create({
    data: {
      ...data,
      email: data.email,
      role: data.role || "USER",
      first_name: "NewUser",
      last_name: "User",
      phone_number: null,
      password: "",
      avatar: "",
      isVerified: false,

    },
  });
}

// Simpan temporary token untuk verifikasi email
export async function saveTemporaryToken(
  userId: string,
  token: string,
  expired_at: Date
) {
  return prisma.temporary_Token.create({
    data: { user_id: userId, token, type: "RESET_EMAIL", expired_at },
  });
}

// Cari temporary token
export async function findTemporaryToken(token: string) {
  return prisma.temporary_Token.findUnique({ where: { token } });
}

// Hapus temporary token
// export async function deleteTemporaryToken(id: string) {
//   return prisma.temporary_Token.delete({ where: { id } });
// }
