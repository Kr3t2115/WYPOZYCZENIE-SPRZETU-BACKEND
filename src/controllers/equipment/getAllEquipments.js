import { getAll } from '../../services/equipment.js'

const getAllEquipments = async (req, res, next) => {
    try {
        const equipments = await getAll(req.body)
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { getAllEquipments }
