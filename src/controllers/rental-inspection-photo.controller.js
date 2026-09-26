import * as rentalInspectionPhotoService from '../services/rental-inspection-photo.service.js'
import { Role } from '@prisma/client'
import { ConflictError, ForbiddenError } from '../utils/errors.util.js'

const store = async (req, res, next) => {
    try {
        let mode

        if (!req.user && !req.params.token) {
            throw new ForbiddenError('Brak uprawnień do wykonania tej operacji')
        }

        if (req.params.token) {
            mode = 'BY_TOKEN'
        } else {
            const ALLOWED_ROLES = [Role.IT_STAFF, Role.SECRETARIAT]
            if (!req.user || !ALLOWED_ROLES.includes(req.user.role)) {
                throw new ForbiddenError(
                    'Brak uprawnień do wykonania tej operacji'
                )
            }
            mode = 'BY_PAGE'
        }

        const newRentalInspectionPhotos =
            await rentalInspectionPhotoService.create(
                req.params.id,
                req.files,
                mode,
                req.user,
                req.params.token
            )

        return res.status(201).json(newRentalInspectionPhotos)
    } catch (err) {
        next(err)
    }
}

export { store }
