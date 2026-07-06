import * as categoryService from '../services/category.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const equipment = await categoryService.create(req.body)
        return res.status(201).json(equipment)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const equipments = await categoryService.getAll(filters, pagination)
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const equipment = await categoryService.getById(req.params.id)
        return res.status(200).json(equipment)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const equipments = await categoryService.update(req.params.id, req.body)
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
