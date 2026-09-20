import * as equipmentsAttributeRepository from '../repositories/equipments-attributes.repository.js'
import * as attributeRepository from '../repositories/attribute.repository.js'
import * as attributeOptionsRepository from '../repositories/attributes-options.repository.js'

import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { AttributeType } from '@prisma/client'

const create = async (equipmentId, data) => {
    const attribute = await attributeRepository.findById(data.attributeId)

    if (!attribute) {
        throw new NotFoundError('Ten atrybut nie istnieje')
    }

    const checkUnique =
        await equipmentsAttributeRepository.findByEquipmentAndAttributeId(
            equipmentId,
            data.attributeId
        )

    if (checkUnique) {
        throw new ConflictError('Sprzęt z tym atrybutem już istnieje')
    }

    let valueFields = {}

    if (data.attributeOptionId) {
        if (attribute.type !== AttributeType.SELECT) {
            throw new ConflictError(
                'Nie można zaktualizować attributeOptionId jeżeli typ atrybutu to nie jest SELECT (pole wyboru)'
            )
        }

        const attributeOption = await attributeOptionsRepository.findById(
            data.attributeOptionId
        )

        if (!attributeOption) {
            throw new NotFoundError('Opcja atrybutu nie istnieje')
        }

        valueFields = {
            attributeOption: { connect: { id: data.attributeOptionId } },
        }
    } else if (data.value) {
        if (attribute.type === AttributeType.SELECT) {
            throw new ConflictError(
                'Nie można zaktualizować wartości jeżeli pole to SELECT (lista wyboru)'
            )
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
    const equipmentAttribute = await equipmentsAttributeRepository.findById(id)
    if (!equipmentAttribute) {
        throw new NotFoundError(`Atrybut sprzętu nie istnieje`)
    }
    return equipmentAttribute
}

const update = async (id, data) => {
    const equipmentAttribute = await equipmentsAttributeRepository.findById(id)
    if (!equipmentAttribute) {
        throw new NotFoundError(`Atrybut sprzętu nie istnieje`)
    }

    let updatedData = {}

    const attribute = await attributeRepository.findById(
        equipmentAttribute.attributeId
    )

    if (attribute.type === AttributeType.SELECT) {
        if (!data.attributeOptionId) {
            throw new NotFoundError('Opcja atrybutu nie istnieje')
        }

        updatedData = {
            attributeOption: { connect: { id: data.attributeOptionId } },
        }
    } else {
        if (!data.value) {
            throw new ConflictError('Brak wartości')
        }

        updatedData = {
            value: data.value,
        }
    }

    return equipmentsAttributeRepository.update(id, updatedData)
}

export { create, getAll, getById, update }
