import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

const send = async ({ to, subject, text, html }) => {
    try {
        return transporter.sendMail({
            from: `<${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
            html,
        })
    } catch (error) {
        console.log(error)
    }
}

export { transporter, send }
