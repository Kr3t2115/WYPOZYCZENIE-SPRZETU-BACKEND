import { z } from 'zod'
import {
    paginationFields,
    uuidField,
    ddmmyyyyToDateField,
} from './common.schema.js'
import { ExtensionStatus } from '@prisma/client'

const dateField = ddmmyyyyToDateField.refine(
    (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date > today
    },
    { message: 'Data rozpoczęcia nie może być z przeszłości' }
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
