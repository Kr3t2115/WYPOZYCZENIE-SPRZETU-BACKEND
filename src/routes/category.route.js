import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/category.controller.js'

import {
    validate,
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

categoryRoutes.get('', validate(getSchema, VALIDATION_SOURCE.QUERY), list)

categoryRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

// ONLY FOR IT STAFF AND SECRETARIAT
categoryRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

categoryRoutes.post('', validate(createSchema), store)

categoryRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

export { categoryRoutes }
