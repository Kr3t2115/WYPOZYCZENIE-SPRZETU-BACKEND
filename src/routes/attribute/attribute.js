import express from 'express'
import { validate, VALIDATION_SOURCE } from '../../middleware/validate.js'
import { idParamsSchema } from '../../validators/common/schemas.js'
import { roleMiddleware } from '../../middleware/roleMiddleware.js'
import { Role } from '@prisma/client'

import { createSchema } from '../../validators/attribute/createSchema.js'
import { updateSchema } from '../../validators/attribute/updateSchema.js'

import { getAllAttributes } from '../../controllers/attribute/getAllAttributes.js'
import { getAttributeById } from '../../controllers/attribute/getAttributeById.js'
import { createAttribute } from '../../controllers/attribute/createAttribute.js'
import { updateAttribute } from '../../controllers/attribute/updateAttribute.js'

const equipmentAttributesRoutes = express.Router()

equipmentAttributesRoutes.get('/', getAllAttributes)
equipmentAttributesRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    getAttributeById
)

equipmentAttributesRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

equipmentAttributesRoutes.post('/', validate(createSchema), createAttribute)
equipmentAttributesRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    updateAttribute
)

export { equipmentAttributesRoutes }
