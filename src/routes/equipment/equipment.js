import express from 'express';

import {getAllEquipments} from "../../controllers/equipment/getAllEquipments.js";
import {getEquipmentById} from "../../controllers/equipment/getEquipmentById.js";
import {createEquipment} from "../../controllers/equipment/createEquipment.js";
import {updateEquipment} from "../../controllers/equipment/updateEquipment.js";

const equipment = express.Router();

equipment.get('/', getAllEquipments)
equipment.get('/:id', getEquipmentById)
equipment.post('/', createEquipment)
equipment.put('/:id', updateEquipment)


export {equipment}