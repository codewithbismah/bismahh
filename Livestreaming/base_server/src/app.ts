import express, { Application } from 'express'
import path from 'path'
import App from './APIs'
import errorHandler from './middlewares/errorHandler'
import notFound from './handlers/notFound'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import stream from '../src/APIs/streaminvideo/stream'

const app: Application = express()

//Middlewares
app.use(helmet())
app.use(cookieParser())
app.use(
    cors({
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'HEAD', 'PUT', 'PATCH'],
        origin: ['http://localhost:3001'],
        credentials: true
    })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))

App(app)
App(stream)

//404 handler
app.use(notFound)

//Handlers as Middlewares
app.use(errorHandler)

export default app
