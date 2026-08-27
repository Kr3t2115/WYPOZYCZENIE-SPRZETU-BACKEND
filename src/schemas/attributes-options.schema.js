import { z } from 'zod'
import { paginationFields, uuidField, queryBoolean } from './common.schema.js'

const attributeIdField = uuidField
const orderField = z.int().optional()
const valueField = z.string().max(100)

const createSchema = z.object({
    attributeId: attributeIdField,
    value: valueField,
})

const updateSchema = z.object({
    value: valueField.optional(),
    order: orderField, // optionally in base
})

const getSchema = z.object({
    ...paginationFields.shape,
    attributeId: attributeIdField.optional(),
    required: queryBoolean, // optionally in base
})

export { createSchema, getSchema, updateSchema }
