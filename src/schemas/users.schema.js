import { z } from 'zod'
import { paginationFields, queryBoolean, uuidField } from './common.schema.js'
import { Role } from '@prisma/client'

const firstNameField = z.string().min(1).max(100)
const lastNameField = z.string().min(1).max(100)
const isActiveField = queryBoolean
const roleField = z.enum(Role)

const updateSchema = z.object({
    isActive: isActiveField.optional(),
    role: roleField.optional(),
    firstName: firstNameField.optional(),
    lastName: lastNameField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
    isActive: isActiveField.optional(),
    role: roleField.optional(),
    firstName: firstNameField.optional(),
    lastName: lastNameField.optional(),
})

export { updateSchema, getSchema }
