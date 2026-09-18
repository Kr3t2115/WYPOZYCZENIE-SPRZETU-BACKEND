import { config } from 'dotenv'
config()

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger.js'

import express from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import route from './routes/route.js'
import { errorHandlerUtil } from './utils/error-handler.util.js'

import { connectDB } from './config/db.config.js'
// import { buildFileMetadata } from './utils/file.util.js'
// import { faultPhotosUpload } from './lib/upload.lib.js'

connectDB()

const app = express()

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(express.json())

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
        credentials: true,
    })
)

app.use(cookieParser())

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// PING PONG TEST
app.get('/', (req, res) => {
    res.json({ ping: 'pong' })
})

app.use(
    '/uploads',
    express.static(path.join(import.meta.dirname, '..', 'uploads'))
)
app.use('/api', route)

// app.post('/upload', faultPhotosUpload.single('image'), (req, res, next) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'Brak pliku' })
//         }
//
//         const metadata = buildFileMetadata(req.file)
//
//         return res.status(201).json(metadata)
//     } catch (err) {
//         next(err)
//     }
// })
//
// app.post('/uploads', faultPhotosUpload.array('image', 20), (req, res, next) => {
//     try {
//         if (!req.files) {
//             return res.status(400).json({ error: 'Brak pliku' })
//         }
//
//         const metadataList = req.files.map((file) =>
//             buildFileMetadata(file, 'equipment-photos')
//         )
//
//         return res.status(201).json(metadataList)
//     } catch (err) {
//         next(err)
//     }
// })

app.use(errorHandlerUtil)
