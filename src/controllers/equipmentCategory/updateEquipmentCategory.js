import { update } from '../../services/equipmentCategory.js'

const updateEquipmentCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = req.body
        const category = await update(id, data)
        res.status(200).json(category)
    } catch (err) {
        next(err)
    }
}

export { updateEquipmentCategory }
