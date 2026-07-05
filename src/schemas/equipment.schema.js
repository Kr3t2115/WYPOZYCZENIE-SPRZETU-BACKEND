import { z } from 'zod'
import { EquipmentStatus } from '@prisma/client'
import { uuidField } from './common.schema.js'

const nameField = z.string().min(3).max(100)
const serialNumberField = z.string().min(3).max(100)
// TODO: ZMIENIĆ POTEM NA AUTOMATYCZNE GENEROWANIE NUMERU INWENTARZOWEGO
const inventoryNumberField = z.string().min(3).max(50)
const statusField = z.enum(EquipmentStatus)

const createSchema = z.object({
    name: nameField,
    status: statusField,
    inventoryNumber: inventoryNumberField,
    serialNumber: serialNumberField,
    categoryId: uuidField,
})

const updateSchema = z.object({
    name: nameField.optional(),
    status: statusField.optional(),
    inventoryNumber: inventoryNumberField.optional(),
    serialNumber: serialNumberField.optional(),
    categoryId: uuidField.optional(),
})

export {
    nameField,
    serialNumberField,
    inventoryNumberField,
    statusField,
    createSchema,
    updateSchema,
}
