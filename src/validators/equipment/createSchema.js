import { z } from 'zod'
import {
    nameField,
    statusField,
    inventoryNumberField,
    serialNumberField,
} from './fields.js'
import { uuidField } from '../common/schemas.js'

const createSchema = z.object({
    name: nameField,
    status: statusField,
    inventoryNumber: inventoryNumberField,
    serialNumber: serialNumberField,
    categoryId: uuidField,
})

export { createSchema }
