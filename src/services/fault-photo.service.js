import * as faultRepository from '../repositories/fault.repository.js'
import * as faultPhotoRepository from '../repositories/fault-photo.repository.js'
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from '../utils/errors.util.js'
import { Role } from '@prisma/client'
import { buildFileMetadata } from '../utils/file.util.js'

const create = async (id, files, mode, user, token) => {
    let fault

    if (mode === 'BY_TOKEN') {
        fault = await faultRepository.findByToken(token)

        if (!fault) {
            throw new NotFoundError('Nieprawidłowy token')
        }

        if (fault.id !== id) {
            throw new ForbiddenError('Token nie pasuje do tego zgłoszenia')
        }

        if (!fault.uploadTokenExpiry || fault.uploadTokenExpiry < new Date()) {
            throw new ConflictError('Token wygasł')
        }
    } else {
        fault = await faultRepository.findById(id)

        if (!fault) {
            throw new NotFoundError('Nie znaleziono szkody')
        }

        if (user.role === Role.STUDENT && fault.reportedBy !== user.id) {
            throw new ConflictError(
                'To nie jest szkoda zaraportowana przez Ciebie'
            )
        }
    }

    const photosList = files.map((file) => {
        const data = buildFileMetadata(file, 'fault-photos')
        return { faultId: fault.id, path: data.url }
    })

    const inserted = await faultPhotoRepository.insertMany(photosList)

    if (mode === 'BY_TOKEN') {
        await faultRepository.update(fault.id, {
            uploadToken: null,
            uploadTokenExpiry: null,
        })
    }

    return inserted
}

export { create }
