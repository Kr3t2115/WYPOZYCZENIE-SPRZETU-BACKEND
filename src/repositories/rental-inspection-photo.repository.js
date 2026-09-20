import { prisma } from '../lib/db.lib.js'

const insertMany = async (data) => {
    return prisma.inspectionPhoto.createMany({
        data: data,
    })
}

const remove = async (id) => {
    return prisma.inspectionPhoto.delete({
        where: {
            id: id,
        },
    })
}

export { insertMany, remove as delete }
