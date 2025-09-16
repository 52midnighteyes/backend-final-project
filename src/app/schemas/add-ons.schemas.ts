import { z } from "zod";

export const GetAllAddOnSchema = z.object({
  property_id: z.string().trim().nonempty(),
});

export const CreateAddOnSchema = z.object({
  property_id: z.string().trim().nonempty(),
  name: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
  price: z.number().int().positive(),
});
