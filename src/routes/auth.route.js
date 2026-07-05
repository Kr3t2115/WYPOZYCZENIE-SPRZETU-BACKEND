import express from 'express'

import { login, isLogged } from '../controllers/auth.controller.js'

import { validateMiddleware } from '../middleware/validate.middleware.js'
import { loginSchema } from '../schemas/auth.schema.js'

import { authMiddleware } from '../middleware/auth.middleware.js'

const authRoutes = express.Router()
authRoutes.post('/login', validateMiddleware(loginSchema), login)
//  PROTECTED ROUTES
authRoutes.use(authMiddleware)
authRoutes.get('/is-logged', isLogged)

export { authRoutes }
