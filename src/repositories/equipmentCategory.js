import {prisma} from "../config/db.js";

const create = (data) => {
    return prisma.equipmentCategory.create({
        data: {
            name: data.name,
            description: data.description,
        }
    })
}

const update = (id, data) => {
    return prisma.equipmentCategory.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            description: data.description,
        }
    })
}

const getById = async (id) => {
    return prisma.equipmentCategory.findUnique(
        {where: {id: id}});
}

const getCategoryByName = (name) => {
    return prisma.equipmentCategory.findFirst({where: {name: {equals: name, mode: 'insensitive'}}});
}

const getByNameWithoutId = async (name, id) => {
    return prisma.equipmentCategory.findFirst({
        where: {
            AND: [
                { name: { equals: name, mode: 'insensitive' } },
                { id: { not: id } }
            ]
        }
    })
}

const getCategories = () => {
    return prisma.equipmentCategory.findMany()
}



export {getCategoryByName, getCategories, getById, create, update, getByNameWithoutId}