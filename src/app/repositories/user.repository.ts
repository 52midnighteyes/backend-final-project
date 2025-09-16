import prisma from "../lib/prisma";
import { ICreateUserParam, IUpdateUserParam } from "../interfaces/user.types";
import { genSaltSync, hashSync } from "bcrypt";

// Ambil semua user
export async function getAllUsers() {
  return prisma.user.findMany({
    where: { deleted_at: null }, 
  });
}

// Ambil user berdasarkan ID
export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// Buat user baru
export async function createUser(params: ICreateUserParam) {
  const existingUser = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const salt = genSaltSync(10);
  const hashedPassword = hashSync(params.password, salt);

  return prisma.user.create({
    data: {
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      password: hashedPassword,
      role: params.role || "USER", 
      avatar: params.avatar || null,
      phone_number: params.phone_number || null,
      isVerified: false,
    },
  });
}

// Update user
export async function updateUser(id: string, params: IUpdateUserParam) {
  const updateData: Partial<IUpdateUserParam> = { ...params };

  if (params.password) {
    const salt = genSaltSync(10);
    updateData.password = hashSync(params.password, salt);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
}


export async function deleteUser(id: string) {
  return prisma.user.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
}