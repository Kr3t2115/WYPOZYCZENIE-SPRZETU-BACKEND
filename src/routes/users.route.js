import express from 'express'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import { updateSchema, getSchema } from '../schemas/users.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import { list, show, update } from '../controllers/users.controller.js'

const usersRoutes = express.Router()

usersRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

usersRoutes.get(
    '/',
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)

usersRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

usersRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

export { usersRoutes }
