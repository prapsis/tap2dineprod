import { z } from "zod";

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
  ingredients: z.array(z.string()).optional(),
  add_ons: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
});

export type TDishType = z.infer<typeof dishSchema>;
