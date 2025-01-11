import { z } from "zod";

export const addonSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(50, { message: "Category name must be less than 50 characters" }),
  price: z.coerce
    .number()
    .positive("Price must be a positive number")
    .max(99999.99, "Price must be at most 99999.99"),
});

export type TAddonType = z.infer<typeof addonSchema>;
