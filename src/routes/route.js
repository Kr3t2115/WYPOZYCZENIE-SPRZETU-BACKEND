import express from 'express'

import { authRoutes } from './auth.route.js'
import { categoryRoutes } from './category.route.js'
import { equipmentRoutes } from './equipment.route.js'
import { attributeRoutes } from './attribute.route.js'
import { categoryAttributesRoutes } from './category-attributes.route.js'
import { attributeOptionsRoutes } from './attributes-options.route.js'

import { authMiddleware } from '../middleware/auth.middleware.js'

const route = express.Router()

// NOT PROTECTED ROUTES

route.use('/auth', authRoutes)

// PROTECTED ROUTES ONLY FOR LOGGED USER
route.use(authMiddleware)

route.use('/equipment/attributes/options', attributeOptionsRoutes)
route.use('/equipment/attributes', attributeRoutes)
route.use('/equipment/category-attributes', categoryAttributesRoutes)
route.use('/equipment/categories', categoryRoutes)
route.use('/equipment', equipmentRoutes)

export default route
