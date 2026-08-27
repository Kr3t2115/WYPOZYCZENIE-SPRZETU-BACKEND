import * as attributesOptionsService from '../services/attributes-options.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'
import { getSchema } from '../schemas/attributes-options.schema.js'

const store = async (req, res, next) => {
    try {
        const categoryAttribute = await attributesOptionsService.create(
            req.body
        )
        return res.status(201).json(categoryAttribute)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit } = req.query
        const pagination = getPaginationParams(page, limit)

        let parsedFilters = getSchema.parse(req.query)

        const categoryAttributes = await attributesOptionsService.getAll(
            parsedFilters,
            pagination
        )
        return res.status(200).json(categoryAttributes)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const categoryAttribute = await attributesOptionsService.getById(
            req.params.id
        )
        return res.status(200).json(categoryAttribute)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const categoryAttribute = await attributesOptionsService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(categoryAttribute)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
