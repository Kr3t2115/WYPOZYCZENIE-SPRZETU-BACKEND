import * as categoryRepository from '../repositories/category.repository.js'
import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'

const getAll = async (filters, pagination) => {
    const where = buildWhere(filters)

    const [data, total] = await Promise.all([
        categoryRepository.findAll(where, pagination),
        categoryRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters) => {
    const where = {}

    if (filters.name) {
        where.name = { contains: filters.name, mode: 'insensitive' }
    }

    if (filters.description) {
        where.description = {
            contains: filters.description,
            mode: 'insensitive',
        }
    }
    return where
}

const create = async (data) => {
    const categoryByName = await categoryRepository.findByName(data.name)
    if (categoryByName) {
        throw new ConflictError(`Kategoria z tą nazwą istnieje`)
    }
    return categoryRepository.insert(data)
}

const update = async (id, data) => {
    const category = await categoryRepository.findById(id)
    if (!category) {
        throw new NotFoundError('Kategoria nie istnieje')
    }

    if (data.name) {
        const categoryExist = await categoryRepository.findByName(data.name, id)

        if (categoryExist) {
            throw new ConflictError(`Kategoria z tą nazwą istnieje`)
        }
    }

    return categoryRepository.update(id, data)
}

const getById = async (id) => {
    const category = await categoryRepository.findById(id)
    if (!category) {
        throw new NotFoundError('Kategoria nie istnieje')
    }
    return category
}

export { create, update, getAll, getById }
