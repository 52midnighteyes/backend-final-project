import prisma from "../lib/prisma";
import { AppError } from "../classes/appError.class";
import {
  ICreateAddOnsParams,
  IGetAllAddOnsParams,
} from "../interfaces/add-ons-interface";

export async function CreateAddOnService(params: ICreateAddOnsParams) {
  try {
    const response = await prisma.$transaction(async (tx) => {
      const ok = await tx.property.findFirst({
        where: {
          id: params.property_id,
          user_id: params.owner_id,
        },
      });

      if (!ok) throw new AppError(404, "There's no property found");

      return await tx.add_On.create({
        data: {
          name: params.name,
          property_id: params.property_id,
          description: params.description,
          price: params.price,
        },
      });
    });

    return response;
  } catch (err) {
    throw err;
  }
}

export async function GetAllAddOnService(params: IGetAllAddOnsParams) {
  try {
    const response = await prisma.add_On.findMany({
      where: {
        property: {
          id: params.property_id,
        },
      },
    });

    if (response.length < 1) {
      console.log("there's no add ons in this property");
    }

    return response;
  } catch (err) {
    throw err;
  }
}
