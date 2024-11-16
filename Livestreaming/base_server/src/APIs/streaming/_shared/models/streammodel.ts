import mongoose from 'mongoose'
import { IStream } from '../types/streaminterface'

const streamSchema = new mongoose.Schema<IStream>({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['live', 'ended'],
        default: 'live'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Create the Stream model
const StreamModel = mongoose.model<IStream>('Stream', streamSchema)

export default StreamModel
