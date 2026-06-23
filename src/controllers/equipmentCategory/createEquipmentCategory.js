import { create } from '../../services/equipmentCategory.js'

const createEquipmentCategory = async (req, res, next) => {
    const { name, description } = req.body

    try {
        const category = await create({ name, description })
        return res.status(201).json(category)
    } catch (err) {
        next(err)
    }
}

export { createEquipmentCategory }
