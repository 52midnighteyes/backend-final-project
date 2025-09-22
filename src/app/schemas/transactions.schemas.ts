import { z } from "zod";

export const AddOnSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

export const CreateTransactionSchema = z.object({
  room_type_id: z.string(),
  special_request: z.string().optional().nullable(),
  add_on: z.array(AddOnSchema).optional().default([]),
});

export const CreateOnGoingTransactionSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "start_date must be in YYYY-MM-DD format",
  }),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "end_date must be in YYYY-MM-DD format",
  }),
  property_id: z.string({ message: "property_id must be a valid UUID" }),
  room_type_id: z.string({ message: "room_type_id must be a valid UUID" }),
});

export const uploadPaymentProofSchema = z.object({
  transaction_id: z.uuid().nonempty(),
});

export const confirmTransactionSchema = z.object({
  transaction_id: z.uuid().nonempty(),
  status: z.enum(["PAID", "PAYMENT_PROOF_REJECTED"]).nonoptional(),
});
