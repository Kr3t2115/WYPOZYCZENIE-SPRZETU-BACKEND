import express from 'express'

import { authMiddleware } from '../middleware/auth.middleware.js'

import { authRoutes } from './auth.route.js'
import { categoryRoutes } from './category.route.js'
import { equipmentRoutes } from './equipment.route.js'
import { attributeRoutes } from './attribute.route.js'
import { categoryAttributesRoutes } from './category-attributes.route.js'
import { attributeOptionsRoutes } from './attributes-options.route.js'
import { equipmentAttributeRoutes } from './equipments-attributes.route.js'
import { reservationsRoutes } from './reservations.route.js'
import { rentalsRoutes } from './rental.route.js'
import { rentalExtensionRoutes } from './rental-extension.route.js'
import { faultsRoutes } from './fault.route.js'
import { faultsPhotosRoutes } from './fault-photo.route.js'

const route = express.Router()

// NOT PROTECTED ROUTES

route.use('/auth', authRoutes)

// PROTECTED ROUTES ONLY FOR LOGGED USER
route.use(authMiddleware)

route.use('/faults', faultsRoutes)
route.use('/faults/:faultdId/photos', faultsPhotosRoutes)
route.use('/reservations', reservationsRoutes)
route.use('/rentals/extensions', rentalExtensionRoutes)
route.use('/rentals', rentalsRoutes)
route.use('/equipment/:equipmentId/attributes', equipmentAttributeRoutes)
route.use('/equipment/attributes/options', attributeOptionsRoutes)
route.use('/equipment/attributes', attributeRoutes)
route.use('/equipment/category-attributes', categoryAttributesRoutes)
route.use('/equipment/categories', categoryRoutes)
route.use('/equipment', equipmentRoutes)

export default route
