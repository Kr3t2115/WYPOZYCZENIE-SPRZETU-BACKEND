import cron from 'node-cron'
import { runDailyRentalCheck } from '../services/notification.service.js'

const startScheduler = () => {
    cron.schedule(
        '0 0 * * *',
        async () => {
            console.log(
                '[scheduler] Uruchamiam codzienne sprawdzenie wypożyczeń'
            )
            try {
                await runDailyRentalCheck()
            } catch (err) {
                console.error(
                    '[scheduler] Błąd podczas sprawdzania wypożyczeń:',
                    err
                )
            }
        },
        { timezone: 'Europe/Warsaw' }
    )
}

export { startScheduler }
