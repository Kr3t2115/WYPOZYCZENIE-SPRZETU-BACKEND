import { z } from 'zod'

const uuidField = z.string().uuid()

const idParamsSchema = z.object({
    id: uuidField,
})

const pageField = z.coerce.number().int().positive().optional()
const limitField = z.coerce.number().int().positive().optional()

export { uuidField, idParamsSchema, pageField, limitField }
