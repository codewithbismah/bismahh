 

import { Request, Response } from 'express'
import StreamModel from '../_shared/models/streammodel' // Assuming you have a Stream model defined

// Start a new stream
export const startStream = async (req: Request, res: Response): Promise<void> => {
    const { userId, title, description, category } = req.body

    try {
        const newStream = new StreamModel({
            userId,
            title,
            description,
            category,
            status: 'live',
            createdAt: new Date()
        })

        const savedStream = await newStream.save()
        res.status(201).json({ message: 'Stream started successfully', streamId: savedStream._id })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// Stop an ongoing stream
export const stopStream = async (req: Request, res: Response): Promise<void> => {
    const { streamId } = req.body

    try {
        const stream = await StreamModel.findByIdAndUpdate(streamId, { status: 'ended' })
        if (!stream) {
            res.status(404).json({ message: 'Stream not found' })
        }
        res.status(200).json({ message: 'Stream stopped successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// Get all active streams
export const getAllStreams = async (req: Request, res: Response): Promise<void> => {
    const { streamId } = req.body
    try {
        const streams = await StreamModel.find({ status: 'live' })
        console.log(streamId)
        res.status(200).json(streams)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// Get stream details by ID
export const getStreamDetails = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        const stream = await StreamModel.findById(id)
        if (!stream) {
            res.status(404).json({ message: 'Stream not found' })
        }
        res.status(200).json(stream)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

// Get all streams by user
export const getUserStreams = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params

    try {
        const streams = await StreamModel.find({ userId })
        res.status(200).json(streams)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

export const deleteStream = async (req: Request, res: Response): Promise<void> => {
    const streamId: string = req.params.id // Get the stream ID from the request parameters

    try {
        const deletedStream = await StreamModel.findByIdAndDelete(streamId)
        if (!deletedStream) {
            res.status(404).json({ message: 'Stream not found' })
        }

        res.status(200).json({ message: 'Stream deleted successfully', deletedStream })
    } catch (error) {
        console.error('Error deleting stream:', error)
        res.status(500).json({ message: 'Server error', error })
    }
}
