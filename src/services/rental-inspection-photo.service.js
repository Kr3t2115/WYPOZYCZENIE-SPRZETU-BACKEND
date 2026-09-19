import * as rentalInspectionPhotoRepository from '../repositories/rental-inspection-photo.repository.js'
import * as rentalInspectionRepository from '../repositories/rental-inspection.repository.js'
import { ConflictError } from '../utils/errors.util.js'
import { buildFileMetadata } from '../utils/file.util.js'

const create = async (id, files, user) => {
    const rentalInspection = await rentalInspectionRepository.findById(id)

    if (!rentalInspection) {
        throw new ConflictError('Fault not found')
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
