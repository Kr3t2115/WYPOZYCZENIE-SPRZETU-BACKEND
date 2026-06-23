import { getAllCategories } from '../../services/equipmentCategory.js'

const getAllEquipmentCategory = async (req, res, next) => {
    try {
        const categories = await getAllCategories()
        return res.status(200).json(categories)
    } catch (err) {
        next(err)
    }
}

export { getAllEquipmentCategory }
