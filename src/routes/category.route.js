import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/category.controller.js'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'

import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/category.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

const categoryRoutes = express.Router()

categoryRoutes.get(
    '',
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)

categoryRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

// ONLY FOR IT STAFF AND SECRETARIAT
categoryRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

categoryRoutes.post('', validateMiddleware(createSchema), store)

categoryRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

export { categoryRoutes }
