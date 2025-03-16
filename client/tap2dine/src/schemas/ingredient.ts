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
  unit: z.string().min(1, { message: "Unit is required" }).max(10, { message: "Unit must be less than 10 characters" }),
});

export type TIngredientType = z.infer<typeof ingredientSchema>;
