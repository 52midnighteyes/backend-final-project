import { randomBytes } from "crypto";
import { TokenRepository } from "../repositories/token.repository";
import { Temporary_Token_Type } from "@prisma/client";

export async function generateVerificationToken(
  userId: string,
  ttlMinutes = 60
) {
  const token = randomBytes(32).toString("hex");
  const expired_at = new Date(Date.now() + ttlMinutes * 60 * 1000);
  return TokenRepository.create({
    token,
    user_id: userId,
    expired_at,
    type: Temporary_Token_Type.RESET_EMAIL, 
  });
}

export async function verifyAndConsumeToken(
  token: string,
  expectedType: Temporary_Token_Type
) {
  const rec = await TokenRepository.findByToken(token);
  if (!rec) throw new Error("Invalid token");
  if (rec.type !== expectedType) throw new Error("Invalid token type");
  if (rec.expired_at < new Date()) {
    await TokenRepository.deleteById(rec.id);
    throw new Error("Token expired");
  }
  await TokenRepository.deleteById(rec.id);
  return rec.user_id;
}
