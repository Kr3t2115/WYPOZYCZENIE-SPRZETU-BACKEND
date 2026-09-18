// utils/file.util.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads')

const buildFileMetadata = (file, category, extra = {}) => {
    // file.path to pełna ścieżka absolutna nadana przez multer,
    // wyciągamy z niej część względną od UPLOAD_ROOT
    const relativePath = path.relative(UPLOAD_ROOT, file.path)

    return {
        originalName: file.originalname,
        storedName: file.filename,
        relativePath, // np. "equipment-photos/2026/09/22/abc123.jpg"
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${relativePath.split(path.sep).join('/')}`, // normalizacja pod Windows/Linux
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
