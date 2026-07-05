import { ForbiddenError } from '../utils/errors.util.js'

export const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('Auth failed')
        }
        next()
    }
}
