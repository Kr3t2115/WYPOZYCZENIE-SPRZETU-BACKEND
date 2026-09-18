import { z } from 'zod'
import { paginationFields, uuidField } from './common.schema.js'
import { ExtensionStatus } from '@prisma/client'

const dateRegex = /^(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})$/
const ddmmyyyyToDate = z
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
const dateField = ddmmyyyyToDate.refine(
    (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date > today
    },
    { message: 'Data nie może być z przeszłości' }
)
const rejectionReasonField = z.string().min(1).max(1000)

const statusField = z.enum(ExtensionStatus)

const createSchema = z.object({
    rentalId: uuidField,
    newDueDate: dateField,
})

const updateSchema = z.object({
    rejectReason: rejectionReasonField.optional(),
    status: statusField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
})

export { updateSchema, createSchema, getSchema }
