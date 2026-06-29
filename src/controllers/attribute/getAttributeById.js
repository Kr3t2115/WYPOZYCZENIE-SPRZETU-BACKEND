import { getById } from '../../services/attribute.js'

const getAttributeById = async (req, res, next) => {
    try {
        const attribute = await getById(req.params.id)
        return res.status(200).json(attribute)
    } catch (err) {
        next(err)
    }
}

export { getAttributeById }
