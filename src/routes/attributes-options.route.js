import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/attributes-options.controller.js'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'

import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/attributes-options.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { Role } from '@prisma/client'
import { roleMiddleware } from '../middleware/role.middleware.js'

const attributeOptionsRoutes = express.Router()

attributeOptionsRoutes.get(
    '/',
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)
attributeOptionsRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

attributeOptionsRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

attributeOptionsRoutes.post('/', validateMiddleware(createSchema), store)
attributeOptionsRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

export { attributeOptionsRoutes }
