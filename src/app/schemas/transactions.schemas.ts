import { z } from "zod";

export const AddOnSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  price: z.number(),
});

export const CreateTransactionSchema = z.object({
  user_id: z.uuid(),
  property_id: z.uuid(),
  room_type_id: z.uuid(),
  special_request: z.string().optional().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  add_on: z.array(AddOnSchema).optional().default([]),
});
