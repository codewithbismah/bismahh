import mongoose from 'mongoose'
import { IRecording } from '../types/recordinginterface'

// onst UserapiSchema = new mongoose.Schema<IUsers>({
const RecordingSchema = new mongoose.Schema<IRecording>({
    streamId: { type: String, required: true },
    recordingUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const RecordingModel = mongoose.model<IRecording>('Recording', RecordingSchema)

export default RecordingModel
