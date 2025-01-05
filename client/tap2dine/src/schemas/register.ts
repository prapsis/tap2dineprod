import {z} from 'zod'

export const registerSchema = z.object({
    username:z.string().min(1 ,{message:"Username is required"}),
    password: z.string().min(8 ,{message:"Password must contain at least 8 characters"}),
    password2: z.string().min(1 ,{message:"Confirm Password is required"}),
    email: z.string().email().min(1 ,{message:"Email is required"}),
}).superRefine(({ password2, password }, ctx) => {
    if (password2 !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords do not match',
            path: ['password2'],
        })
    }
})

export type TRegisterType = z.infer<typeof registerSchema>