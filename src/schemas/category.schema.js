import { z } from 'zod'

const nameField = z.string().min(3).max(100)
const descriptionField = z.string().min(3).max(500)

const createSchema = z.object({
    name: nameField,
    description: descriptionField,
})

const updateSchema = z.object({
    name: nameField.optional(),
    description: descriptionField.optional(),
})

export { createSchema, updateSchema }
