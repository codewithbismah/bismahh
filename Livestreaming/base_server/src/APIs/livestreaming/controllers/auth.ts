import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import User from '../models/User'
import BadRequestError from '../errors/bad-request'
import UnauthenticatedError from '../errors/unauthenticated'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string)

// Helper function to generate a unique username
const generateUniqueUsername = async (name: string): Promise<string> => {
    let username: string = '' // Initialize username with an empty string
    let isUnique = false

    while (!isUnique) {
        username = name.replace(/\s/g, '').toLowerCase().substring(0, 6) + Math.random().toString(36).substr(2, 6)

        const existingUser = await User.findOne({ username })
        if (!existingUser) {
            isUnique = true
        }
    }

    return username
}

// Sign in with Google
export const signInWithGoogle = async (req: Request, res: Response): Promise<void> => {
    const { id_token } = req.body

    if (!id_token) {
        throw new BadRequestError('ID token is required')
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID as string
        })
        const payload = ticket.getPayload() as TokenPayload

        const verifiedEmail = payload?.email
        if (!verifiedEmail) {
            throw new UnauthenticatedError('Invalid Token or expired')
        }

        let user = await User.findOne({ email: verifiedEmail })

        if (user) {
            const accessToken = user.createAccessToken()
            const refreshToken = user.createRefreshToken()

            res.status(StatusCodes.OK).json({
                user,
                tokens: { access_token: accessToken, refresh_token: refreshToken }
            })
            return
        }

        // Ensure a valid username is generated (default to 'user' if name is undefined)
        const username = await generateUniqueUsername(payload.name ?? 'user')

        user = new User({
            email: verifiedEmail,
            username: username,
            name: payload.name,
            picture: payload.picture
        })

        await user.save()

        const accessToken = user.createAccessToken()
        const refreshToken = user.createRefreshToken()

        res.status(StatusCodes.CREATED).json({
            user,
            tokens: { access_token: accessToken, refresh_token: refreshToken }
        })
    } catch (error) {
        console.error(error)
        throw error
    }
}

// Refresh Token Handler
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refresh_token } = req.body

    if (!refresh_token) {
        throw new BadRequestError('Refresh token is required')
    }

    try {
        const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload
        const user = await User.findById(payload.id)

        if (!user) {
            throw new UnauthenticatedError('Invalid refresh token')
        }

        const newAccessToken = user.createAccessToken()
        const newRefreshToken = user.createRefreshToken()

        res.status(StatusCodes.OK).json({
            access_token: newAccessToken,
            refresh_token: newRefreshToken
        })
    } catch (error) {
        console.error(error)
        throw new UnauthenticatedError('Invalid refresh token')
    }
}

// import { Request, Response } from 'express'
// import { StatusCodes } from 'http-status-codes'
// import jwt from 'jsonwebtoken'
// import { OAuth2Client, TokenPayload } from 'google-auth-library'
// import User from '../models/User'
// import  BadRequestError  from '../errors/bad-request'
// import  UnauthenticatedError  from '../errors/unauthenticated'

// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// // Helper function to generate a unique username
// const generateUniqueUsername = async (name: string): Promise<string> => {
//     let username: string
//     let isUnique = false

//     while (!isUnique) {
//         username = name.replace(/\s/g, '').toLowerCase().substring(0, 6) + Math.random().toString(36).substr(2, 6)

//         const existingUser = await User.findOne({ username })
//         if (!existingUser) {
//             isUnique = true
//         }
//     }

//     return username
// }

// // Sign in with Google
// export const signInWithGoogle = async (req: Request, res: Response): Promise<void> => {
//     const { id_token } = req.body

//     if (!id_token) {
//         throw new BadRequestError('ID token is required')
//     }

//     try {
//         const ticket = await googleClient.verifyIdToken({
//             idToken: id_token,
//             audience: process.env.GOOGLE_CLIENT_ID
//         })
//         const payload = ticket.getPayload() as TokenPayload

//         const verifiedEmail = payload?.email
//         if (!verifiedEmail) {
//             throw new UnauthenticatedError('Invalid Token or expired')
//         }

//         let user = await User.findOne({ email: verifiedEmail })

//         if (user) {
//             const accessToken = user.createAccessToken()
//             const refreshToken = user.createRefreshToken()

//             res.status(StatusCodes.OK).json({
//                 user,
//                 tokens: { access_token: accessToken, refresh_token: refreshToken }
//             })
//             return
//         }

//         const username = await generateUniqueUsername(payload.name || 'user')

//         user = new User({
//             email: verifiedEmail,
//             username: username,
//             name: payload.name,
//             picture: payload.picture
//         })

//         await user.save()

//         const accessToken = user.createAccessToken()
//         const refreshToken = user.createRefreshToken()

//         res.status(StatusCodes.CREATED).json({
//             user,
//             tokens: { access_token: accessToken, refresh_token: refreshToken }
//         })
//     } catch (error) {
//         console.error(error)
//         throw error
//     }
// }

// // Refresh Token Handler
// export const refreshToken = async (req: Request, res: Response): Promise<void> => {
//     const { refresh_token } = req.body

//     if (!refresh_token) {
//         throw new BadRequestError('Refresh token is required')
//     }

//     try {
//         const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload
//         const user = await User.findById(payload.id)

//         if (!user) {
//             throw new UnauthenticatedError('Invalid refresh token')
//         }

//         const newAccessToken = user.createAccessToken()
//         const newRefreshToken = user.createRefreshToken()

//         res.status(StatusCodes.OK).json({
//             access_token: newAccessToken,
//             refresh_token: newRefreshToken
//         })
//     } catch (error) {
//         console.error(error)
//         throw new UnauthenticatedError('Invalid refresh token')
//     }
// }
