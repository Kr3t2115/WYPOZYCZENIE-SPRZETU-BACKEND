import * as faultPhotoService from '../services/fault-photo.service.js'

const store = async (req, res, next) => {
    try {
        const newFaultPhotos = await faultPhotoService.create(
            req.params.id,
            req.files
        )

        return res.status(201).json(newFaultPhotos)
    } catch (err) {
        next(err)
    }
}

export { store }
