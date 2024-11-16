import express, { Request, Response } from 'express'
import { getAnime } from '../controllers/anime'

const router = express.Router()

// Define the GET route for fetching the anime list
router.get('/list', (req: Request, res: Response) => {
    getAnime(req, res) // Call the controller with just req and res
})

export default router
