import { StatusCodes } from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
    statusCode?: number
    keyValue?: Record<string, any>
    errors?: Record<string, { message: string }> // This could be undefined
    value?: string
    code?: number
    name: string
}
//@ts-ignore
const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): Response => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later'
    }

    if (err.name === 'ValidationError' && err.errors) {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(', ')
        customError.statusCode = 400
    }

    if (err.code && err.code === 11000 && err.keyValue) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
        customError.statusCode = 400
    }

    if (err.name === 'CastError') {
        customError.msg = `No item found with id: ${err.value}`
        customError.statusCode = 404
    }

    return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware
