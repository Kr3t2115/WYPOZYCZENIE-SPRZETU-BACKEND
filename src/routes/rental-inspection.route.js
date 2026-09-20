import express from 'express'

import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import {
    createSchema,
    updateSchema,
    getSchema,
} from '../schemas/rental-inspection.schema.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import {
    list,
    store,
    show,
    update,
} from '../controllers/rental-inspection.controller.js'

const rentalInspectionRoutes = express.Router()

rentalInspectionRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

rentalInspectionRoutes.get(
    '/',
    validate(getSchema, VALIDATION_SOURCE.QUERY),
    list
)

rentalInspectionRoutes.get(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    show
)

rentalInspectionRoutes.patch(
    '/:id',
    validate(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    validate(updateSchema),
    update
)

rentalInspectionRoutes.post('/', validate(createSchema), store)

export { rentalInspectionRoutes }
