import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/category-attributes.controller.js'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/category-attributes.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { Role } from '@prisma/client'
import { roleMiddleware } from '../middleware/role.middleware.js'

const categoryAttributesRoutes = express.Router()

categoryAttributesRoutes.get(
    '/',
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)
categoryAttributesRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

categoryAttributesRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

categoryAttributesRoutes.post('/', validateMiddleware(createSchema), store)
categoryAttributesRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

export { categoryAttributesRoutes }
