import { getById } from '../../services/equipment.js'

const getEquipmentById = async (req, res, next) => {
    try {
        const equipments = await getById(req.params.id)
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { getEquipmentById }
