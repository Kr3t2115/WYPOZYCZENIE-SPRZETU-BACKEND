import { z } from 'zod'
import { nameField, typeField, unitField } from './fields.js'

const createSchema = z.object({
    name: nameField,
    type: typeField,
    unit: unitField,
})

export { createSchema }
