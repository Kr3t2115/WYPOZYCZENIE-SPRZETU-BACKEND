import {z} from "zod"
import {emailField, passwordField} from "./fields.js";

const loginSchema = z.object({
    email: emailField,
    password: passwordField,
})

export {loginSchema}