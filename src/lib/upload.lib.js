import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads')

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Not allowed file type'), false)
    }
}

const buildDatePath = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return path.join(String(year), month, day)
}

const createUploader = (category) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const datePath = buildDatePath()
            const fullDir = path.join(UPLOAD_ROOT, category, datePath)

            fs.mkdirSync(fullDir, { recursive: true })

            cb(null, fullDir)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = crypto.randomBytes(16).toString('hex')
            const ext = path.extname(file.originalname)
            cb(null, `${uniqueSuffix}${ext}`)
        },
    })

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 20 * 1024 * 1024,
        },
    })
}

export const equipmentPhotosUpload = createUploader('equipment-photos')
export const inspectionPhotosUpload = createUploader('inspection-photos')
export const faultPhotosUpload = createUploader('fault-photos')
