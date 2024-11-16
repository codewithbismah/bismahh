import { Request, Response, NextFunction } from 'express'

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            role: string
            // Add other properties as needed
        }
    }
}
export const checkAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user

    if (!user || user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied' })
    }

    next()
}
