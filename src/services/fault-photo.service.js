import * as faultRepository from '../repositories/fault.repository.js'
import * as faultPhotoRepository from '../repositories/fault-photo.repository.js'

import { ConflictError } from '../utils/errors.util.js'
import { Role } from '@prisma/client'
import { buildFileMetadata } from '../utils/file.util.js'

const create = async (id, files, user) => {
    const fault = await faultRepository.findById(id)

    if (!fault) {
        throw new ConflictError('Fault not found')
    }

    if (user.role === Role.STUDENT && fault.reportedBy !== user.id) {
        throw new ConflictError('Fault not found')
    }

    let photosList = []

    files.map((file) => {
        const data = buildFileMetadata(file, 'equipment-photos')

        photosList.push({
            faultId: fault.id,
            path: data.url,
        })
    })

    return faultPhotoRepository.insertMany(photosList)
}

export { create }
