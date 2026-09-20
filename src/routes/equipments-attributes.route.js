import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/equipments-attributes.controller.js'

import {
    validate,
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
    validate(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    validate(getSchema, VALIDATION_SOURCE.QUERY),
    list
)
equipmentAttributeRoutes.get(
    '/:id',
    validate(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    show
)

equipmentAttributeRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

equipmentAttributeRoutes.post(
    '/',
    validate(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    validate(createSchema),
    store
)
equipmentAttributeRoutes.patch(
    '/:id',
    validate(equipmentIdParams, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

export { equipmentAttributeRoutes }
