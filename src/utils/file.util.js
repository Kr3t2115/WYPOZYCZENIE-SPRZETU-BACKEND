import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads')

const buildFileMetadata = (file, category, extra = {}) => {
    const relativePath = path.relative(UPLOAD_ROOT, file.path)

    return {
        originalName: file.originalname,
        storedName: file.filename,
        relativePath,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${relativePath.split(path.sep).join('/')}`,
        category,
        ...extra,
    }
}

const deleteFile = async (relativePath) => {
    const filePath = path.join(UPLOAD_ROOT, relativePath)
    try {
        await fs.unlink(filePath)
        return true
    } catch (err) {
        if (err.code === 'ENOENT') return false
        throw err
    }
}

const fileExists = async (relativePath) => {
    const filePath = path.join(UPLOAD_ROOT, relativePath)
    try {
        await fs.access(filePath)
        return true
    } catch {
        return false
    }
}

export { buildFileMetadata, deleteFile, fileExists }
