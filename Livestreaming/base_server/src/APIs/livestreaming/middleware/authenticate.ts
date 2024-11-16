import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { UnauthenticatedError } from '../errors'
import NotFoundError from '../errors/not-found'
import User from '../models/User'

interface AuthRequest extends Request {
    user?: { id: string; full_name: string; role: string } // Added the 'role' property
    io?: any
}
// @ts-ignore
const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string; full_name: string; role: string }
        req.user = { id: payload.id, full_name: payload.full_name, role: payload.role } // Assign 'role' here

        // Fetch user from the database and verify they exist
        const user = await User.findById(payload.id)
        if (!user) {
            throw new NotFoundError('User not found')
        }

        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

export default auth

// import jwt from 'jsonwebtoken'
// import { Request, Response, NextFunction } from 'express'
// import { UnauthenticatedError } from '../errors'
// import NotFoundError from '../errors/not-found'
// import User from '../models/User'

// interface AuthRequest extends Request {
//     user?: { id: string; full_name: string }
//     io?: any // If you're using socket.io, you can optionally add this
// }
// //@ts-ignore
// const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith('Bearer')) {
//         throw new UnauthenticatedError('Authentication invalid')
//     }

//     const token = authHeader.split(' ')[1]

//     try {
//         const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string; full_name: string }
//         req.user = { id: payload.id, full_name: payload.full_name }

//         // Fetch user from the database and verify they exist
//         const user = await User.findById(payload.id)
//         if (!user) {
//             throw new NotFoundError('User not found')
//         }

//         next()
//     } catch (error) {
//         throw new UnauthenticatedError('Authentication invalid')
//     }
// }

// export default auth

// import jwt from 'jsonwebtoken'
// import { Request, Response, NextFunction } from 'express'
// import { UnauthenticatedError } from '../errors'
// import NotFoundError from '../errors/not-found'
// import User from '../models/User'

// interface AuthRequest extends Request {
//     user?: { id: string; full_name: string }
//     socket?: any // Adjust this type if you have a specific type for `io`
// }

// const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith('Bearer')) {
//         throw new UnauthenticatedError('Authentication invalid')
//     }

//     const token = authHeader.split(' ')[1]

//     try {
//         const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string; full_name: string }
//         req.user = { id: payload.id, full_name: payload.full_name }
//         req.socket = req.io

//         const user = await User.findById(payload.id)

//         if (!user) {
//             throw new NotFoundError('User not found')
//         }

//         next()
//     } catch (error) {
//         throw new UnauthenticatedError('Authentication invalid')
//     }
// }

// export default auth
