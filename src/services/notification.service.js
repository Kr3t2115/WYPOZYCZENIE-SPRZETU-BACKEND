// services/notification.service.js
import * as rentalRepository from '../repositories/rental.repository.js'
import { send } from '../lib/mailer.lib.js'
import { renderTemplate } from '../utils/template.util.js'
import { startOfDay, addDays } from '../utils/date.util.js'
import { RentalStatus } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dueSoonTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/rental/due-soon.html'),
    'utf-8'
)

const rentalOverdueTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/rental/overdue.html'),
    'utf-8'
)

const REMINDER_DAYS = [7, 3, 2, 1, 0]

const formatDate = (date) => date.toLocaleDateString('pl-PL')

const sendDueSoonReminder = async (rental, daysLeft) => {
    const html = await renderTemplate(dueSoonTemplate, {
        EQUIPMENT_NAME: rental.equipment.name,
        DUE_DATE: formatDate(rental.dueDate),
        DAYS_LEFT: String(daysLeft),
    })

    await send({
        to: rental.student.email,
        subject: `Zbliża się termin zwrotu sprzętu (${daysLeft} dni)`,
        html,
    })
}

const sendOverdueNotice = async (rental) => {
    const html = await renderTemplate(rentalOverdueTemplate, {
        EQUIPMENT_NAME: rental.equipment.name,
        DUE_DATE: formatDate(rental.dueDate),
    })

    await send({
        to: rental.student.email,
        subject: 'Termin zwrotu sprzętu minął',
        html,
    })
}

const runDailyRentalCheck = async () => {
    const today = startOfDay(new Date())

    for (const days of REMINDER_DAYS) {
        const targetDate = addDays(today, days)
        const rentals = await rentalRepository.findActiveDueOn(targetDate)

        for (const rental of rentals) {
            try {
                await sendDueSoonReminder(rental, days)
            } catch (err) {
                console.error(
                    `Błąd wysyłki przypomnienia dla rentalu ${rental.id}:`,
                    err
                )
            }
        }
    }

    const overdueRentals = await rentalRepository.findNewlyOverdue(today)

    for (const rental of overdueRentals) {
        try {
            await rentalRepository.update(rental.id, {
                status: RentalStatus.OVERDUE,
            })
            await sendOverdueNotice(rental)
        } catch (err) {
            console.error(
                `Błąd przetwarzania przeterminowanego rentalu ${rental.id}:`,
                err
            )
        }
    }
}

export { runDailyRentalCheck }
