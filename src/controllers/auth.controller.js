import * as authService from '../services/auth.service.js'

const COOKIE_BASE = {
    domain: process.env.DOMAIN,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
}

const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie('access_token', accessToken, {
        ...COOKIE_BASE,
        maxAge: 1000 * 60 * 15,
    })

    res.cookie('refresh_token', refreshToken, {
        ...COOKIE_BASE,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/api/auth/refresh',
    })
}

const isLogged = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Niezalogowany' })
    }

    return res.status(200).json({
        message: 'Użytkownik zalogowany prawidłowo',
    })
}

const login = async (req, res, next) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(
            req.body
        )

        setAuthCookies(res, accessToken, refreshToken)

        res.status(200).json({
            message: 'Użytkownik zalogowany prawidłowo',
            data: {
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        })
    } catch (error) {
        next(error)
    }
}

const refresh = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies?.refresh_token

        const { accessToken, refreshToken } =
            await authService.refresh(oldRefreshToken)

        setAuthCookies(res, accessToken, refreshToken)

        res.status(200).json({ message: 'Token odświeżony' })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refresh_token

        await authService.logout(refreshToken)

        res.clearCookie('access_token', COOKIE_BASE)
        res.clearCookie('refresh_token', {
            ...COOKIE_BASE,
            path: '/api/auth/refresh',
        })

        res.status(200).json({ message: 'Wylogowano' })
    } catch (error) {
        next(error)
    }
}

export { isLogged, login, refresh, logout }
