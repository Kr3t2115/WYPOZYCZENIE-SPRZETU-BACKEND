import { paginationFields, queryBoolean, uuidField } from './common.schema.js'
import { z } from 'zod'

const equipmentIdField = uuidField
const attributeIdField = uuidField
const valueField = z.string().max(255).optional()
const attributeOptionIdField = uuidField.optional()

const equipmentIdParams = z.object({
    equipmentId: uuidField,
})

const createSchema = z.object({
    attributeId: attributeIdField,
    value: valueField,
    attributeOptionId: attributeOptionIdField,
})

const updateSchema = z.object({
    value: valueField,
    attributeOptionId: attributeOptionIdField,
})

const getSchema = z.object({
    ...paginationFields.shape,
    attributeId: attributeIdField.optional(),
    attributeOptionId: attributeOptionIdField.optional(),
})

export { createSchema, getSchema, updateSchema, equipmentIdParams }
