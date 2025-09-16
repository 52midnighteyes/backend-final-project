import { PrismaClient, Temporary_Token_Type } from "@prisma/client";

const prisma = new PrismaClient();

export const TokenRepository = {
  create: async (data: {
    token: string;
    user_id: string;
    expired_at: Date;
    type: Temporary_Token_Type;
  }) => {
    return prisma.temporary_Token.create({ data });
  },

  findByToken: async (token: string) => {
    return prisma.temporary_Token.findUnique({
      where: { token },
    });
  },

  deleteById: async (id: string) => {
    return prisma.temporary_Token.delete({
      where: { id },
    });
  },
};
