import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/equipments-attributes.controller.js'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'

import {
    createSchema,
    updateSchema,
    getSchema,
    equipmentIdParams,
} from '../schemas/equipments-attributes.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { Role } from '@prisma/client'
import { roleMiddleware } from '../middleware/role.middleware.js'

const equipmentAttributeRoutes = express.Router({ mergeParams: true })

equipmentAttributeRoutes.get(
    '/',
    validateMiddleware(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)
equipmentAttributeRoutes.get(
    '/:id',
    validateMiddleware(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    show
)

equipmentAttributeRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

equipmentAttributeRoutes.post(
    '/',
    validateMiddleware(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(createSchema),
    store
)
equipmentAttributeRoutes.patch(
    '/:id',
    validateMiddleware(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

export { equipmentAttributeRoutes }
