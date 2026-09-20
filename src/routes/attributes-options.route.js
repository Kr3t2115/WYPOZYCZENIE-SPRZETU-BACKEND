import express from 'express'

import {
    list,
    store,
    show,
    update,
} from '../controllers/attributes-options.controller.js'

import {
    validate,
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
    validate(getSchema, VALIDATION_SOURCE.QUERY),
    list
)
attributeOptionsRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

attributeOptionsRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

attributeOptionsRoutes.post('/', validate(createSchema), store)
attributeOptionsRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

export { attributeOptionsRoutes }
