import express from 'express'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/fault.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import { list, store, show, update } from '../controllers/fault.controller.js'

const faultsRoutes = express.Router()

faultsRoutes.get(
    '/',
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)

faultsRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

faultsRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

faultsRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

faultsRoutes.post('/', validateMiddleware(createSchema), store)

export { faultsRoutes }
