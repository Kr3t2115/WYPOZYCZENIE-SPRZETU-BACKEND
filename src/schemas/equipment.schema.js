import { z } from 'zod'
import { EquipmentStatus } from '@prisma/client'
import { paginationFields, uuidField } from './common.schema.js'

const nameField = z.string().min(3).max(100)
const serialNumberField = z.string().min(3).max(100)
const inventoryNumberField = z.string().min(3).max(20)
const statusField = z.enum(EquipmentStatus)

const createSchema = z.object({
    name: nameField,
    serialNumber: serialNumberField,
    categoryId: uuidField,
})

const updateSchema = z.object({
    name: nameField.optional(),
    status: statusField.optional(),
    serialNumber: serialNumberField.optional(),
    categoryId: uuidField.optional(),
})

const getSchema = z.object({
    ...paginationFields.shape,
    name: nameField.optional(),
    status: statusField.optional(),
    inventoryNumber: inventoryNumberField.optional(),
    serialNumber: serialNumberField.optional(),
    categoryId: uuidField.optional(),
})

export { createSchema, updateSchema, getSchema }
