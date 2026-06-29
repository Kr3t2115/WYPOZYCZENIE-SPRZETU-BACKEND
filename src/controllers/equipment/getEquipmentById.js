import { getById } from '../../services/equipment.js'

const getEquipmentById = async (req, res, next) => {
    try {
        const equipment = await getById(req.params.id)
        return res.status(200).json(equipment)
    } catch (err) {
        next(err)
    }
}

export { getEquipmentById }
