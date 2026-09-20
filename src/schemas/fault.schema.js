import { z } from 'zod'
import { FaultSeverity, FaultStatus, OccurrenceType } from '@prisma/client'
import { paginationFields, uuidField } from './common.schema.js'

const descriptionField = z.string().min(10).max(1000)
const resolveNoteField = z.string().min(10).max(1000)

const severityField = z.enum(FaultSeverity)
const statusField = z.enum(FaultStatus)
const occurredDuringField = z.enum(OccurrenceType)

const createSchema = z.object({
    rentalId: uuidField,
    description: descriptionField,
    severity: severityField,
    occurredDuring: occurredDuringField,
})

const updateSchema = z.object({
    resolveNote: resolveNoteField.optional(),
    status: statusField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
})

export { createSchema, updateSchema, getSchema }
