import express from 'express'

import {
    list,
    store,
    show,
    update,
    destroy,
} from '../controllers/category-attributes.controller.js'

import {
    validate,
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
    validate(getSchema, VALIDATION_SOURCE.QUERY),
    list
)
categoryAttributesRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

categoryAttributesRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

categoryAttributesRoutes.post('/', validate(createSchema), store)
categoryAttributesRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)
categoryAttributesRoutes.delete(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    destroy
)

export { categoryAttributesRoutes }
