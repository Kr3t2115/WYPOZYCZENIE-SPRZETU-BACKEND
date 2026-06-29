import { update } from '../../services/attribute.js'

const updateAttribute = async (req, res, next) => {
    try {
        const equipments = await update(req.params.id, req.body)
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { updateAttribute }
