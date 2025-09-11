import { Prisma, PrismaClient } from "@prisma/client";

export type db = PrismaClient | Prisma.TransactionClient;
