import * as attributesOptionsRepository from '../repositories/attributes-options.repository.js'
import * as attributeRepository from '../repositories/attribute.repository.js'

import { ConflictError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { AttributeType } from '@prisma/client'

const create = async (data) => {
    const attribute = await attributeRepository.findById(data.attributeId)

    if (!attribute) {
        throw new ConflictError('Attribute not found')
    }

    if (attribute.type !== AttributeType.SELECT) {
        throw new ConflictError('Attribute with this type cannot have options')
    }

    const attributeOptions =
        await attributesOptionsRepository.findByAttributeIdAndValue(data)

    if (attributeOptions) {
        throw new ConflictError('Attribute id with this value exist')
    }

    return attributesOptionsRepository.insert(data)
}

const update = async (id, data) => {
    const attributeOption = await attributesOptionsRepository.findById(id)

    if (!attributeOption) {
        throw new ConflictError('Attribute options with this id already exists')
    }

    if (data.value) {
        const check =
            await attributesOptionsRepository.findByAttributeIdAndValueWithoutId(
                attributeOption.attributeId,
                data.value,
                id
            )

        if (check) {
            throw new ConflictError('Attribute with this value exist')
        }
    }

    return attributesOptionsRepository.update(id, data)
}

const getById = async (id) => {
    const attributeOption = await attributesOptionsRepository.findById(id)
    if (!attributeOption)
        throw new ConflictError('Attribute options with this id does not exist')
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
