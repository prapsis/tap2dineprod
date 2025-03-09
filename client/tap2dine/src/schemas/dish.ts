import { z } from "zod";

// Updated schema to match the required API format
export const dishSchema = z.object({
  name: z
    .string()
    .max(100, "Name must be at most 100 characters")
    .nonempty("Name is required"),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .positive("Price must be a positive number")
    .max(99999.99, "Price must be at most 99999.99"),
  ingredients: z.array(
    z.object({
      ingredient: z.string(),
      quantity_required: z.coerce.number().int().positive("Quantity must be a positive number")
    })
  ),
  add_ons: z.array(z.coerce.number()).optional(),
  category: z.string().min(1, "Category ID is required"),
});

// For internal use in your components
export type TDishType = z.infer<typeof dishSchema>;