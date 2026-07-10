import * as categoryAttributesService from '../services/category-attributes.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

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
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const categoryAttributes = await categoryAttributesService.getAll(
            filters,
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

export { store, list, show, update }
