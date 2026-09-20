import express from 'express'

import {
    validate,
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

faultsRoutes.get('/', validate(getSchema, VALIDATION_SOURCE.QUERY), list)

faultsRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

faultsRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

faultsRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

faultsRoutes.post('/', validate(createSchema), store)

export { faultsRoutes }
