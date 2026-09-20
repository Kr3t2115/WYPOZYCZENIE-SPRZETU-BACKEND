import * as attributesOptionsService from '../services/attributes-options.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newAttributeOption = await attributesOptionsService.create(
            req.body
        )
        return res.status(201).json(newAttributeOption)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const attributeOptions = await attributesOptionsService.getAll(
            filters,
            pagination
        )
        return res.status(200).json(attributeOptions)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const attributeOption = await attributesOptionsService.getById(
            req.params.id
        )
        return res.status(200).json(attributeOption)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedAttributeOption = await attributesOptionsService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(updatedAttributeOption)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
