import express, { Request, Response, Application } from 'express'
import cors from 'cors'
import multer, { StorageEngine } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import logger from '../../handlers/logger'

const app: Application = express()
const PORT = 4050

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Multer middleware configuration
const storage: StorageEngine = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, file.fieldname + '-' + uuidv4() + path.extname(file.originalname))
})
const upload = multer({ storage })

// Middleware for CORS
app.use(
    cors({
        origin: ['http://localhost:3001'],
        credentials: true
    })
)

// Middleware to parse JSON and URL-encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static folder for uploads
app.use('/uploads', express.static(uploadDir))

// Simple GET route
// @ts-ignore
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello chai aur code' })
})

// POST route for video upload and conversion to HLS format
app.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<Response> => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const lessonId = uuidv4()
    const videoPath = path.resolve(req.file.path)
    const outputPath = path.join(uploadDir, 'courses', lessonId)
    const hlsPath = `${outputPath}/index.m3u8`

    // Log video path and output path for debugging
    console.log('Video path:', videoPath)
    console.log('Output path:', outputPath)

    // Create output directory for HLS conversion if it doesn't exist
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true })
        logger.info('this is output path: ', { meta: outputPath })
    }

    // FFmpeg command to convert video to HLS format
    const ffmpegCommand = `ffmpeg -i "${videoPath}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 "${hlsPath}"`

    return new Promise(() => {
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error.message}`)
                console.error(`stderr: ${stderr}`)
                return res.status(500).json({ message: 'Video conversion failed', error: error.message, stderr })
            } else {
                logger.info('this is stdout: ', { meta: stdout })
                console.log(`stdout: ${stdout}`)
                console.log(`stderr: ${stderr}`)

                const videoUrl = `http://localhost:${PORT}/uploads/courses/${lessonId}/index.m3u8`
                // logger.info(`sucessfully converted : ${}`, {meta:videoUrl})
                return res.json({
                    message: 'Video converted to HLS format',
                    videoUrl,
                    lessonId
                })
            }
        })
    })
})

// Start the server
app.listen(PORT, () => {
    logger.info(`App is listening at port ${PORT}...`)
})

export default app
