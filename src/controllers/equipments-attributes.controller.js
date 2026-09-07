import * as equipmentsAttributeService from '../services/equipments-attributes.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        let data = req.body
        let equipmentId = req.params.equipmentId

        const equipment = await equipmentsAttributeService.create(
            equipmentId,
            req.body
        )
        return res.status(201).json(equipment)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const equipments = await equipmentsAttributeService.getAll(
            req.params.equipmentId,
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
        const equipment = await equipmentsAttributeService.getById(
            req.params.id
        )
        return res.status(200).json(equipment)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const equipments = await equipmentsAttributeService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(equipments)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
