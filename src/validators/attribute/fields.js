import { z } from 'zod'
import { AttributeType } from '@prisma/client'

const nameField = z.string().min(3).max(100)
const typeField = z.enum(AttributeType)
const unitField = z.string().min(1).max(5).optional()

export { nameField, typeField, unitField }
