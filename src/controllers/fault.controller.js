import * as faultService from '../services/fault.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newFault = await faultService.create(req.body, req.user)
        return res.status(201).json(newFault)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const faults = await faultService.getAll(filters, pagination, req.user)
        return res.status(200).json(faults)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const fault = await faultService.getById(req.params.id)
        return res.status(200).json(fault)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedFault = await faultService.update(req.params.id, req.body)
        return res.status(200).json(updatedFault)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
