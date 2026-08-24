import { z } from 'zod'
import { paginationFields, uuidField, queryBoolean } from './common.schema.js'

const categoryIdField = uuidField
const attributeIdField = uuidField
const requiredField = z.boolean().optional().default(true)
const orderField = z.int().optional()

const createSchema = z.object({
    categoryId: categoryIdField,
    attributeId: attributeIdField,
    required: requiredField,
})

const updateSchema = z.object({
    categoryId: categoryIdField.optional(),
    attributeId: attributeIdField.optional(),
    required: requiredField, // optionally in base
    order: orderField, // optionally in base
})

const getSchema = z.object({
    ...paginationFields.shape,
    categoryId: categoryIdField.optional(),
    attributeId: attributeIdField.optional(),
    required: queryBoolean, // optionally in base
})

export { createSchema, getSchema, updateSchema }
