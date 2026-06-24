import { z } from 'zod'
import { EquipmentStatus } from '@prisma/client'

const nameField = z.string().min(3).max(100)
const serialNumberField = z.string().min(3).max(100)
// TODO: ZMIENIĆ POTEM NA AUTOMATYCZNE GENEROWANIE NUMERU INWENTARZOWEGO
const inventoryNumberField = z.string().min(3).max(50)
const statusField = z.enum(EquipmentStatus)
const categoryIdField = z.uuidv4()

export {
    nameField,
    serialNumberField,
    inventoryNumberField,
    statusField,
    categoryIdField,
}
