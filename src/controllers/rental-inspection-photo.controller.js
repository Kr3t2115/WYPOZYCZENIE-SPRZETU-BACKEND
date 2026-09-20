import * as rentalInspectionPhotoService from '../services/rental-inspection-photo.service.js'

const store = async (req, res, next) => {
    try {
        const newRentalInspectionPhotos =
            await rentalInspectionPhotoService.create(req.params.id, req.files)

        return res.status(201).json(newRentalInspectionPhotos)
    } catch (err) {
        next(err)
    }
}

export { store }
