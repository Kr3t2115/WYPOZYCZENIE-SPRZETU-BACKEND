import express from 'express'

import {
    validate,
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

reservationsRoutes.get('/', validate(getSchema, VALIDATION_SOURCE.QUERY), list)

reservationsRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

reservationsRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

// Dodawanie rezerwacji możliwe tylko dla studentów
reservationsRoutes.use(roleMiddleware([Role.STUDENT]))

reservationsRoutes.post('/', validate(createSchema), store)

export { reservationsRoutes }
