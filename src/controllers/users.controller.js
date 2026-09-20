import * as usersService from '../services/users.service.js'
import { getPaginationParams } from '../utils/pagination.util.js'

const list = async (req, res, next) => {
    try {
        const { page, limit, ...filters } = req.query
        const pagination = getPaginationParams(page, limit)

        const users = await usersService.getAll(filters, pagination, req.user)
        return res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}

const show = async (req, res, next) => {
    try {
        const user = await usersService.getById(req.params.id)
        return res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedUser = await usersService.update(req.params.id, req.body)
        return res.status(200).json(updatedUser)
    } catch (err) {
        next(err)
    }
}

export { list, show, update }
