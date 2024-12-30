import {z} from 'zod'

export const registerSchema = z.object({
    username:z.string().min(1 ,{message:"Username is required"}),
    password: z.string().min(1 ,{message:"Password is required"}),
    confirmPassword: z.string().min(1 ,{message:"Confirm Password is required"}),
    email: z.string().email().min(1 ,{message:"Email is required"}),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        })
    }
})

export type TRegisterType = z.infer<typeof registerSchema>