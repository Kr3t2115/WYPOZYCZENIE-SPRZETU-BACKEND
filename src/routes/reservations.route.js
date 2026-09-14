import express from 'express'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/reservations.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import {
    list,
    store,
    show,
    update,
} from '../controllers/reservations.controller.js'

const reservationsRoutes = express.Router()

reservationsRoutes.get(
    '/',
    validateMiddleware(getSchema, VALIDATION_SOURCE.QUERY),
    list
)

reservationsRoutes.get(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

reservationsRoutes.patch(
    '/:id',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validateMiddleware(updateSchema),
    update
)

// Dodawanie rezerwacji możliwe tylko dla studentów
reservationsRoutes.use(roleMiddleware([Role.STUDENT]))

reservationsRoutes.post('/', validateMiddleware(createSchema), store)

export { reservationsRoutes }
