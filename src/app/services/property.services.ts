import prisma from "../lib/prisma";
import { AppError } from "../classes/appError.class";
import { findPropertyById } from "../repositories/property.repository";
import { error } from "console";

export async function getPropertyService(property_id: string) {
  try {
    const property = await findPropertyById(prisma, property_id);
    return property;
  } catch (err) {
    throw err;
  }
}
