import express from 'express';

import {getAllEquipmentCategory} from "../../controllers/equipmentCategory/getAllEquipmentCategory.js";
import {getEquipmentCategoryById} from "../../controllers/equipmentCategory/getEquipmentCategoryById.js";
import {createEquipmentCategory} from "../../controllers/equipmentCategory/createEquipmentCategory.js";
import {updateEquipmentCategory} from "../../controllers/equipmentCategory/updateEquipmentCategory.js";

import {validate} from "../../middleware/validate.js";
import {createSchema} from "../../validators/equipmentCategory/createSchema.js";
import {updateSchema} from "../../validators/equipmentCategory/updateSchema.js";
import {roleMiddleware} from "../../middleware/roleMiddleware.js";

import { Role } from "@prisma/client";


const equipmentCategoryRoutes = express.Router();

equipmentCategoryRoutes.get('', getAllEquipmentCategory)
equipmentCategoryRoutes.get('/:id', getEquipmentCategoryById)


equipmentCategoryRoutes.use(roleMiddleware([Role.IT_STAFF, Role.SECRETARIAT]))

equipmentCategoryRoutes.post('', validate(createSchema), createEquipmentCategory)
equipmentCategoryRoutes.put('/:id', validate(updateSchema), updateEquipmentCategory)

export {equipmentCategoryRoutes}