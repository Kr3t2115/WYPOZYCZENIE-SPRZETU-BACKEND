import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/equipment.controller.js'

import {
    validateMiddleware,
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

equipmentRoutes.get(
    '/',
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)
equipmentRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

equipmentRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

equipmentRoutes.post('/', validateMiddleware(createSchema), store)
equipmentRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

export { equipmentRoutes }
