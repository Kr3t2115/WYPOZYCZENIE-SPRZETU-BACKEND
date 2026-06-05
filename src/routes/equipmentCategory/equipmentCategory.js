import express from 'express';

import {getAllEquipmentCategory} from "../../controllers/equipmentCategory/getAllEquipmentCategory.js";
import {getEquipmentCategoryById} from "../../controllers/equipmentCategory/getEquipmentCategoryById.js";
import {createEquipmentCategory} from "../../controllers/equipmentCategory/createEquipmentCategory.js";
import {updateEquipmentCategory} from "../../controllers/equipmentCategory/updateEquipmentCategory.js";



const equipmentCategoryRoutes = express.Router();

equipmentCategoryRoutes.get('/', getAllEquipmentCategory)

equipmentCategoryRoutes.get('/:id', getEquipmentCategoryById)
equipmentCategoryRoutes.post('/', createEquipmentCategory)
equipmentCategoryRoutes.put('/:id', updateEquipmentCategory)


export {equipmentCategoryRoutes}