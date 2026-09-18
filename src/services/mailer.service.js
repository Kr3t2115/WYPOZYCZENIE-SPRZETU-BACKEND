import { transporter } from '../lib/mailer.lib.js'

const sendMail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `<${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
            html,
        })
        return info
    } catch (error) {
        console.log(error)
    }
}

export { sendMail }
