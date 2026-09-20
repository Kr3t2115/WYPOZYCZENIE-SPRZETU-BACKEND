import * as rentalInspectionService from '../services/rental-inspection.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const store = async (req, res, next) => {
    try {
        const newRentalInspection = await rentalInspectionService.create(
            req.body,
            req.user
        )
        return res.status(201).json(newRentalInspection)
    } catch (err) {
        next(err)
    }
}

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const rentalInspections = await rentalInspectionService.getAll(
            filters,
            pagination,
            req.user
        )
        return res.status(200).json(rentalInspections)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const rentalInspection = await rentalInspectionService.getById(
            req.params.id
        )
        return res.status(200).json(rentalInspection)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedRentalInspection = await rentalInspectionService.update(
            req.params.id,
            req.body
        )
        return res.status(200).json(updatedRentalInspection)
    } catch (err) {
        next(err)
    }
}

export { store, list, show, update }
