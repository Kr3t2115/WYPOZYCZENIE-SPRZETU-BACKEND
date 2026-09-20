import * as rentalInspectionPhotoService from '../services/rental-inspection-photo.service.js'
import { Role } from '@prisma/client'
import { ForbiddenError } from '../utils/errors.util.js'

const store = async (req, res, next) => {
    try {
        let mode

        if (req.user && req.user.role !== Role.STUDENT) {
            new ForbiddenError('Brak uprawnień do wykonania tej operacji')
        } else if (!req.user && !req.params.token) {
            new ForbiddenError('Brak uprawnień do wykonania tej operacji')
        }

        if (req.params.token) {
            mode = 'BY_TOKEN'
        } else {
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
