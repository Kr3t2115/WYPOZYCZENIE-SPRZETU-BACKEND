import express from 'express'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import { createSchema, updateSchema } from '../schemas/attribute.schema.js'
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

attributeRoutes.get('/', list)

attributeRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

// ONLY FOR IT STAFF AND SECRETARIAT
attributeRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

attributeRoutes.post('/', validateMiddleware(createSchema), store)

attributeRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

export { attributeRoutes }
