import * as userRepository from '../repositories/users.repository.js'
import { NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'

const update = async (id, data) => {
    const user = await userRepository.findById(id)

    if (!user) {
        throw new NotFoundError('Nie znaleziono użytkownika')
    }

    return userRepository.update(id, data)
}

const getById = async (id) => {
    const user = await userRepository.findById(id)

    if (!user) {
        throw new NotFoundError('Nie znaleziono użytkownika')
    }

    return user
}

const getAll = async (filters, pagination) => {
    const where = buildWhere(filters)

    const [data, total] = await Promise.all([
        userRepository.findAll(where, pagination),
        userRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters) => {
    const where = {}

    return where
}

export { update, getAll, getById }
