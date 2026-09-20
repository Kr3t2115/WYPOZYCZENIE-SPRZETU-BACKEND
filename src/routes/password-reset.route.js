import express from 'express'

import {
    requestReset,
    verifyToken,
    resetPassword,
} from '../controllers/password-reset.controller.js'
import {
    requestResetSchema,
    resetPasswordSchema,
} from '../schemas/password-reset.schema.js'

import { validate } from '../middleware/validate.middleware.js'

const passwordResetRoutes = express.Router()

passwordResetRoutes.post(
    '/forgot-password',
    validate(requestResetSchema),
    requestReset
)
passwordResetRoutes.get('/reset-password/:token', verifyToken)
passwordResetRoutes.post(
    '/reset-password',
    validate(resetPasswordSchema),
    resetPassword
)

export { passwordResetRoutes }
