import { create } from '../../services/equipment.js'

const createEquipment = async (req, res, next) => {
    try {
        const equipment = await create(req.body)
        return res.status(201).json(equipment)
    } catch (err) {
        next(err)
    }
}

export { createEquipment }
