const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex')
        const ext = path.extname(file.originalname)
        cb(null, `${Date.now()}-${uniqueSuffix}${ext}`)
    },
})

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Not allowed file type'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 2048, // 20 MB
    },
})

export { upload }
