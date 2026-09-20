import express from 'express'

import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/attribute.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import {
    list,
    store,
    show,
    update,
} from '../controllers/attribute.controller.js'

const attributeRoutes = express.Router()

attributeRoutes.get('/', validate(getSchema, VALIDATION_SOURCE.QUERY), list)

attributeRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

// ONLY FOR IT STAFF AND SECRETARIAT
attributeRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

attributeRoutes.post('/', validate(createSchema), store)

attributeRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

export { attributeRoutes }
