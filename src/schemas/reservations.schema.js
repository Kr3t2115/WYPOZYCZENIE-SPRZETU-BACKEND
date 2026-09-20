import { z } from 'zod'
import { ReservationStatus } from '@prisma/client'
import {
    paginationFields,
    uuidField,
    ddmmyyyyToDateField,
} from './common.schema.js'

const equipmentIdField = uuidField
const dateField = ddmmyyyyToDateField.refine(
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
