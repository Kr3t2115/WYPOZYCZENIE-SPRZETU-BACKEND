import * as categoryAttributesRepository from '../repositories/category-attributes.repository.js'
import { ConflictError, NotFoundError } from '../utils/errors.util.js'
import { getPaginationMeta } from '../utils/pagination.util.js'

const getAll = async (filters, pagination) => {
    const where = buildWhere(filters)

    const [data, total] = await Promise.all([
        categoryAttributesRepository.findAll(where, pagination),
        categoryAttributesRepository.count(where),
    ])

    return { data, meta: getPaginationMeta(total, pagination) }
}

const buildWhere = (filters) => {
    const where = {}

    return where
}

const create = async (data) => {
    const checkAttributeExistence =
        await categoryAttributesRepository.findByCategoryIdAndAttributeId(data)

    if (checkAttributeExistence) {
        throw new ConflictError('Category with this attribute already exists')
    }

    const currentCountAttributes =
        await categoryAttributesRepository.countAttributesForCategory(
            data.categoryId
        )

    data.order = currentCountAttributes + 1

    return categoryAttributesRepository.insert(data)
}

const update = async (id, data) => {
    await getById(id)
    return categoryAttributesRepository.update(id, data)
}

const getById = async (id) => {
    const categoryAttribute = await categoryAttributesRepository.findById(id)
    if (!categoryAttribute) throw new NotFoundError('Category not found')
    return categoryAttribute
}

export { create, update, getAll, getById }
