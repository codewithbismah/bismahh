import mongoose from 'mongoose'

// Define Video document interface
export interface IVideo {
    title: string
    url: string
    viewCount: number
    viewedBy: string[] // Array of user IDs who have viewed the video
    createdAt: Date
    updatedAt: Date
}

const VideoSchema = new mongoose.Schema<IVideo>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    viewedBy: {
        type: [String], // Array of user IDs as strings
        default: []
    }
})

// Export the Video model
const VideoModel = mongoose.model<IVideo>('Video', VideoSchema)
export default VideoModel
