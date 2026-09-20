import * as rentalInspectionPhotoRepository from '../repositories/rental-inspection-photo.repository.js'
import * as rentalInspectionRepository from '../repositories/rental-inspection.repository.js'
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from '../utils/errors.util.js'
import { buildFileMetadata } from '../utils/file.util.js'
import { Role } from '@prisma/client'

const create = async (id, files, mode, user, token) => {
    let rentalInspection

    if (mode === 'BY_TOKEN') {
        rentalInspection = await rentalInspectionRepository.findByToken(token)

        if (!rentalInspection) {
            throw new NotFoundError('Nieprawidłowy token')
        }

        if (rentalInspection.id !== id) {
            throw new ForbiddenError('Token nie pasuje do tego zgłoszenia')
        }

        if (!fault.uploadTokenExpiry || fault.uploadTokenExpiry < new Date()) {
            throw new ConflictError('Token wygasł')
        }
    } else {
        rentalInspection = await rentalInspectionRepository.findById(id)

        if (!fault) {
            throw new NotFoundError('Nie znaleziono szkody')
        }

        const ALLOWED_ROLES = [Role.IT_STAFF, Role.SECRETARIAT]

        if (
            !ALLOWED_ROLES.includes(user.role) ||
            rentalInspection.inspectedBy !== user.id
        ) {
            throw new ConflictError(
                'To nie jest insepekcja zaraportowana przez Ciebie'
            )
        }
    }

    let photosList = []

    files.map((file) => {
        const data = buildFileMetadata(file, 'equipment-photos')

        photosList.push({
            inspectionId: rentalInspection.id,
            path: data.url,
        })
    })

    return rentalInspectionPhotoRepository.insertMany(photosList)
}

export { create }
