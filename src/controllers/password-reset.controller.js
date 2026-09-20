import * as passwordResetService from '../services/password-reset.service.js'

const requestReset = async (req, res, next) => {
    try {
        const { email } = req.body

        await passwordResetService.requestPasswordReset(email)

        res.status(200).json({
            message:
                'Jeśli konto o podanym adresie istnieje, wysłaliśmy link do resetowania hasła',
        })
    } catch (error) {
        next(error)
    }
}

const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.params

        await passwordResetService.verifyResetToken(token)

        res.status(200).json({ message: 'Token prawidłowy' })
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body

        await passwordResetService.resetPassword(token, newPassword)

        res.status(200).json({ message: 'Hasło zostało zmienione' })
    } catch (error) {
        next(error)
    }
}

export { requestReset, verifyToken, resetPassword }
