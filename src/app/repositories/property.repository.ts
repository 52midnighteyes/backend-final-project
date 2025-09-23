import { AppError } from "../classes/appError.class";
import { Db } from "../interfaces/prisma.types";

export async function findPropertyById(db: Db, property_id: string) {
  try {
    const response = await db.property.findUnique({
      where: {
        id: property_id,
      },
    });

    if (!response) throw new AppError(404, "Property Not Found");

    return response;
  } catch (err) {
    throw err;
  }
}
