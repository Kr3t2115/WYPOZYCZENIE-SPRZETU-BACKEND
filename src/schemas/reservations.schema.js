import { z } from 'zod'
import { ReservationStatus } from '@prisma/client'
import { paginationFields, uuidField } from './common.schema.js'

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

const equipmentIdField = uuidField
const dateField = ddmmyyyyToDate.refine(
    (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date > today
    },
    { message: 'Data rozpoczęcia nie może być z przeszłości' }
)

const statusField = z.enum(ReservationStatus)
const notesField = z.string().min(1).max(1000).optional()

const reviewedByField = uuidField
const rejectionReasonField = z.string().min(1).max(1000).optional()

const createSchema = z.object({
    equipmentId: equipmentIdField,
    startDate: dateField,
    endDate: dateField,
    notes: notesField,
})

const updateSchema = z.object({
    // przez studenta
    equipmentId: equipmentIdField.optional(),
    startDate: dateField.optional(),
    endDate: dateField.optional(),
    status: statusField.optional(),
    notes: notesField,

    // przez sekretariat
    rejectionReason: rejectionReasonField,
    reviewedBy: reviewedByField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
    equipmentId: equipmentIdField.optional(),
    startDate: dateField.optional(),
    endDate: dateField.optional(),
    status: statusField.optional(),
    reviewedBy: reviewedByField.optional(),
    studentId: statusField.optional(),
})

export { updateSchema, createSchema, getSchema }
