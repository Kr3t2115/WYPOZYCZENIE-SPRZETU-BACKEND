import express from 'express'

import {
    login,
    isLogged,
    refresh,
    logout,
} from '../controllers/auth.controller.js'

import { validate } from '../middleware/validate.middleware.js'
import { loginSchema } from '../schemas/auth.schema.js'

import { authMiddleware } from '../middleware/auth.middleware.js'
import { passwordResetRoutes } from './password-reset.route.js'

const authRoutes = express.Router()

authRoutes.post('/login', validate(loginSchema), login)
authRoutes.post('/refresh', refresh)
authRoutes.post('/logout', logout)
authRoutes.use(passwordResetRoutes)

//  PROTECTED ROUTES
authRoutes.use(authMiddleware)
authRoutes.get('/is-logged', isLogged)

export { authRoutes }
