import * as attributeService from '../services/attribute.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newAttribute = await attributeService.create(req.body)
        return res.status(201).json(newAttribute)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const attributes = await attributeService.getAll(filters, pagination)
        return res.status(200).json(attributes)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const attribute = await attributeService.getById(req.params.id)
        return res.status(200).json(attribute)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedAttribute = await attributeService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(updatedAttribute)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
