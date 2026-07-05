import * as categoryRepository from '../repositories/category.repository.js'
import { ConflictError, NotFoundError } from '../utils/errors.js'

const getAll = async () => {
    return categoryRepository.findAll()
}

const create = async (data) => {
    const categoryByName = await categoryRepository.findByName(data.name)
    if (categoryByName) {
        throw new ConflictError(`Category with name: ${data.name} exist`)
    }
    return categoryRepository.insert(data)
}

const update = async (id, data) => {
    await getById(id)

    if (data.name) {
        const categoryExist = await categoryRepository.findByNameWithoutId(
            data.name,
            id
        )

        if (categoryExist) {
            throw new ConflictError(`Category with name: ${data.name} exist`)
        }
    }

    return categoryRepository.update(id, data)
}

const getById = async (id) => {
    const category = await categoryRepository.findById(id)
    if (!category) throw new NotFoundError('Category not found')
    return category
}

export { create, update, getAll, getById }
