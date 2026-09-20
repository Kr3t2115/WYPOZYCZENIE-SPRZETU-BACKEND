import { z } from 'zod'

const uuidField = z.string().uuid()

const idParamsSchema = z.object({
    id: uuidField,
})

const idWithOptionalTokenSchema = idParamsSchema.extend({
    token: z.string().min(10).optional(),
})

const dateRegex = /^(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})$/
const ddmmyyyyToDateField = z
    .string()
    .regex(dateRegex, { message: 'Data musi być w formacie dd-mm-yyyy' })
    .refine(
        (val) => {
            const match = val.match(dateRegex)
            if (!match?.groups) return false

            const { day, month, year } = match.groups

            const date = new Date(Number(year), Number(month) - 1, Number(day))
            return (
                date.getFullYear() === Number(year) &&
                date.getMonth() === Number(month) - 1 &&
                date.getDate() === Number(day)
            )
        },
        { message: 'Nieprawidłowa data' }
    )
    .transform((val) => {
        const match = val.match(dateRegex)

        const { day, month, year } = match.groups
        return new Date(Number(year), Number(month) - 1, Number(day))
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

export {
    uuidField,
    idParamsSchema,
    paginationFields,
    queryBoolean,
    ddmmyyyyToDateField,
    idWithOptionalTokenSchema,
}
