import express from 'express'
import {
    validate,
    VALIDATION_SOURCE,
} from '../middleware/validate.middleware.js'
import { idWithOptionalTokenSchema } from '../schemas/common.schema.js'
import { store } from '../controllers/fault-photo.controller.js'
import { faultPhotosUpload } from '../lib/upload.lib.js'

const faultsPhotosRoutes = express.Router({ mergeParams: true })

faultsPhotosRoutes.post(
    '/uploads',
    validate(idWithOptionalTokenSchema, VALIDATION_SOURCE.PARAMS),
    faultPhotosUpload.array('images', 20),
    store
)

export { faultsPhotosRoutes }
