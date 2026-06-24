import { z } from 'zod'
import {
    nameField,
    statusField,
    inventoryNumberField,
    serialNumberField,
    categoryIdField,
} from './fields.js'

const createSchema = z.object({
    name: nameField,
    status: statusField,
    inventoryNumber: inventoryNumberField,
    serialNumber: serialNumberField,
    categoryId: categoryIdField,
})

export { createSchema }
