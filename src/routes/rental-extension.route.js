import express from 'express'

import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/rental-extension.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import {
    list,
    store,
    show,
    update,
} from '../controllers/rental-extension.controller.js'

const rentalExtensionRoutes = express.Router()

rentalExtensionRoutes.get(
    '/',
    validate(getSchema, VALIDATION_SOURCE.QUERY),
    list
)

rentalExtensionRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

rentalExtensionRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

rentalExtensionRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

rentalExtensionRoutes.post('/', validate(createSchema), store)

export { rentalExtensionRoutes }
