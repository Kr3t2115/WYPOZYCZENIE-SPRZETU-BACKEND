import * as equipmentRepository from '../repositories/equipment.repository.js'
import { NotFoundError } from '../utils/errors.util.js'
import * as categoryRepository from '../repositories/category.repository.js'
import { getPaginationMeta } from '../utils/pagination.util.js'
import { EquipmentStatus, Role } from '@prisma/client'

const generateInventoryNumber = ({ categoryStatusCode, currentCount }) => {
    const sequence = (currentCount + 1).toString().padStart(6, '0')
    const normalizedCategoryCode = categoryStatusCode.toUpperCase()

    return `SAN/${normalizedCategoryCode}/${sequence}`
}

const create = async (data) => {
    const equipmentCategory = await categoryRepository.findById(data.categoryId)

    if (!equipmentCategory) {
        throw new NotFoundError('Taka kategoria nie istnieje')
    }

    const currentCount = await equipmentRepository.countByCategoryId(
        equipmentCategory.id
    )

    const inventoryNumber = generateInventoryNumber({
        categoryStatusCode: equipmentCategory.shortCode,
        currentCount,
    })

    let insertedData = {
        ...data,
        inventoryNumber,
    }

    return equipmentRepository.insert(insertedData)
}

const getAll = async (filters, pagination, role) => {
    const where = buildWhere(filters, role)

    const [data, total] = await Promise.all([
        equipmentRepository.findAll(where, pagination),
        equipmentRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters, user) => {
    const where = {}

    if (filters.name) {
        where.name = { contains: filters.name, mode: 'insensitive' }
    }

    const ALLOWED_STATUS_FILTER_ROLES = [Role.IT_STAFF, Role.SECRETARIAT]

    if (ALLOWED_STATUS_FILTER_ROLES.includes(user.role)) {
        if (filters.status && EquipmentStatus.hasOwnProperty(filters.status)) {
            where.status = { equals: filters.status }
        }
    } else {
        where.status = { equals: EquipmentStatus.AVAILABLE }
    }

    if (filters.inventoryNumber) {
        where.inventoryNumber = {
            contains: filters.inventoryNumber,
            mode: 'insensitive',
        }
    }
    if (filters.serialNumber) {
        where.serialNumber = {
            contains: filters.serialNumber,
            mode: 'insensitive',
        }
    }
    if (filters.categoryId) {
        where.categoryId = { equals: filters.categoryId }
    }
    return where
}

const getById = async (id) => {
    const equipment = await equipmentRepository.findById(id)

    if (!equipment) {
        throw new NotFoundError('Taki sprzęt nie istnieje')
    }

    return equipment
}

const update = async (id, data) => {
    const equipment = await equipmentRepository.findById(id)

    if (!equipment) {
        throw new NotFoundError('Taki sprzęt nie istnieje')
    }

    if (data.categoryId) {
        const equipmentCategory = await categoryRepository.findById(
            data.categoryId
        )

        if (!equipmentCategory) {
            throw new NotFoundError('Taka kategoria nie istnieje')
        }
    }

    return equipmentRepository.update(id, data)
}

export { create, getAll, getById, update }
