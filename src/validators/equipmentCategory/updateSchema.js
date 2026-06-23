import {z} from "zod"
import {nameField, descriptionField} from "./fields.js";

const updateSchema = z.object({
    name: nameField.optional(),
    description: descriptionField.optional(),
})

export {updateSchema}