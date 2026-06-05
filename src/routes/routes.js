import express from 'express';
import {authRoutes} from './auth/auth.js';
import {equipmentCategoryRoutes} from "./equipmentCategory/equipmentCategory.js";
import {equipment} from "./equipment/equipment.js";

const routes = express.Router();

routes.use('/auth', authRoutes);

routes.use('/equipment', equipment);
routes.use('/equipment/category', equipmentCategoryRoutes);



export default routes;