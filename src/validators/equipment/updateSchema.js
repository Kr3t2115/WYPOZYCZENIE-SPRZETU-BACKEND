import { z } from 'zod'
import {
    nameField,
    statusField,
    inventoryNumberField,
    serialNumberField,
} from './fields.js'
import { uuidField } from '../common/schemas.js'

const updateSchema = z.object({
    name: nameField.optional(),
    status: statusField.optional(),
    inventoryNumber: inventoryNumberField.optional(),
    serialNumber: serialNumberField.optional(),
    categoryId: uuidField.optional(),
})

export { updateSchema }
