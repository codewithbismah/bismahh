import mongoose, { Schema, Types } from 'mongoose'

// Define the Comment Interface
interface IComment {
    user: Types.ObjectId
    comment: string
    timestamp: Date
}

// Define the Anime Interface
export interface IAnime {
    _id: string
    title: string
    description?: string
    genre?: string
    likes: number
    rating?: number
    starred: number
    liked_by: Types.ObjectId[]
    starred_by: Types.ObjectId[]
    comments: IComment[]
    thumbnail_url: string
    stream_url?: string
    is_live: boolean
}
// Define the Comment Schema
const commentSchema = new Schema<IComment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
})

// Define the Anime Schema
const animeSchema = new Schema<IAnime>(
    {
        title: { type: String, required: true },
        description: { type: String },
        genre: { type: String },
        likes: { type: Number, default: 0 },
        rating: { type: Number, min: 0, max: 10 },
        starred: { type: Number, default: 0 },
        liked_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        starred_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [commentSchema],
        thumbnail_url: { type: String, required: true },
        stream_url: { type: String },
        is_live: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
)

// Create the Anime Model
const Anime = mongoose.model<IAnime>('Anime', animeSchema)

export default Anime
