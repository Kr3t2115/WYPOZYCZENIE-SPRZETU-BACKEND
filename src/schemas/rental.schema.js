import { z } from 'zod'
import { RentalStatus } from '@prisma/client'
import {
    paginationFields,
    uuidField,
    ddmmyyyyToDateField,
} from './common.schema.js'

const dateField = ddmmyyyyToDateField.refine(
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
    studentId: uuidField.optional(),
    issuedBy: uuidField.optional(),
    receivedBy: uuidField.optional(),
    returnedAt: dateField.optional(),
})

export { updateSchema, createSchema, getSchema, RentalCreationMode }
