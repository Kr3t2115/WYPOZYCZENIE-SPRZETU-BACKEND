import express from 'express'
import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import { idWithOptionalTokenSchema } from '../schemas/common.schema.js'
import { store } from '../controllers/rental-inspection-photo.controller.js'
import { inspectionPhotosUpload } from '../lib/upload.lib.js'

const rentalInspectionPhotoRoutes = express.Router({ mergeParams: true })

rentalInspectionPhotoRoutes.post(
    '/uploads',
    validate(idWithOptionalTokenSchema, VALIDATION_SOURCE.PARAMS),
    inspectionPhotosUpload.array('images', 20),
    store
)

export { rentalInspectionPhotoRoutes }
