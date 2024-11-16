import mongoose, { Document, Schema } from 'mongoose'
import jwt from 'jsonwebtoken'

// Define the User Interface
export interface IUser extends Document {
    name: string
    username: string
    email: string
    picture?: string
    createAccessToken: () => string
    createRefreshToken: () => string
}

// Define the User Schema
const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        username: {
            type: String,
            required: true,
            match: [/^[a-zA-Z0-9_]{3,30}$/, 'Please provide a valid username'],
            unique: true
        },
        email: { type: String, required: true, unique: true },
        picture: { type: String }
    },
    {
        timestamps: true
    }
)

// Create Access Token Method
userSchema.methods.createAccessToken = function (): string {
    return jwt.sign(
        {
            id: this._id,
            name: this.name, // Fixed reference to `name` field (shouldn't use first_name and last_name if not defined)
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET as string, // Type assertion for process.env variable
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

// Create Refresh Token Method
userSchema.methods.createRefreshToken = function (): string {
    return jwt.sign(
        { id: this._id, username: this.username },
        process.env.REFRESH_TOKEN_SECRET as string, // Type assertion for process.env variable
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

// Create the User Model
const User = mongoose.model<IUser>('User', userSchema)

export default User
