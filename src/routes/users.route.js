import express from 'express'

import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import { updateSchema, getSchema } from '../schemas/users.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import { list, show, update } from '../controllers/users.controller.js'

const usersRoutes = express.Router()

usersRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

usersRoutes.get('/', validate(getSchema, VALIDATION_SOURCE.QUERY), list)

usersRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

usersRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

export { usersRoutes }
