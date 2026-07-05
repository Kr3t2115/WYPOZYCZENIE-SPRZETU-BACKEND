import * as attributeRepository from '../repositories/attribute.repository.js'
import * as categoryRepository from '../repositories/category.repository.js'

import { ConflictError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'

const create = async (data) => {
    const attribute = await attributeRepository.findByName(data.name)

    if (attribute) {
        throw new ConflictError('Attribute already exists')
    }

    return attributeRepository.insert(data)
}

const update = async (id, data) => {
    const attribute = await attributeRepository.findById(id)

    if (!attribute) {
        throw new ConflictError('Attribute already exists')
    }

    if (data.name) {
        const attribute = await attributeRepository.findByNameWithoutId(
            data.name,
            id
        )

        if (attribute) {
            throw new ConflictError('Attribute already exists')
        }
    }

    return attributeRepository.update(id, data)
}

const getById = async (id) => {
    return attributeRepository.findById(id)
}

const getAll = async (filters, pagination) => {
    const where = buildWhere(filters)

    const [data, total] = await Promise.all([
        attributeRepository.findAll(where, pagination),
        attributeRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters) => {
    const where = {}

    if (filters.name) {
        where.name = { contains: filters.name, mode: 'insensitive' }
    }
    if (filters.unit) {
        where.unit = { equals: filters.unit, mode: 'insensitive' }
    }
    if (filters.type) {
        where.type = filters.type
    }

    return where
}

export { create, update, getById, getAll }
