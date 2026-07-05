import { z } from 'zod'
import { AttributeType } from '@prisma/client'
import { limitField, pageField } from './common.schema.js'

const nameField = z.string().min(3).max(100)
const typeField = z.enum(AttributeType)
const unitField = z.string().min(1).max(5).optional()

const createSchema = z.object({
    name: nameField,
    type: typeField,
    unit: unitField,
})

const updateSchema = z.object({
    name: nameField.optional(),
    type: typeField.optional(),
    unit: unitField, // optionaly in base
})

const getSchema = z.object({
    page: pageField,
    limit: limitField,
    name: nameField.optional(),
    type: typeField.optional(),
    unit: unitField, // optional in base
})

export { createSchema, updateSchema, getSchema }
