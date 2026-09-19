import express from 'express'

import {
    validateMiddleware,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import { idParamsSchema } from '../schemas/common.schema.js'

import { roleMiddleware } from '../middleware/role.middleware.js'
import { Role } from '@prisma/client'

import { store } from '../controllers/fault-photo.controller.js'
import { inspectionPhotosUpload } from '../lib/upload.lib.js'

const rentalInspectionPhotoRoutes = express.Router()

rentalInspectionPhotoRoutes.use(
    roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT])
)

rentalInspectionPhotoRoutes.post(
    '/uploads',
    validateMiddleware(idParamsSchema, VALIDATION_SOURCE.PARAMS),
    inspectionPhotosUpload.array('images', 20),
    store
)

export { rentalInspectionPhotoRoutes }
