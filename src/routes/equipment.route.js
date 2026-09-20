import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/equipment.controller.js'

import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/equipment.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { Role } from '@prisma/client'
import { roleMiddleware } from '../middleware/role.middleware.js'

const equipmentRoutes = express.Router()

equipmentRoutes.get('/', validate(getSchema, VALIDATION_SOURCE.QUERY), list)
equipmentRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

equipmentRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

equipmentRoutes.post('/', validate(createSchema), store)
equipmentRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

export { equipmentRoutes }
