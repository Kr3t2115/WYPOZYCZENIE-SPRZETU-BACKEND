import * as attributeRepository from '../repositories/attribute.repository.js'
import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { AttributeType } from '@prisma/client'

const create = async (data) => {
    const attribute = await attributeRepository.findByName(data.name)

    if (attribute) {
        throw new ConflictError('Atrybut o tej nazwie już istnieje')
    }

    return attributeRepository.insert(data)
}

const update = async (id, data) => {
    const attribute = await attributeRepository.findById(id)

    if (!attribute) {
        throw new NotFoundError('Atrybut nie istnieje')
    }

    if (data.name) {
        const attribute = await attributeRepository.findByName(data.name, id)

        if (attribute) {
            throw new ConflictError('Atrybut o tej nazwie już istnieje')
        }
    }

    return attributeRepository.update(id, data)
}

const getById = async (id) => {
    const attribute = await attributeRepository.findById(id)

    if (!attribute) {
        throw new NotFoundError('Atrybut nie istnieje')
    }

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
    if (filters.type && AttributeType.hasOwnProperty(filters.type)) {
        where.type = { equals: filters.type }
    }

    return where
}

export { create, update, getById, getAll }
