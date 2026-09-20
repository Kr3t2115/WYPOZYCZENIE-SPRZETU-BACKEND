import * as faultPhotoService from '../services/fault-photo.service.js'
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

        const newFaultPhotos = await faultPhotoService.create(
            req.params.id,
            req.files,
            mode,
            req.user,
            req.params.token
        )

        return res.status(201).json(newFaultPhotos)
    } catch (err) {
        next(err)
    }
}

export { store }
