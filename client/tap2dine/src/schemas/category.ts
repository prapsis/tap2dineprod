import {z} from 'zod'

export const categorySchema = z.object({
    name:z.string().min(1 ,{message:"Category name is required"}).max(50,{message:"Category name must be less than 50 characters"}),
    description: z.string().max(200,{message:"Description must be less than 200 characters"}).optional()
})

export type TCategoryType = z.infer<typeof categorySchema>