import { Db } from "../interfaces/prisma.types";
import { User } from "@prisma/client";
import { AppError } from "../classes/appError.class";

export async function findUserById(db: Db, id: string): Promise<User> {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, "User not found");
  return user;
}

export async function updateUserProfile(
  db: Db,
  id: string,
  data: Partial<User>
) {
  return await db.user.update({
    where: { id },
    data,
  });
}
