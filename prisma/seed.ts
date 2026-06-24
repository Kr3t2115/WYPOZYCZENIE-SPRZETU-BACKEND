import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'
// @ts-ignore
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await bcrypt.hash(process.env.BASIC_PASSWORD, 12)

    const student = await prisma.user.upsert({
        where: { id: 'cat-1' },
        update: {},
        create: {
            id: v4(),
            email: 'user@user.com',
            password: password,
            role: 'STUDENT',
            firstName: 'user',
            lastName: 'user',
        },
    })

    const secretariat = await prisma.user.upsert({
        where: { id: 'cat-1' },
        update: {},
        create: {
            id: v4(),
            email: 'secretary@user.com',
            password: password,
            role: 'SECRETARIAT',
            firstName: 'user',
            lastName: 'user',
        },
    })

    const it = await prisma.user.upsert({
        where: { id: 'cat-1' },
        update: {},
        create: {
            id: v4(),
            email: 'it@user.com',
            password: password,
            role: 'IT_STAFF',
            firstName: 'user',
            lastName: 'user',
        },
    })

    console.log('✅ Użytkownicy dodani')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
