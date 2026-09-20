import { PrismaClient } from '@prisma/client'
// @ts-ignore
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await bcrypt.hash(process.env.BASIC_PASSWORD, 12)

    // ─────────────────────────────────────────
    // USERS
    // ─────────────────────────────────────────
    await prisma.user.upsert({
        where: { email: 'user@user.com' },
        update: {},
        create: {
            email: 'user@user.com',
            password,
            role: 'STUDENT',
            firstName: 'user',
            lastName: 'user',
        },
    })

    const secretariat = await prisma.user.upsert({
        where: { email: 'secretary@user.com' },
        update: {},
        create: {
            email: 'secretary@user.com',
            password,
            role: 'SECRETARIAT',
            firstName: 'user',
            lastName: 'user',
        },
    })

    const it = await prisma.user.upsert({
        where: { email: 'it@user.com' },
        update: {},
        create: {
            email: 'it@user.com',
            password,
            role: 'IT_STAFF',
            firstName: 'user',
            lastName: 'user',
        },
    })

    console.log('✅ Użytkownicy dodani')

    // ─────────────────────────────────────────
    // CATEGORIES
    // ─────────────────────────────────────────
    const laptopCategory = await prisma.category.upsert({
        where: { name: 'Laptopy' },
        update: {},
        create: {
            name: 'Laptopy',
            description: 'Laptopy do wypożyczenia dla studentów i pracowników',
        },
    })

    const monitorCategory = await prisma.category.upsert({
        where: { name: 'Monitory' },
        update: {},
        create: {
            name: 'Monitory',
            description: 'Monitory zewnętrzne',
        },
    })

    const mouseCategory = await prisma.category.upsert({
        where: { name: 'Myszki' },
        update: {},
        create: {
            name: 'Myszki',
            description: 'Myszki komputerowe, przewodowe i bezprzewodowe',
        },
    })

    console.log('✅ Kategorie dodane')

    // ─────────────────────────────────────────
    // ATTRIBUTES
    // ─────────────────────────────────────────
    const ramAttribute = await prisma.attribute.upsert({
        where: { name: 'RAM' },
        update: {},
        create: { name: 'RAM', type: 'NUMBER', unit: 'GB' },
    })

    const cpuAttribute = await prisma.attribute.upsert({
        where: { name: 'Procesor' },
        update: {},
        create: { name: 'Procesor', type: 'TEXT' },
    })

    const colorAttribute = await prisma.attribute.upsert({
        where: { name: 'Kolor' },
        update: {},
        create: { name: 'Kolor', type: 'SELECT' },
    })

    const wirelessAttribute = await prisma.attribute.upsert({
        where: { name: 'Bezprzewodowa' },
        update: {},
        create: { name: 'Bezprzewodowa', type: 'BOOLEAN' },
    })

    const screenSizeAttribute = await prisma.attribute.upsert({
        where: { name: 'Przekątna ekranu' },
        update: {},
        create: { name: 'Przekątna ekranu', type: 'NUMBER', unit: '"' },
    })

    console.log('✅ Atrybuty dodane')

    // ─────────────────────────────────────────
    // ATTRIBUTE OPTIONS (tylko dla SELECT)
    // ─────────────────────────────────────────
    const colorOptions = ['Czarny', 'Biały', 'Szary']

    const createdColorOptions = {}
    for (const [index, value] of colorOptions.entries()) {
        const option = await prisma.attributeOption.upsert({
            where: {
                attributeId_value: {
                    attributeId: colorAttribute.id,
                    value,
                },
            },
            update: {},
            create: {
                attributeId: colorAttribute.id,
                value,
                order: index,
            },
        })
        createdColorOptions[value] = option
    }

    console.log('✅ Opcje atrybutów dodane')

    // ─────────────────────────────────────────
    // CATEGORY <-> ATTRIBUTE (które atrybuty ma dana kategoria)
    // ─────────────────────────────────────────
    const categoryAttributeLinks = [
        {
            categoryId: laptopCategory.id,
            attributeId: ramAttribute.id,
            required: true,
            order: 0,
        },
        {
            categoryId: laptopCategory.id,
            attributeId: cpuAttribute.id,
            required: true,
            order: 1,
        },
        {
            categoryId: laptopCategory.id,
            attributeId: colorAttribute.id,
            required: false,
            order: 2,
        },
        {
            categoryId: monitorCategory.id,
            attributeId: screenSizeAttribute.id,
            required: true,
            order: 0,
        },
        {
            categoryId: monitorCategory.id,
            attributeId: colorAttribute.id,
            required: false,
            order: 1,
        },
        {
            categoryId: mouseCategory.id,
            attributeId: wirelessAttribute.id,
            required: true,
            order: 0,
        },
        {
            categoryId: mouseCategory.id,
            attributeId: colorAttribute.id,
            required: false,
            order: 1,
        },
    ]

    for (const link of categoryAttributeLinks) {
        await prisma.categoryAttribute.upsert({
            where: {
                categoryId_attributeId: {
                    categoryId: link.categoryId,
                    attributeId: link.attributeId,
                },
            },
            update: {},
            create: link,
        })
    }

    console.log('✅ Powiązania kategoria-atrybut dodane')

    // ─────────────────────────────────────────
    // EQUIPMENT
    // ─────────────────────────────────────────
    const laptop1 = await prisma.equipment.upsert({
        where: { inventoryNumber: 'SAN/LAP/000001' },
        update: {},
        create: {
            name: 'Dell Latitude 5420',
            serialNumber: 'DL5420-0001',
            inventoryNumber: 'SAN/LAP/000001',
            categoryId: laptopCategory.id,
            status: 'AVAILABLE',
        },
    })

    const laptop2 = await prisma.equipment.upsert({
        where: { inventoryNumber: 'SAN/LAP/000002' },
        update: {},
        create: {
            name: 'Lenovo ThinkPad T14',
            serialNumber: 'LTP14-0002',
            inventoryNumber: 'SAN/LAP/000002',
            categoryId: laptopCategory.id,
            status: 'AVAILABLE',
        },
    })

    const monitor1 = await prisma.equipment.upsert({
        where: { inventoryNumber: 'SAN/MON/000001' },
        update: {},
        create: {
            name: 'LG UltraWide 29"',
            serialNumber: 'LGUW-0001',
            inventoryNumber: 'SAN/MON/000001',
            categoryId: monitorCategory.id,
            status: 'AVAILABLE',
        },
    })

    const mouse1 = await prisma.equipment.upsert({
        where: { inventoryNumber: 'SAN/MOU/000001' },
        update: {},
        create: {
            name: 'Logitech MX Master 3',
            serialNumber: 'LGMX3-0001',
            inventoryNumber: 'SAN/MOU/000001',
            categoryId: mouseCategory.id,
            status: 'MAINTENANCE',
        },
    })

    console.log('✅ Sprzęt dodany')

    // ─────────────────────────────────────────
    // EQUIPMENT ATTRIBUTES (wartości cech dla konkretnego sprzętu)
    // ─────────────────────────────────────────
    const equipmentAttributeValues = [
        { equipmentId: laptop1.id, attributeId: ramAttribute.id, value: '16' },
        {
            equipmentId: laptop1.id,
            attributeId: cpuAttribute.id,
            value: 'Intel Core i5-1145G7',
        },
        {
            equipmentId: laptop1.id,
            attributeId: colorAttribute.id,
            attributeOptionId: createdColorOptions['Czarny'].id,
        },

        { equipmentId: laptop2.id, attributeId: ramAttribute.id, value: '32' },
        {
            equipmentId: laptop2.id,
            attributeId: cpuAttribute.id,
            value: 'AMD Ryzen 7 PRO 5850U',
        },
        {
            equipmentId: laptop2.id,
            attributeId: colorAttribute.id,
            attributeOptionId: createdColorOptions['Czarny'].id,
        },

        {
            equipmentId: monitor1.id,
            attributeId: screenSizeAttribute.id,
            value: '29',
        },
        {
            equipmentId: monitor1.id,
            attributeId: colorAttribute.id,
            attributeOptionId: createdColorOptions['Szary'].id,
        },

        {
            equipmentId: mouse1.id,
            attributeId: wirelessAttribute.id,
            value: 'true',
        },
        {
            equipmentId: mouse1.id,
            attributeId: colorAttribute.id,
            attributeOptionId: createdColorOptions['Biały'].id,
        },
    ]

    for (const item of equipmentAttributeValues) {
        await prisma.equipmentAttribute.upsert({
            where: {
                equipmentId_attributeId: {
                    equipmentId: item.equipmentId,
                    attributeId: item.attributeId,
                },
            },
            update: {},
            create: item,
        })
    }

    console.log('✅ Wartości atrybutów sprzętu dodane')
    console.log('🎉 Seed zakończony pomyślnie')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
