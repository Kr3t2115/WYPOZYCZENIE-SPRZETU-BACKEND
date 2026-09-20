import * as equipmentsAttributeService from '../services/equipments-attributes.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newEquipmentAttribute = await equipmentsAttributeService.create(
            req.params.equipmentId,
            req.body
        )
        return res.status(201).json(newEquipmentAttribute)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const equipmentAttributes = await equipmentsAttributeService.getAll(
            req.params.equipmentId,
            filters,
            pagination,
            req.user
        )
        return res.status(200).json(equipmentAttributes)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const equipmentAttribute = await equipmentsAttributeService.getById(
            req.params.id
        )
        return res.status(200).json(equipmentAttribute)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedEquipmentAttribute =
            await equipmentsAttributeService.update(req.params.id, req.body)

        return res.status(200).json(updatedEquipmentAttribute)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
