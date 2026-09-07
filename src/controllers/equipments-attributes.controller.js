import * as equipmentService from '../services/equipment.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const equipment = await equipmentService.create(req.body)
        return res.status(201).json(equipment)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const equipments = await equipmentService.getAll(
            filters,
            pagination,
            req.user.role
        )
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const equipment = await equipmentService.getById(req.params.id)
        return res.status(200).json(equipment)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const equipments = await equipmentService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
