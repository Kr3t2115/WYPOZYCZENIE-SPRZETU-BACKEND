import { z } from 'zod'

export const requestResetSchema = z.object({
    email: z.string().email('Nieprawidłowy adres email'),
})

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, 'Brak tokena'),
        newPassword: z.string(),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Hasła nie są identyczne',
        path: ['confirmPassword'],
    })
