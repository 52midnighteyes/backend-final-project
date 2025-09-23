import { z } from "zod";

export const getPropertySechema = z.object({
  property_id: z.string().nonempty(),
});
