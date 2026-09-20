import * as categoryService from '../services/category.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newCategory = await categoryService.create(req.body)
        return res.status(201).json(newCategory)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const categories = await categoryService.getAll(filters, pagination)
        return res.status(200).json(categories)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const category = await categoryService.getById(req.params.id)
        return res.status(200).json(category)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedCategory = await categoryService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(updatedCategory)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
