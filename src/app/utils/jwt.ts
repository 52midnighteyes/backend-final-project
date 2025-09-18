import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../configs/config";

export async function tokenDecoder(token: string) {
  const verifyToken = verify(token, SECRET_KEY as string);

  return verifyToken;
}
