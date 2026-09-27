import { PrismaClient } from '@prisma/client'
// @ts-ignore
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
const DAY = 24 * 60 * 60 * 1000
const daysFromNow = (n, hour = 10) => {
    const d = new Date(Date.now() + n * DAY)
    d.setHours(hour, 0, 0, 0)
    return d
}
const isoDate = (n) => daysFromNow(n).toISOString().slice(0, 10)

// ─────────────────────────────────────────
// DEFINICJE ATRYBUTÓW
// (pokrywają wszystkie typy: TEXT, NUMBER, SELECT, DATE, BOOLEAN)
// ─────────────────────────────────────────
const ATTRIBUTES = {
    // komputery
    cpu: { name: 'Procesor', type: 'TEXT' },
    gpu: { name: 'Karta graficzna', type: 'TEXT' },
    ram: { name: 'RAM', type: 'NUMBER', unit: 'GB' },
    storage: { name: 'Dysk SSD', type: 'NUMBER', unit: 'GB' },
    os: {
        name: 'System operacyjny',
        type: 'SELECT',
        options: ['Windows 11 Pro', 'Ubuntu 24.04 LTS', 'macOS'],
    },
    screen: { name: 'Przekątna ekranu', type: 'NUMBER', unit: '"' },

    // mikrokontrolery / płytki
    chip: { name: 'Układ', type: 'TEXT' },
    clock: { name: 'Taktowanie', type: 'NUMBER', unit: 'MHz' },
    flash: { name: 'Pamięć Flash', type: 'NUMBER', unit: 'MB' },
    gpio: { name: 'Liczba pinów GPIO', type: 'NUMBER' },
    wifi: { name: 'Wi-Fi', type: 'BOOLEAN' },
    bluetooth: { name: 'Bluetooth', type: 'BOOLEAN' },

    // VR
    eyeRes: { name: 'Rozdzielczość na oko', type: 'TEXT' },
    refresh: { name: 'Odświeżanie', type: 'NUMBER', unit: 'Hz' },
    vrMode: {
        name: 'Tryb pracy',
        type: 'SELECT',
        options: ['Standalone', 'PC VR', 'Standalone + PC VR'],
    },
    handTracking: { name: 'Śledzenie dłoni', type: 'BOOLEAN' },
    battery: { name: 'Czas pracy na baterii', type: 'NUMBER', unit: 'h' },

    // druk 3D
    printTech: {
        name: 'Technologia druku',
        type: 'SELECT',
        options: ['FDM', 'SLA', 'SLS'],
    },
    buildVolume: { name: 'Pole robocze', type: 'TEXT' },
    nozzle: { name: 'Średnica dyszy', type: 'NUMBER', unit: 'mm' },
    multiMaterial: { name: 'Druk wielomateriałowy', type: 'BOOLEAN' },

    // wspólne
    lastService: { name: 'Data ostatniego przeglądu', type: 'DATE' },
}

// ─────────────────────────────────────────
// DEFINICJE KATEGORII  [kluczAtrybutu, wymagany]
// ─────────────────────────────────────────
const CATEGORIES = [
    {
        key: 'laptop',
        name: 'Laptopy',
        shortCode: 'LAP',
        description:
            'Laptopy mobilne i stacje robocze do pracy projektowej, programowania i renderingu',
        attributes: [
            ['cpu', true],
            ['gpu', true],
            ['ram', true],
            ['storage', true],
            ['os', true],
            ['screen', true],
            ['lastService', false],
        ],
    },
    {
        key: 'pc',
        name: 'Komputery stacjonarne',
        shortCode: 'PC',
        description:
            'Wydajne stacje robocze do uczenia maszynowego, symulacji i obróbki wideo',
        attributes: [
            ['cpu', true],
            ['gpu', true],
            ['ram', true],
            ['storage', true],
            ['os', true],
            ['lastService', false],
        ],
    },
    {
        key: 'mcu',
        name: 'Mikrokontrolery i płytki deweloperskie',
        shortCode: 'MCU',
        description:
            'Płytki do projektów IoT, systemów wbudowanych i elektroniki',
        attributes: [
            ['chip', true],
            ['clock', true],
            ['flash', false],
            ['gpio', true],
            ['wifi', true],
            ['bluetooth', true],
        ],
    },
    {
        key: 'vr',
        name: 'Gogle VR',
        shortCode: 'VR',
        description:
            'Gogle wirtualnej i mieszanej rzeczywistości do projektów z grafiki 3D i gier',
        attributes: [
            ['eyeRes', true],
            ['refresh', true],
            ['vrMode', true],
            ['handTracking', true],
            ['battery', false],
            ['lastService', false],
        ],
    },
    {
        key: 'printer',
        name: 'Drukarki 3D',
        shortCode: '3DP',
        description: 'Drukarki 3D do prototypowania obudów, części i modeli',
        attributes: [
            ['printTech', true],
            ['buildVolume', true],
            ['nozzle', false],
            ['multiMaterial', true],
            ['lastService', false],
        ],
    },
]

