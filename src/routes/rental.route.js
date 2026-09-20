import express from 'express'

import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/rental.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import { list, store, show, update } from '../controllers/rental.controller.js'

const rentalsRoutes = express.Router()

rentalsRoutes.get('/', validate(getSchema, VALIDATION_SOURCE.QUERY), list)

rentalsRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

rentalsRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

rentalsRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

rentalsRoutes.post('/', validate(createSchema), store)

export { rentalsRoutes }
