import { z } from "zod";

export const tableSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Table name is required" })
    .max(50, { message: "Table name must be less than 50 characters" }),
});

export type TTableType = z.infer<typeof tableSchema>;
