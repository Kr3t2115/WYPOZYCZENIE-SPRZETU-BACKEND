import { create } from '../../services/attribute.js'

const createAttribute = async (req, res, next) => {
    try {
        const equipment = await create(req.body)
        return res.status(201).json(equipment)
    } catch (err) {
        next(err)
    }
}

export { createAttribute }
