import { z } from "zod";

export const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(50, { message: "Category name must be less than 50 characters" }),
  quantity_available: z.coerce
    .number()
    .int()
    .min(0, { message: "Quantity must be a positive number" }),
});

export type TIngredientType = z.infer<typeof ingredientSchema>;
