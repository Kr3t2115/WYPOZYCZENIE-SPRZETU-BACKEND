import { prisma } from '../lib/db.lib.js'

const insertMany = async (data) => {
    return prisma.faultPhoto.createMany({
        data: data,
    })
}

const remove = async (id) => {
    return prisma.faultPhoto.delete({
        where: {
            id: id,
        },
    })
}

export { insertMany, remove as delete }
