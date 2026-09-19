import { z } from 'zod'
import { paginationFields, uuidField } from './common.schema.js'
import { InspectionType } from '@prisma/client'

const notesField = z.string().min(10).max(1000)
const typeField = z.enum(InspectionType)

const createSchema = z.object({
    rentalId: uuidField,
    notes: notesField.optional(),
    type: typeField,
})

const updateSchema = z.object({
    notes: notesField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
})

export { createSchema, updateSchema, getSchema }
