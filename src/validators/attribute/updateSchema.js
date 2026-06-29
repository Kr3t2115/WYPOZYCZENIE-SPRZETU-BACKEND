import { z } from 'zod'
import { nameField, typeField, unitField } from './fields.js'

const updateSchema = z.object({
    name: nameField.optional(),
    type: typeField.optional(),
    unit: unitField, // optionaly in base
})

export { updateSchema }
