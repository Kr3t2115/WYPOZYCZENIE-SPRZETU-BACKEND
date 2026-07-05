import { z } from 'zod'

const emailField = z.string().email()
const passwordField = z.string().min(8, '')

const loginSchema = z.object({
    email: emailField,
    password: passwordField,
})

export { loginSchema }
