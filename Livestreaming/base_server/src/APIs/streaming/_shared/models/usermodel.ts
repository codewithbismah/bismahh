import mongoose from 'mongoose'
import { IUsers } from '../types/userinterface'

const UserapiSchema = new mongoose.Schema<IUsers>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true, // Set a minimum length for security
        unique: true
    },
    loginCount: {
        type: Number,
        default: 0 // Initialize login count to 0
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

// Export the User model
const Userapi = mongoose.model<IUsers>('Userapi', UserapiSchema)
export default Userapi
