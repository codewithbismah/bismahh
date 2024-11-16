import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import notFoundMiddleware from './middleware/not-found'
import errorHandlerMiddleware from './middleware/error-handlers'

// Routers
import authRouter from './routes/auth'
import animeRouter from './routes/amine'

// Import socket handler
import handleSocketConnection from './controllers/sockets'

// Initialize dotenv
dotenv.config()

const app = express()

// Middleware to parse JSON requests
app.use(express.json())

// Create the HTTP server
const server = http.createServer(app)

// Initialize socket.io
const io = new SocketIOServer(server, { cors: { origin: '*' } })

// Attach the WebSocket instance to the request object
interface CustomRequest extends Request {
    io?: SocketIOServer
}
// @ts-ignore
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
    req.io = io
    next()
})

// Initialize the WebSocket handling logic
handleSocketConnection(io)

// Routes
app.use('/auth', authRouter)
app.use('/anime', animeRouter)

// Middleware for handling 404 and errors
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async (): Promise<void> => {
    try {
        // Connect to the database
        ;(await process.env.MONGO_URI) as string

        // Start the server
        server.listen(process.env.PORT || 3000, () => console.log(`HTTP server is running on http://localhost:${process.env.PORT || 3000}`))
    } catch (error) {
        console.error(error)
    }
}

start()

// import dotenv from 'dotenv'
// import express, { Request, Response, NextFunction } from 'express'
// import http from 'http'
// import socketIo from 'socket.io'
// // import connectDB from './config/connect'
// import notFoundMiddleware from './middleware/not-found'
// import errorHandlerMiddleware from './middleware/error-handlers'
// import authMiddleware from './middleware/authenticate'

// // Routers
// import authRouter from './routes/auth'
// import animeRouter from './routes/amine'

// // Import socket handler
// import handleSocketConnection from './controllers/sockets'

// // Initialize dotenv
// dotenv.config()

// const app = express()

// // Middleware to parse JSON requests
// app.use(express.json())

// // Create the HTTP server
// const server = http.createServer(app)

// // Initialize socket.io
// const io = socketIo(server, { cors: { origin: '*' } })

// // Attach the WebSocket instance to the request object
// app.use((req: Request, res: Response, next: NextFunction) => {
//     req.io = io
//     return next()
// })

// // Initialize the WebSocket handling logic
// handleSocketConnection(io)

// // Routes
// app.use('/auth', authRouter)
// app.use('/anime', animeRouter)

// // Middleware for handling 404 and errors
// app.use(notFoundMiddleware)
// app.use(errorHandlerMiddleware)

// const start = async (): Promise<void> => {
//     try {
//         // Connect to the database
//         await (process.env.MONGO_URI as string)

//         // Start the server
//         server.listen(process.env.PORT || 3000, () => console.log(`HTTP server is running on port http://localhost:${process.env.PORT || 3000}`))
//     } catch (error) {
//         console.log(error)
//     }
// }

// start()
