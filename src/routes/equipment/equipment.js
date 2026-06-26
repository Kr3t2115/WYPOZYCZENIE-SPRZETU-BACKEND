import express from 'express'

import { getAllEquipments } from '../../controllers/equipment/getAllEquipments.js'
import { getEquipmentById } from '../../controllers/equipment/getEquipmentById.js'
import { createEquipment } from '../../controllers/equipment/createEquipment.js'
import { updateEquipment } from '../../controllers/equipment/updateEquipment.js'
import { roleMiddleware } from '../../middleware/roleMiddleware.js'

import { Role } from '@prisma/client'
import { validate, VALIDATION_SOURCE } from '../../middleware/validate.js'
import { createSchema } from '../../validators/equipment/createSchema.js'
import { idParamsSchema } from '../../validators/common/schemas.js'
import { updateSchema } from '../../validators/equipment/updateSchema.js'

const equipment = express.Router()

equipment.get('/', getAllEquipments)
equipment.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    getEquipmentById
)

equipment.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

equipment.post('/', validate(createSchema), createEquipment)
equipment.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    updateEquipment
)

export { equipment }
