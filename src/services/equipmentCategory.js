import {getCategoryByName, getByNameWithoutId, getCategories, getById as getCategoryById, create as createCategory, update as updateCategory} from "../repositories/equipmentCategory.js"
import {ConflictError, NotFoundError} from "../utils/errors.js";
import {prisma} from "../config/db.js";


const getAllCategories = async () => {
    const categories = await getCategories()
    return categories;
}

const create = async (data) => {
        const categoryByName = await getCategoryByName(data.name);
        if (categoryByName) {
            throw new ConflictError(`Category with name: ${data.name} exist`);
        }
        return createCategory(data);
}

const update = async (id, data) => {
    await getById(id);

    if (data.name !== undefined) {
        const existing = await getByNameWithoutId(data.name, id);

        if (existing) {
            throw new ConflictError(`Category with name: ${data.name} exist`);
        }
    }

    return updateCategory(id, data);
}


const getById = async (id) => {
    const category = await getCategoryById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
}

export {create, update,getAllCategories, getById}