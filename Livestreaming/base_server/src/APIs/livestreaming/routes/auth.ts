import express, { Request, Response } from 'express'
import { refreshToken, signInWithGoogle } from '../controllers/auth'

const router = express.Router()

// Define the POST routes for login and refreshing tokens
router.post('/login', (req: Request, res: Response) => {
    signInWithGoogle(req, res) // Call the controller with just req and res
})

router.post('/refresh-token', (req: Request, res: Response) => {
    refreshToken(req, res) // Call the controller with just req and res
})

export default router
