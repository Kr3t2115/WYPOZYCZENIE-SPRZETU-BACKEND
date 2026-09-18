import { z } from 'zod'
import { RentalStatus } from '@prisma/client'
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

const dateField = ddmmyyyyToDate.refine(
    (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date > today
    },
    { message: 'Data rozpoczęcia nie może być z przeszłości' }
)

const statusField = z.enum(RentalStatus)

const RentalCreationMode = Object.freeze({
    FROM_RESERVATION: 'FROM_RESERVATION',
    MANUAL: 'MANUAL',
})

const fromReservationSchema = z.object({
    mode: z.literal(RentalCreationMode.FROM_RESERVATION),
    reservationId: uuidField,
})

const manualSchema = z.object({
    mode: z.literal(RentalCreationMode.MANUAL),
    studentId: uuidField,
    equipmentId: uuidField,
    startDate: dateField,
    dueDate: dateField,
})

const createSchema = z.discriminatedUnion('mode', [
    fromReservationSchema,
    manualSchema,
])

const updateSchema = z.object({
    status: statusField.optional(),
    returnedAt: dateField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
    equipmentId: uuidField.optional(),
    startDate: dateField.optional(),
    endDate: dateField.optional(),
    status: statusField.optional(),
    studentId: statusField.optional(),
    issuedBy: uuidField.optional(),
    receivedBy: uuidField.optional(),
    returnedAt: dateField.optional(),
})

export { updateSchema, createSchema, getSchema, RentalCreationMode }
