import { Request, Response, NextFunction } from 'express'
// @ts-ignore
const notFound = (req: Request, res: Response, next: NextFunction): Response => {
    return res.status(404).send('Route does not exist')
}

export default notFound
