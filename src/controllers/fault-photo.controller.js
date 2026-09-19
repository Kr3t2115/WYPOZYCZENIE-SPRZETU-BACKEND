import * as faultPhotoService from '../services/fault-photo.service.js'

const store = async (req, res, next) => {
    try {
        const equipment = await faultPhotoService.create(
            req.params.id,
            req.files
        )

        return res.status(201).json(equipment)
    } catch (err) {
        next(err)
    }
}

export { store }
