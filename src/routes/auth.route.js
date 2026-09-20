import express from 'express'

import {
    login,
    isLogged,
    refresh,
    logout,
} from '../controllers/auth.controller.js'

import { validateMiddleware } from '../middleware/validate.middleware.js'
import { loginSchema } from '../schemas/auth.schema.js'

import { authMiddleware } from '../middleware/auth.middleware.js'

const authRoutes = express.Router()
authRoutes.post('/login', validateMiddleware(loginSchema), login)
authRoutes.post('/refresh', refresh)
authRoutes.post('/logout', logout)

//  PROTECTED ROUTES
authRoutes.use(authMiddleware)
authRoutes.get('/is-logged', isLogged)

export { authRoutes }
