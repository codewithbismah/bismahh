import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import Models1 from './_shared/models/usermodel'
import jwt from 'jsonwebtoken'
import config from '../../config/config'
import mongoose from 'mongoose'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
interface secret {
    JWT_SECRET_KEY: string
}
const CONFIG: secret = {
    JWT_SECRET_KEY: config.JWT_SECRET_KEY || ''
}

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body

    try {
        if (!username || !email || !password) {
            res.status(400).json({ message: 'All fields are required' })
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Invalid email format' })
            return
        }

        if (!passwordRegex.test(password)) {
            res.status(400).json({
                message:
                    'Password must be between 8 to 20 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
            })
            return
        }

        const existingEmployee = await Models1.findOne({ email })
        if (existingEmployee) {
            res.status(400).json({ message: 'Employee with this email already exists' })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const newEmployee = new Models1({
            username,
            email,
            password: hashPassword
        })

        await newEmployee.save()
        res.status(201).json({ message: `Employee registered successfully: ${username}` })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

export const loginHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body

        const user = await Models1.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'Login not successful: User not found' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Login not successful: Incorrect password' })
        }

        const token = jwt.sign({ id: user._id, email: user.email }, CONFIG.JWT_SECRET_KEY, { expiresIn: '1h' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        })

        user.loginCount += 1
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            userId: user._id,
            loginCount: user.loginCount
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error })
    }
}
export const views = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params

    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY) as { id: string }
        const userId = decoded.id
        const video = await Models1.findById(id)
        if (!video) {
            return res.status(404).json({ message: 'Video not found' })
        }

        if (!video.viewedBy.includes(userId)) {
            video.viewCount += 1
            video.viewedBy.push(userId)
            await video.save()
        }
        const viewedByUsernames = await Promise.all(
            video.viewedBy.map(async (id) => {
                const user = await Models1.findById(id).select('username')
                return user ? user.username : null
            })
        )

        const filteredUsernames = viewedByUsernames.filter((username) => username !== null)

        return res.status(200).json({
            viewCount: video.viewCount,
            usernames: filteredUsernames
        })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error })
    }
}

export interface CustomJwtPayload {
    user?: string | jwt.JwtPayload
    _id: string
    role: string
}
declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            res.status(401).json({ message: 'Access denied. No token provided.' })
        }

        const decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY) as CustomJwtPayload
        console.log(decoded)
        req.user = decoded

        next()
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' })
    }
}

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user as CustomJwtPayload
        console.log('user', user)
        if (!user || !user._id || !mongoose.Types.ObjectId.isValid(user._id)) {
            return res.status(401).json({ message: 'Unauthorized or Invalid ID' })
        }

        const userId = user._id
        console.log('Fetching user with ID:', userId)

        const fetchedUser = await Models1.findById(userId).select('-password')

        if (!fetchedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json(fetchedUser)
    } catch (error: any) {
        console.error('Error fetching profile:', error)
        return res.status(500).json({ message: error.message })
    }
}

export const getuserdetails = async (req: Request, res: Response): Promise<void> => {
    const email: string = req.body.email
    try {
        const user = await Models1.find()
        console.log(email)
        console.log('Usersdata:', user)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'No employees found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.params.id

    try {
        const user = await Models1.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId: string = req.params.id
    const { username, email, password } = req.body

    try {
        const user = await Models1.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (username) user.username = username
        if (email) user.email = email
        if (password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
        }
        await user.save()

        return res.status(200).json({ message: 'User profile updated successfully', user })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error })
    }
}

const updateStreamStatus = async (viewerId: string, update: { muted?: boolean; videoStopped?: boolean }) => {
    return { viewerId, ...update }
}

export const stopVideoStream = async (req: Request, res: Response): Promise<void> => {
    const { viewerId } = req.params
    try {
        const result = await updateStreamStatus(viewerId, { videoStopped: true })
        res.status(200).json({ message: 'Video stopped successfully', result })
    } catch (error) {
        res.status(500).json({ message: 'Error stopping video', error: error.message })
    }
}
