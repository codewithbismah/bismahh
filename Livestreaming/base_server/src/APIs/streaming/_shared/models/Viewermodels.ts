import mongoose from 'mongoose'
import { IViewer } from '../types/viewerinterface'

const viewerSchema = new mongoose.Schema<IViewer>({
    // userId: {
    //     type: String,
    //     required: true
    // },
    streamId: {
        type: String,
        required: true
    },
    viewerId: {
        type: String,
        required: true,
        unique: true
    }
    // joinedAt: {
    //     type: Date,
    //     default: Date.now // Automatically set the current date
    // }
})

// Create and export the Viewer model
const ViewerModel = mongoose.model<IViewer>('Viewer', viewerSchema)
export default ViewerModel
