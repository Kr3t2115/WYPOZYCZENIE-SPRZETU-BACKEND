import * as faultService from '../services/fault.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const equipment = await faultService.create(req.body, req.user)
        return res.status(201).json(equipment)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const equipments = await faultService.getAll(
            filters,
            pagination,
            req.user
        )
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const equipment = await faultService.getById(req.params.id)
        return res.status(200).json(equipment)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const equipments = await faultService.update(req.params.id, req.body)
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
