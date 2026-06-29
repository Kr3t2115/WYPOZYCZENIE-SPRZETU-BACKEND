import { getAll } from '../../services/attribute.js'

const getAllAttributes = async (req, res, next) => {
    try {
        const attributes = await getAll()
        return res.status(200).json(attributes)
    } catch (err) {
        next(err)
    }
}

export { getAllAttributes }
