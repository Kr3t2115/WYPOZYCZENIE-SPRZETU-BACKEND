import {
    createAttribute,
    getAllAttributes,
    getAttributeById,
    getAttributeByName,
    getAttributeByNameWithoutId,
    update as updateAttribute,
} from '../repositories/attribute.js'
import { ConflictError } from '../utils/errors.js'

const create = async (data) => {
    const attribute = await getAttributeByName(data.name)

    if (attribute) {
        throw new ConflictError('Attribute already exists')
    }

    return createAttribute(data)
}

const update = async (id, data) => {
    const attribute = await getAttributeById(id)

    if (!attribute) {
        throw new ConflictError('Attribute already exists')
    }

    if (data.name) {
        const attribute = await getAttributeByNameWithoutId(data.name, id)

        if (attribute) {
            throw new ConflictError('Attribute already exists')
        }
    }

    return updateAttribute(id, data)
}

const getById = async (id) => {
    return getAttributeById(id)
}

const getAll = async (id) => {
    return getAllAttributes(id)
}

export { create, update, getById, getAll }
