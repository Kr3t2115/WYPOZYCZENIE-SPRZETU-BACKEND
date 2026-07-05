import * as authService from '../services/auth.service.js'

const isLogged = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    return res.status(200).json({
        message: 'User is logged in',
    })
}

const login = async (req, res, next) => {
    try {
        const { user, token } = await authService.login(req.body)

        if (user) {
            res.cookie('access_token', token, {
                domain: process.env.DOMAIN,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 1000 * 60 * 60 * 24 * 2, // 1000 (miliseconds) * 60 (seconds) * 60 (minutes) * 24 (hours) * 2 (days)
            })

            res.status(200).json({
                message: 'Login Success',
            })
        }
    } catch (error) {
        next(error)
    }
}

export { isLogged, login }
