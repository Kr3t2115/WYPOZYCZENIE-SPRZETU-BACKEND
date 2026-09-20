import { z } from 'zod'
import { paginationFields } from './common.schema.js'

const nameField = z.string().min(3).max(100)
const descriptionField = z.string().min(3).max(500)
const shortCodeField = z.string().min(3).max(5).toUpperCase()

const createSchema = z.object({
    name: nameField,
    description: descriptionField,
    shortCode: shortCodeField,
})

const updateSchema = z.object({
    name: nameField.optional(),
    description: descriptionField.optional(),
    shortCode: shortCodeField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
    name: nameField.optional(),
    description: descriptionField.optional(),
    shortCode: shortCodeField.optional(),
})

export { createSchema, updateSchema, getSchema }
