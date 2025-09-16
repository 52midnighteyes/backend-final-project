// import { TokenRepository } from "../repositories/token.repository";
// import { Temporary_Token_Type } from "@prisma/client";
// import { randomBytes } from "crypto";


// export async function generateVerificationToken(
//   userId: string,
//   type: Temporary_Token_Type = Temporary_Token_Type.RESET_EMAIL,
//   ttlMinutes = 30
// ) {
//   const token = randomBytes(32).toString("hex"); // random string
//   const expired_at = new Date(Date.now() + ttlMinutes * 60 * 1000);

//   const newToken = await TokenRepository.create({
//     token,
//     user_id: userId,
//     expired_at,
//     type,
//   });

//   return newToken;
// }


// export async function verifyAndConsumeToken(
//   token: string,
//   type: Temporary_Token_Type
// ) {
//   const record = await TokenRepository.findByToken(token);

//   if (!record) throw new Error("Invalid or expired token");
//   if (record.type !== type) throw new Error("Invalid token type");
//   if (record.expired_at < new Date()) {
//     await TokenRepository.deleteById(record.id);
//     throw new Error("Token expired");
//   }


//   await TokenRepository.deleteById(record.id);

//   return record.user_id;
// }
