const fs = require('fs/promises')
const path = require('path')

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')

const buildFileMetadata = (file, extra = {}) => {
    return {
        originalName: file.originalname,
        storedName: file.filename,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        ...extra,
    }
}

const deleteFile = async (storedName) => {
    const filePath = path.join(UPLOAD_DIR, storedName)
    try {
        await fs.unlink(filePath)
        return true
    } catch (err) {
        if (err.code === 'ENOENT') return false
        throw err
    }
}

const fileExists = async (storedName) => {
    const filePath = path.join(UPLOAD_DIR, storedName)
    try {
        await fs.access(filePath)
        return true
    } catch {
        return false
    }
}

export { buildFileMetadata, deleteFile, fileExists }
