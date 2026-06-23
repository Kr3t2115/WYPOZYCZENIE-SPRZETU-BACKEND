import {getById} from "../../services/equipmentCategory.js";
import {errorHandler} from "../../utils/errorHandler.js";

const getEquipmentCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await getById(id);
        res.status(200).json(category);
    }
    catch(err) {
        next(err);
    }
}

export {getEquipmentCategoryById}