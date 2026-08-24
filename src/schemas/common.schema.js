import { z } from 'zod'

const uuidField = z.string().uuid()

const idParamsSchema = z.object({
    id: uuidField,
})

const queryBoolean = z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional()

const pageField = z.coerce.number().int().positive().optional()
const limitField = z.coerce.number().int().positive().optional()

const paginationFields = z.object({
    page: pageField,
    limit: limitField,
})

export { uuidField, idParamsSchema, paginationFields, queryBoolean }
