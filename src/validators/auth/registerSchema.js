import {z} from "zod"

const registerSchema = z.object({
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(8, ''),
    rePassword: z
        .string()
        .min(8, '')
}).refine((data) => data.password === data.rePassword, {
    message: "Hasła nie są takie same",
    path: ["rePassword", "password"],
});

export {registerSchema}