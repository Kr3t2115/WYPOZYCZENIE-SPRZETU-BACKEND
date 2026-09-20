import * as attributesOptionsRepository from '../repositories/attributes-options.repository.js'
import * as attributeRepository from '../repositories/attribute.repository.js'

import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { AttributeType } from '@prisma/client'

const create = async (data) => {
    const attribute = await attributeRepository.findById(data.attributeId)

    if (!attribute) {
        throw new NotFoundError('Atrybut nie istnieje')
    }

    if (attribute.type !== AttributeType.SELECT) {
        throw new ConflictError('Atrybut nie jest o typie SELECT (listy)')
    }

    const attributeOptions =
        await attributesOptionsRepository.findByAttributeIdAndValue(
            data.attributeId,
            data.value
        )

    if (attributeOptions) {
        throw new ConflictError('Opcja listy o takiej wartości już istnieje')
    }

    return attributesOptionsRepository.insert(data)
}

const update = async (id, data) => {
    const attributeOption = await attributesOptionsRepository.findById(id)

    if (!attributeOption) {
        throw new NotFoundError('Taka opcja atrybutu nie istnieje')
    }

    if (data.value) {
        const valueCheck =
            await attributesOptionsRepository.findByAttributeIdAndValue(
                attributeOption.attributeId,
                data.value,
                id
            )

        if (valueCheck) {
            throw new ConflictError(
                'Opcja listy o takiej wartości już istnieje'
            )
        }
    }

    return attributesOptionsRepository.update(id, data)
}

const getById = async (id) => {
    const attributeOption = await attributesOptionsRepository.findById(id)
    if (!attributeOption) {
        throw new NotFoundError('Taka opcja atrybutu nie istnieje')
    }
    return attributeOption
}

const getAll = async (filters, pagination) => {
    const where = buildWhere(filters)

    const [data, total] = await Promise.all([
        attributesOptionsRepository.findAll(where, pagination),
        attributesOptionsRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters) => {
    const where = {}

    if (filters.attributeId) {
        where.attributeId = filters.attributeId
    }

    return where
}

export { create, update, getById, getAll }
