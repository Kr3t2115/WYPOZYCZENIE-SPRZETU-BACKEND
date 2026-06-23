import express from 'express';
import {authRoutes} from './auth/auth.js';
import {equipmentCategoryRoutes} from "./equipmentCategory/equipmentCategory.js";
import {equipment} from "./equipment/equipment.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const routes = express.Router();

routes.use('/auth', authRoutes);

// PROTECTED ROUTES ONLY FOR LOGGED USER

routes.use(authMiddleware);
routes.use('/equipment/categories', equipmentCategoryRoutes);
routes.use('/equipment', equipment);



export default routes;