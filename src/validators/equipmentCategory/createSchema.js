import {z} from "zod"
import {nameField, descriptionField} from "./fields.js";

const createSchema = z.object({
    name: nameField,
    description: descriptionField,
})

export {createSchema}