async function main() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error(
            'Seed resetuje katalog i dane transakcyjne – nie uruchamiaj go na produkcji!'
        )
    }

    const password = await bcrypt.hash(process.env.BASIC_PASSWORD, 12)

    // ─────────────────────────────────────────
    // RESET BAZY DEMO
    // Kolejność wynika z kluczy obcych. Zdjęcia usterek/inspekcji,
    // przedłużenia i wartości atrybutów sprzętu usuwają się kaskadowo.
    // ─────────────────────────────────────────
    await prisma.$transaction([
        prisma.fault.deleteMany(),
        prisma.rentalInspection.deleteMany(),
        prisma.rentalExtension.deleteMany(),
        prisma.rental.deleteMany(),
        prisma.reservation.deleteMany(),
        prisma.equipmentAttribute.deleteMany(),
        prisma.equipment.deleteMany(),
        prisma.categoryAttribute.deleteMany(),
        prisma.attributeOption.deleteMany(),
        prisma.attribute.deleteMany(),
        prisma.category.deleteMany(),
        prisma.user.deleteMany({
            where: {
                email: {
                    in: ['user@user.com', 'anna.nowak@student.san.edu.pl'],
                },
            },
        }),
    ])

    console.log('🧹 Baza demo wyczyszczona')

    // ─────────────────────────────────────────
    // USERS + PROFILE
    // ─────────────────────────────────────────
    const upsertUser = (data) =>
        prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: { ...data, password },
        })

    const szymon = await upsertUser({
        email: 'zawodowcy.szymon@gmail.com',
        role: 'STUDENT',
        firstName: 'Szymon',
        lastName: 'Zawodowiec',
    })
    await prisma.student.upsert({
        where: { userId: szymon.id },
        update: {},
        create: {
            userId: szymon.id,
            indexNr: '112233',
            fieldOfStudy: 'Informatyka',
        },
    })

    const secretariat = await upsertUser({
        email: 'secretary@user.com',
        role: 'SECRETARIAT',
        firstName: 'Katarzyna',
        lastName: 'Kowalska',
    })
    await prisma.secretariat.upsert({
        where: { userId: secretariat.id },
        update: {},
        create: {
            userId: secretariat.id,
            roomNr: '2.14',
            faculty: 'Wydział Informatyki',
        },
    })

    const it = await upsertUser({
        email: 'it@user.com',
        role: 'IT_STAFF',
        firstName: 'Tomasz',
        lastName: 'Wiśniewski',
    })
    await prisma.admin.upsert({
        where: { userId: it.id },
        update: {},
        create: { userId: it.id, accessLevel: 'MANAGING' },
    })

    console.log('✅ Użytkownicy i profile dodani')

    // ─────────────────────────────────────────
    // ATRYBUTY + OPCJE
    // ─────────────────────────────────────────
    const attr = {}
    const opt = {}

    for (const [key, def] of Object.entries(ATTRIBUTES)) {
        const { options, ...data } = def
        attr[key] = await prisma.attribute.create({ data })

        if (options) {
            opt[key] = {}
            for (const [order, value] of options.entries()) {
                opt[key][value] = await prisma.attributeOption.create({
                    data: { attributeId: attr[key].id, value, order },
                })
            }
        }
    }

    console.log(`✅ Atrybuty dodane (${Object.keys(attr).length})`)

    // ─────────────────────────────────────────
    // KATEGORIE + POWIĄZANIA Z ATRYBUTAMI
    // ─────────────────────────────────────────
    const category = {}

    for (const c of CATEGORIES) {
        category[c.key] = await prisma.category.create({
            data: {
                name: c.name,
                shortCode: c.shortCode,
                description: c.description,
                categoryAttributes: {
                    create: c.attributes.map(([key, required], order) => ({
                        attributeId: attr[key].id,
                        required,
                        order,
                    })),
                },
            },
        })
        category[c.key].allowed = new Set(c.attributes.map(([key]) => key))
    }

    console.log(`✅ Kategorie dodane (${CATEGORIES.length})`)

    // ─────────────────────────────────────────
    // SPRZĘT
    // ─────────────────────────────────────────
    const counters = {}

    async function addEquipment(
        catKey,
        { name, serialNumber, status = 'AVAILABLE', values }
    ) {
        const cat = category[catKey]
        counters[catKey] = (counters[catKey] ?? 0) + 1
        const inventoryNumber = `SAN/${cat.shortCode}/${String(counters[catKey]).padStart(6, '0')}`

        const attributeValues = Object.entries(values).map(([key, value]) => {
            if (!cat.allowed.has(key)) {
                throw new Error(
                    `Atrybut "${key}" nie należy do kategorii "${cat.name}" (${name})`
                )
            }
            if (ATTRIBUTES[key].type === 'SELECT') {
                const option = opt[key][value]
                if (!option)
                    throw new Error(
                        `Brak opcji "${value}" dla atrybutu "${key}"`
                    )
                return {
                    attributeId: attr[key].id,
                    attributeOptionId: option.id,
                }
            }
            return { attributeId: attr[key].id, value: String(value) }
        })

        return prisma.equipment.create({
            data: {
                name,
                serialNumber,
                inventoryNumber,
                categoryId: cat.id,
                status,
                values: { create: attributeValues },
            },
        })
    }

    // ── Laptopy ──
    const dellPrecision = await addEquipment('laptop', {
        name: 'Dell Precision 5570',
        serialNumber: 'DP5570-7HX2K',
        status: 'RENTED',
        values: {
            cpu: 'Intel Core i7-12800H',
            gpu: 'NVIDIA RTX A2000 8 GB',
            ram: 32,
            storage: 1000,
            os: 'Windows 11 Pro',
            screen: 15.6,
            lastService: isoDate(-60),
        },
    })

    const macbook = await addEquipment('laptop', {
        name: 'MacBook Pro 14" M3 Pro',
        serialNumber: 'C02MBP14M3P1',
        values: {
            cpu: 'Apple M3 Pro (11 rdzeni)',
            gpu: 'Apple M3 Pro 14-core GPU',
            ram: 18,
            storage: 512,
            os: 'macOS',
            screen: 14.2,
            lastService: isoDate(-24),
        },
    })

    const legion = await addEquipment('laptop', {
        name: 'Lenovo Legion Pro 5',
        serialNumber: 'LGP5-PF4R2Z',
        values: {
            cpu: 'AMD Ryzen 7 7745HX',
            gpu: 'NVIDIA GeForce RTX 4070 8 GB',
            ram: 32,
            storage: 1000,
            os: 'Windows 11 Pro',
            screen: 16,
        },
    })

    await addEquipment('laptop', {
        name: 'Lenovo ThinkPad T440',
        serialNumber: 'PB-T440-0931',
        status: 'RETIRED',
        values: {
            cpu: 'Intel Core i5-4300U',
            gpu: 'Intel HD Graphics 4400',
            ram: 8,
            storage: 256,
            os: 'Ubuntu 24.04 LTS',
            screen: 14,
            lastService: isoDate(-400),
        },
    })

    // ── Komputery stacjonarne ──
    const hpZ4 = await addEquipment('pc', {
        name: 'HP Z4 G5 Workstation',
        serialNumber: 'HPZ4G5-CZ21A',
        values: {
            cpu: 'Intel Xeon w5-2445',
            gpu: 'NVIDIA RTX A4000 16 GB',
            ram: 64,
            storage: 2000,
            os: 'Windows 11 Pro',
            lastService: isoDate(-90),
        },
    })

    await addEquipment('pc', {
        name: 'Stacja ML – Ryzen 9 / RTX 4090',
        serialNumber: 'SAN-ML-0001',
        values: {
            cpu: 'AMD Ryzen 9 7950X',
            gpu: 'NVIDIA GeForce RTX 4090 24 GB',
            ram: 128,
            storage: 4000,
            os: 'Ubuntu 24.04 LTS',
            lastService: isoDate(-30),
        },
    })

    // ── Mikrokontrolery ──
    const raspberry = await addEquipment('mcu', {
        name: 'Raspberry Pi 5 8 GB',
        serialNumber: 'RPI5-8G-0001',
        status: 'RENTED',
        values: {
            chip: 'Broadcom BCM2712 (Cortex-A76)',
            clock: 2400,
            gpio: 40,
            wifi: true,
            bluetooth: true,
        },
    })

    const esp32 = await addEquipment('mcu', {
        name: 'ESP32-S3-DevKitC-1',
        serialNumber: 'ESP32S3-N8R8-01',
        status: 'RENTED',
        values: {
            chip: 'ESP32-S3 (Xtensa LX7, dual-core)',
            clock: 240,
            flash: 8,
            gpio: 45,
            wifi: true,
            bluetooth: true,
        },
    })

    const arduino = await addEquipment('mcu', {
        name: 'Arduino Uno R4 WiFi',
        serialNumber: 'ABX00087-0001',
        status: 'RENTED',
        values: {
            chip: 'Renesas RA4M1 (Cortex-M4)',
            clock: 48,
            flash: 0.25,
            gpio: 20,
            wifi: true,
            bluetooth: true,
        },
    })

    await addEquipment('mcu', {
        name: 'STM32 Nucleo-F446RE',
        serialNumber: 'NUCLEO-F446-01',
        values: {
            chip: 'STM32F446RE (Cortex-M4)',
            clock: 180,
            flash: 0.5,
            gpio: 50,
            wifi: false,
            bluetooth: false,
        },
    })

    // ── Gogle VR ──
    const quest3 = await addEquipment('vr', {
        name: 'Meta Quest 3 512 GB',
        serialNumber: '2G0YC5ZF8Q0001',
        status: 'MAINTENANCE',
        values: {
            eyeRes: '2064 × 2208',
            refresh: 120,
            vrMode: 'Standalone + PC VR',
            handTracking: true,
            battery: 2.2,
            lastService: isoDate(-45),
        },
    })

    const valveIndex = await addEquipment('vr', {
        name: 'Valve Index (zestaw pełny)',
        serialNumber: 'VIDX-KIT-0001',
        values: {
            eyeRes: '1440 × 1600',
            refresh: 144,
            vrMode: 'PC VR',
            handTracking: false,
            lastService: isoDate(-120),
        },
    })

    await addEquipment('vr', {
        name: 'HTC Vive XR Elite',
        serialNumber: 'HTCXRE-0001',
        values: {
            eyeRes: '1920 × 1920',
            refresh: 90,
            vrMode: 'Standalone + PC VR',
            handTracking: true,
            battery: 2,
        },
    })

    // ── Drukarki 3D ──
    await addEquipment('printer', {
        name: 'Prusa Core One',
        serialNumber: 'PRUSA-CO-0001',
        values: {
            printTech: 'FDM',
            buildVolume: '250 × 220 × 270 mm',
            nozzle: 0.4,
            multiMaterial: false,
            lastService: isoDate(-14),
        },
    })

    const bambu = await addEquipment('printer', {
        name: 'Bambu Lab X1 Carbon + AMS',
        serialNumber: 'BBL-X1C-0001',
        values: {
            printTech: 'FDM',
            buildVolume: '256 × 256 × 256 mm',
            nozzle: 0.4,
            multiMaterial: true,
            lastService: isoDate(-20),
        },
    })

    const formlabs = await addEquipment('printer', {
        name: 'Formlabs Form 4',
        serialNumber: 'FL4-0001',
        values: {
            printTech: 'SLA',
            buildVolume: '200 × 125 × 210 mm',
            multiMaterial: false,
        },
    })

    console.log(
        `✅ Sprzęt dodany (${Object.values(counters).reduce((a, b) => a + b, 0)} szt.)`
    )

    // ═════════════════════════════════════════
    // SCENARIUSZE DEMO – wszystko na koncie Szymona
    // ═════════════════════════════════════════

    // 1) Rezerwacje PENDING – do akceptacji / odrzucenia na żywo przez sekretariat
    await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: valveIndex.id,
            startDate: daysFromNow(3),
            endDate: daysFromNow(10),
            status: 'PENDING',
            notes: 'Projekt zaliczeniowy z grafiki 3D – gra VR w Unity.',
            createdAt: daysFromNow(-1),
        },
    })

    await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: formlabs.id,
            startDate: daysFromNow(5),
            endDate: daysFromNow(7),
            status: 'PENDING',
            notes: 'Druk prototypu obudowy czujnika do projektu IoT.',
            createdAt: daysFromNow(0, 8),
        },
    })

    // 2) Rezerwacja APPROVED – czeka na wydanie (sekretariat może wydać sprzęt na żywo)
    await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: bambu.id,
            startDate: daysFromNow(1),
            endDate: daysFromNow(4),
            status: 'APPROVED',
            notes: 'Druk elementów robota na konkurs koła naukowego.',
            reviewedBy: secretariat.id,
            reviewedAt: daysFromNow(-1),
            createdAt: daysFromNow(-2),
        },
    })

    // 3) Rezerwacja REJECTED – z powodem odrzucenia
    await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: hpZ4.id,
            startDate: daysFromNow(-15),
            endDate: daysFromNow(-8),
            status: 'REJECTED',
            notes: 'Trening modelu sieci neuronowej.',
            reviewedBy: secretariat.id,
            reviewedAt: daysFromNow(-16),
            rejectReason:
                'Stacja zarezerwowana w tym terminie na zajęcia laboratoryjne z uczenia maszynowego.',
            createdAt: daysFromNow(-17),
        },
    })

    // 4) Rezerwacja CANCELLED – anulowana przez studenta
    await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: legion.id,
            startDate: daysFromNow(-20),
            endDate: daysFromNow(-18),
            status: 'CANCELLED',
            notes: 'Prezentacja projektu na hackathonie.',
            createdAt: daysFromNow(-23),
        },
    })

    // 5) AKTYWNE wypożyczenie laptopa (z rezerwacji) – "czyste":
    //    bez przedłużenia i bez usterek → na żywo zgłaszasz fault i wniosek o przedłużenie
    const precisionReservation = await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: dellPrecision.id,
            startDate: daysFromNow(-5),
            endDate: daysFromNow(9),
            status: 'COMPLETED',
            notes: 'Rendering projektu z grafiki komputerowej.',
            reviewedBy: secretariat.id,
            reviewedAt: daysFromNow(-7),
            createdAt: daysFromNow(-8),
        },
    })

    const precisionRental = await prisma.rental.create({
        data: {
            studentId: szymon.id,
            equipmentId: dellPrecision.id,
            reservationId: precisionReservation.id,
            issuedBy: secretariat.id,
            startDate: daysFromNow(-5),
            dueDate: daysFromNow(9),
            status: 'ACTIVE',
            createdAt: daysFromNow(-5),
        },
    })

    await prisma.rentalInspection.create({
        data: {
            rentalId: precisionRental.id,
            type: 'CHECKOUT',
            inspectedBy: secretariat.id,
            notes: 'Laptop kompletny, zasilacz 130 W w zestawie. Brak widocznych uszkodzeń.',
            createdAt: daysFromNow(-5),
        },
    })

    // 6) AKTYWNE wypożyczenie Raspberry Pi – przedłużenie PENDING (sekretariat decyduje na żywo)
    const raspberryReservation = await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: raspberry.id,
            startDate: daysFromNow(-12),
            endDate: daysFromNow(2),
            status: 'COMPLETED',
            notes: 'Serwer domowej automatyki – projekt z systemów wbudowanych.',
            reviewedBy: secretariat.id,
            reviewedAt: daysFromNow(-13),
            createdAt: daysFromNow(-14),
        },
    })

    const raspberryRental = await prisma.rental.create({
        data: {
            studentId: szymon.id,
            equipmentId: raspberry.id,
            reservationId: raspberryReservation.id,
            issuedBy: secretariat.id,
            startDate: daysFromNow(-12),
            dueDate: daysFromNow(2),
            status: 'ACTIVE',
            createdAt: daysFromNow(-12),
        },
    })

    await prisma.rentalInspection.create({
        data: {
            rentalId: raspberryRental.id,
            type: 'CHECKOUT',
            inspectedBy: secretariat.id,
            notes: 'Płytka + zasilacz 27 W + obudowa z aktywnym chłodzeniem + karta microSD 64 GB.',
            createdAt: daysFromNow(-12),
        },
    })

    await prisma.rentalExtension.create({
        data: {
            rentalId: raspberryRental.id,
            newDueDate: daysFromNow(9),
            status: 'PENDING',
            requestedAt: daysFromNow(-1),
        },
    })

    // 7) AKTYWNE wypożyczenie Arduino na miejscu (bez rezerwacji) – usterka OPEN do obsługi przez IT
    const arduinoRental = await prisma.rental.create({
        data: {
            studentId: szymon.id,
            equipmentId: arduino.id,
            issuedBy: secretariat.id,
            startDate: daysFromNow(-2),
            dueDate: daysFromNow(12),
            status: 'ACTIVE',
            createdAt: daysFromNow(-2),
        },
    })

    await prisma.rentalInspection.create({
        data: {
            rentalId: arduinoRental.id,
            type: 'CHECKOUT',
            inspectedBy: secretariat.id,
            notes: 'Płytka w pudełku, kabel USB-C w zestawie.',
            createdAt: daysFromNow(-2),
        },
    })

    await prisma.fault.create({
        data: {
            rentalId: arduinoRental.id,
            reportedBy: szymon.id,
            description: 'Matryca LED 12×8 nie wyświetla dwóch dolnych rzędów.',
            severity: 'MINOR',
            status: 'OPEN',
            occurredDuring: 'DURING_USE',
            createdAt: daysFromNow(0, 9),
        },
    })

    // 8) Wypożyczenie OVERDUE (na miejscu) – z odrzuconym przedłużeniem
    //    i oddaloną usterką zgłoszoną przy odbiorze
    const esp32Rental = await prisma.rental.create({
        data: {
            studentId: szymon.id,
            equipmentId: esp32.id,
            issuedBy: secretariat.id,
            startDate: daysFromNow(-20),
            dueDate: daysFromNow(-3),
            status: 'OVERDUE',
            createdAt: daysFromNow(-20),
        },
    })

    await prisma.rentalInspection.create({
        data: {
            rentalId: esp32Rental.id,
            type: 'CHECKOUT',
            inspectedBy: secretariat.id,
            notes: 'Płytka z przylutowanymi goldpinami, antena PCB bez uszkodzeń.',
            createdAt: daysFromNow(-20),
        },
    })

    await prisma.rentalExtension.create({
        data: {
            rentalId: esp32Rental.id,
            newDueDate: daysFromNow(4),
            status: 'REJECTED',
            requestedAt: daysFromNow(-5),
            reviewedBy: secretariat.id,
            reviewedAt: daysFromNow(-4),
            rejectReason:
                'Płytka jest potrzebna na zajęcia laboratoryjne z IoT w przyszłym tygodniu.',
        },
    })

    await prisma.fault.create({
        data: {
            rentalId: esp32Rental.id,
            reportedBy: szymon.id,
            description: 'Dioda zasilania świeci słabiej niż powinna.',
            severity: 'MINOR',
            status: 'DISMISSED',
            occurredDuring: 'ON_PICKUP',
            createdAt: daysFromNow(-20, 11),
            resolvedBy: it.id,
            resolvedAt: daysFromNow(-19),
            resolveNote:
                'Zachowanie zgodne ze specyfikacją płytki – nie stanowi usterki.',
        },
    })

    // 9) HISTORIA – zwrócony MacBook: przedłużenie APPROVED, usterka RESOLVED,
    //    inspekcje CHECKOUT + RETURN
    const macbookReservation = await prisma.reservation.create({
        data: {
            studentId: szymon.id,
            equipmentId: macbook.id,
            startDate: daysFromNow(-45),
            endDate: daysFromNow(-31),
            status: 'COMPLETED',
            notes: 'Aplikacja mobilna na iOS – projekt zespołowy.',
            reviewedBy: secretariat.id,
            reviewedAt: daysFromNow(-47),
            createdAt: daysFromNow(-48),
        },
    })

    const macbookRental = await prisma.rental.create({
        data: {
            studentId: szymon.id,
            equipmentId: macbook.id,
            reservationId: macbookReservation.id,
            issuedBy: secretariat.id,
            receivedBy: secretariat.id,
            startDate: daysFromNow(-45),
            dueDate: daysFromNow(-24), // po przedłużeniu (pierwotnie -31)
            returnedAt: daysFromNow(-25),
            status: 'RETURNED',
            createdAt: daysFromNow(-45),
        },
    })

    await prisma.rentalExtension.create({
        data: {
            rentalId: macbookRental.id,
            newDueDate: daysFromNow(-24),
            status: 'APPROVED',
            requestedAt: daysFromNow(-34),
            reviewedBy: secretariat.id,
            reviewedAt: daysFromNow(-33),
        },
    })

    await prisma.fault.create({
        data: {
            rentalId: macbookRental.id,
            reportedBy: szymon.id,
            description: 'Klawisz "E" czasem się zacina.',
            severity: 'MINOR',
            status: 'RESOLVED',
            occurredDuring: 'DURING_USE',
            createdAt: daysFromNow(-38),
            resolvedBy: it.id,
            resolvedAt: daysFromNow(-24),
            resolveNote:
                'Klawiatura wyczyszczona po zwrocie, klawisz działa poprawnie.',
        },
    })

    await prisma.rentalInspection.createMany({
        data: [
            {
                rentalId: macbookRental.id,
                type: 'CHECKOUT',
                inspectedBy: secretariat.id,
                notes: 'Stan bardzo dobry, ładowarka MagSafe w zestawie.',
                createdAt: daysFromNow(-45),
            },
            {
                rentalId: macbookRental.id,
                type: 'RETURN',
                inspectedBy: secretariat.id,
                notes: 'Zwrócony kompletny. Zgłoszona usterka klawisza przekazana do IT.',
                createdAt: daysFromNow(-25),
            },
        ],
    })

    // 10) HISTORIA – zwrócone Meta Quest 3 z poważną usterką IN_REVIEW,
    //     sprzęt w MAINTENANCE (IT może rozwiązać usterkę na żywo)
    const questRental = await prisma.rental.create({
        data: {
            studentId: szymon.id,
            equipmentId: quest3.id,
            issuedBy: secretariat.id,
            receivedBy: secretariat.id,
            startDate: daysFromNow(-14),
            dueDate: daysFromNow(-4),
            returnedAt: daysFromNow(-4),
            status: 'RETURNED',
            createdAt: daysFromNow(-14),
        },
    })

    await prisma.rentalInspection.createMany({
        data: [
            {
                rentalId: questRental.id,
                type: 'CHECKOUT',
                inspectedBy: secretariat.id,
                notes: 'Gogle + 2 kontrolery + ładowarka. Soczewki czyste.',
                createdAt: daysFromNow(-14),
            },
            {
                rentalId: questRental.id,
                type: 'RETURN',
                inspectedBy: secretariat.id,
                notes: 'Prawy kontroler nie paruje się z goglami. Przekazano do IT.',
                createdAt: daysFromNow(-4),
            },
        ],
    })

    await prisma.fault.create({
        data: {
            rentalId: questRental.id,
            reportedBy: szymon.id,
            description:
                'Prawy kontroler traci połączenie i nie śledzi pozycji w przestrzeni.',
            severity: 'CRITICAL',
            status: 'IN_REVIEW',
            occurredDuring: 'DURING_USE',
            createdAt: daysFromNow(-5),
        },
    })

    console.log('✅ Scenariusze demo dodane')
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
