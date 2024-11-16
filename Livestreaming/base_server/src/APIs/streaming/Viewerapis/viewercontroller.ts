 

import { Request, Response } from 'express'
import ViewerModel from '../_shared/models/Viewermodels'
import StreamModel from '../_shared/models/streammodel'

const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) // Generate a random string
}
export const addViewer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId, streamId } = req.body

        if (!userId || !streamId) {
            return res.status(400).json({ success: false, message: 'User ID and Stream ID are required' })
        }

        const userIdRegex = /^[a-zA-Z0-9]+$/
        if (!userIdRegex.test(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid User ID format' })
        }

        // Check if the user exists using custom userId format
        const userExists = await StreamModel.findOne({ userId }) // Match using the custom userId
        if (!userExists) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        // Check if the stream exists
        const streamExists = await StreamModel.findById(streamId)
        if (!streamExists) {
            return res.status(404).json({ success: false, message: 'Stream not found' })
        }
        // Generate a unique viewer ID
        const viewerId = generateId()

        // Save the viewer information to the database
        const newViewer = new ViewerModel({ userId, streamId, viewerId })
        await newViewer.save()

        return res.status(201).json({ success: true, message: 'Viewer added', data: { viewerId } })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to add viewer', error })
    }
} //succesfull

export const removeViewer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { viewerId } = req.params

        // Find viewer by custom viewerId field
        const viewer = await ViewerModel.findOne({ viewerId })
        if (!viewer) {
            return res.status(404).json({ message: 'Viewer not found' })
        }

        // Remove viewer
        await viewer.deleteOne()
        console.log(`Viewer with viewerId ${viewerId} removed`)

        return res.json({ success: true, message: 'Viewer removed' })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to remove viewer', error })
    }
} //succesfull

// Get all viewers for a stream
export const getAllViewers = async (req: Request, res: Response): Promise<Response> => {
    const { streamId } = req.params
    try {
        // Retrieve all viewers from the database

        const viewers = await ViewerModel.find() // This will fetch all viewer documents
        console.log(streamId)
        return res.status(200).json({ success: true, data: viewers })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve viewers', error })
    }
}

// // Count active viewers
export const countViewers = async (req: Request, res: Response): Promise<Response> => {
    const { streamId } = req.params // Get the streamId from request parameters
    try {
        // Count the number of viewers for the specified streamId
        const viewerCount = await ViewerModel.countDocuments({ streamId }) // Count documents matching streamId

        return res.status(200).json({ success: true, count: viewerCount }) // Return the count
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to count viewers', error })
    }
}
// export const countViewers = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { streamId } = req.params
//         console.log(streamId)
//         res.json({ success: true, viewerCount: 0 }) // Replace 0 with actual count
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to count viewers', error })
//     }
// }
