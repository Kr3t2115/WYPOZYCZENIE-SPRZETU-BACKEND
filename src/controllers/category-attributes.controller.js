import * as categoryAttributesService from '../services/category-attributes.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'
import { getSchema } from '../schemas/category-attributes.schema.js'

const store = async (req, res, next) => {
    try {
        const categoryAttribute = await categoryAttributesService.create(
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

        const categoryAttributes = await categoryAttributesService.getAll(
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
        const categoryAttribute = await categoryAttributesService.getById(
            req.params.id
        )
        return res.status(200).json(categoryAttribute)
    } catch (err) {
        next(err)
    }
}

// TODO: Zrobić orderowanie tego bo obecnie nie można zmienić kolejności, bo wszystko się wywala

const update = async (req, res, next) => {
    try {
        const categoryAttribute = await categoryAttributesService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(categoryAttribute)
    } catch (err) {
        next(err)
    }
}

const destroy = async (req, res, next) => {
    try {
        await categoryAttributesService.delete(req.params.id)
        return res.status(200).json({
            message: 'Removed',
        })
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update, destroy }
