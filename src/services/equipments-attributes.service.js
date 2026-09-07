import * as equipmentsAttributeRepository from '../repositories/equipments-attributes.repository.js'
import * as attributeRepository from '../repositories/attribute.repository.js'
import * as attributeOptionsRepository from '../repositories/attributes-options.repository.js'

import { ConflictError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { AttributeType } from '@prisma/client'

const create = async (equipmentId, data) => {
    const checkUnique =
        await equipmentsAttributeRepository.findByEquipmentAndAttributeId(
            equipmentId,
            data.attributeId
        )

    if (checkUnique) {
        throw new ConflictError('Equipment with this attribute already exists')
    }

    const attribute = await attributeRepository.findById(data.attributeId)

    if (!attribute) {
        throw new ConflictError('')
    }

    let valueFields = {}

    if (data.attributeOptionId) {
        if (attribute.type !== AttributeType.SELECT) {
            throw new ConflictError(
                'Cannot update attributeOptionId where is not SELECT'
            )
        }

        const attributeOption = await attributeOptionsRepository.findById(
            data.attributeOptionId
        )

        if (!attributeOption) {
            throw new ConflictError('Attribute option does not exist')
        }

        valueFields = {
            attributeOption: { connect: { id: data.attributeOptionId } },
        }
    } else if (data.value) {
        if (attribute.type === AttributeType.SELECT) {
            throw new ConflictError('Cannot update value where is SELECT')
        }

        valueFields = { value: data.value }
    }

    return equipmentsAttributeRepository.insert({
        equipment: { connect: { id: equipmentId } },
        attribute: { connect: { id: data.attributeId } },
        ...valueFields,
    })
}

const getAll = async (equipmentId, filters, pagination, role) => {
    const where = buildWhere(equipmentId, filters, role)

    const [data, total] = await Promise.all([
        equipmentsAttributeRepository.findAll(where, pagination),
        equipmentsAttributeRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (equipmentId, filters, role) => {
    const where = {}

    where.equipmentId = equipmentId

    return where
}

const getById = async (id) => {
    const equipment = await equipmentsAttributeRepository.findById(id)
    if (!equipment) {
        throw new ConflictError(`Equipment with id: ${id} not exist`)
    }
    return equipment
}

const update = async (id, data) => {
    const equipmentAttribute = await equipmentsAttributeRepository.findById(id)
    if (!equipmentAttribute) {
        throw new ConflictError(`Equipment Attribute with id: ${id} not exist`)
    }

    let updatedData = {}

    const attribute = await attributeRepository.findById(
        equipmentAttribute.attributeId
    )

    console.log(attribute)

    if (attribute.type === AttributeType.SELECT) {
        if (!data.attributeOptionId) {
            throw new ConflictError('Attribute option does not exist')
        }

        updatedData = {
            attributeOption: { connect: { id: data.attributeOptionId } },
        }
    } else {
        if (!data.value) {
            throw new ConflictError('Value not exists')
        }

        updatedData = {
            value: data.value,
        }
    }

    return equipmentsAttributeRepository.update(id, updatedData)
}

export { create, getAll, getById, update }
