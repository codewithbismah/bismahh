import { Server, Socket } from 'socket.io'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Types, Document } from 'mongoose'
import Anime from '../models/Anime'
import IAnime from '../models/Anime'
import User, { IUser } from '../models/User'

interface AuthenticatedSocket extends Socket {
    user?: {
        id: string
        full_name: string
    }
}

// Extend IAnime to include Document if not done already in your model
interface IAnime extends Document {
    _id: Types.ObjectId
    likes: number
    rating: number
    starred: number
    liked_by: Types.ObjectId[]
    starred_by: Types.ObjectId[]
    comments: IComment[]
}

// Define IComment interface to match the structure in Anime model
interface IComment {
    user: Types.ObjectId
    comment: string
    timestamp: Date
}

const handleSocketConnection = (io: Server) => {
    io.use(async (socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.headers.access_token as string | undefined
        if (!token) {
            return next(new Error('Authentication invalid: No token provided'))
        }

        try {
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
            const user = (await User.findById(payload.id)) as IUser | null
            if (!user) {
                return next(new Error('Authentication invalid: User not found'))
            }

            socket.user = { id: payload.id, full_name: payload.full_name as string }
            next()
        } catch (error) {
            console.log('Socket Error', error)
            return next(new Error('Authentication invalid: Token verification failed'))
        }
    })

    io.on('connection', (socket: AuthenticatedSocket) => {
        socket.on('JOIN_STREAM', ({ animeId }: { animeId: string }) => {
            console.log(animeId, 'user Joined')
            socket.join(animeId)
        })

        socket.on('GET_ANIME_INFO', async ({ animeId }: { animeId: string }) => {
            const anime = (await Anime.findById(new Types.ObjectId(animeId)).populate('comments.user')) as IAnime | null
            if (!anime) {
                socket.emit('ERROR', { message: 'Anime not found' })
                return
            }

            const userId = new Types.ObjectId(socket.user!.id)
            const isLiked = anime.liked_by.some((id) => id.equals(userId))
            const isStarred = anime.starred_by.some((id) => id.equals(userId))

            socket.emit('STREAM_ANIME_INFO', {
                _id: anime._id,
                is_liked: isLiked,
                is_starred: isStarred,
                likes: anime.likes,
                rating: anime.rating,
                starred: anime.starred,
                comments: anime.comments
            })
        })

        socket.on('LIKE_ANIME', async ({ animeId }: { animeId: string }) => {
            const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null
            if (!anime) {
                socket.emit('ERROR', { message: 'Anime not found' })
                return
            }

            const userId = new Types.ObjectId(socket.user!.id)
            const alreadyLiked = anime.liked_by.some((id) => id.equals(userId))
            if (!alreadyLiked) {
                anime.likes += 1
                anime.liked_by.push(userId)
                await anime.save()
                io.to(animeId).emit('STREAM_LIKES', { likes: anime.likes })
            }
        })

        socket.on('RATE_ANIME', async ({ animeId, rating }: { animeId: string; rating: number }) => {
            const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null
            if (!anime) {
                socket.emit('ERROR', { message: 'Anime not found' })
                return
            }

            if (rating >= 0 && rating <= 10) {
                anime.rating = rating
                await anime.save()
                io.to(animeId).emit('STREAM_RATING', { rating: anime.rating })
            }
        })

        socket.on('STAR_ANIME', async ({ animeId }: { animeId: string }) => {
            const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null
            if (!anime) {
                socket.emit('ERROR', { message: 'Anime not found' })
                return
            }

            const userId = new Types.ObjectId(socket.user!.id)
            const alreadyStarred = anime.starred_by.some((id) => id.equals(userId))
            if (!alreadyStarred) {
                anime.starred += 1
                anime.starred_by.push(userId)
                await anime.save()
                io.to(animeId).emit('STREAM_STARRED', { starred: anime.starred })
            }
        })

        socket.on('NEW_COMMENT', async ({ animeId, comment }: { animeId: string; comment: string }) => {
            const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null
            if (!anime) {
                socket.emit('ERROR', { message: 'Anime not found' })
                return
            }

            anime.comments.push({
                user: new Types.ObjectId(socket.user!.id),
                comment,
                timestamp: new Date()
            })
            await anime.save()

            const updatedAnime = await Anime.findById(animeId).populate('comments.user')
            io.to(animeId).emit('STREAM_COMMENTS', updatedAnime!.comments)
        })

        socket.on('SEND_REACTION', ({ animeId, reaction }: { animeId: string; reaction: string }) => {
            const reactionData = {
                emoji: reaction,
                timestamp: Date.now()
            }

            io.to(animeId).emit('STREAM_REACTIONS', reactionData)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })
}

export default handleSocketConnection

// import { Server, Socket } from 'socket.io'
// import jwt, { JwtPayload } from 'jsonwebtoken'
// import { Types } from 'mongoose' // Import Types from mongoose for ObjectId handling
// import Anime, { IAnime } from '../models/Anime'
// import User, { IUser } from '../models/User'
// import { ObjectId } from 'mongodb'

// interface AuthenticatedSocket extends Socket {
//     user?: {
//         id: string
//         full_name: string
//     }
// }

// const handleSocketConnection = (io: Server) => {
//     io.use(async (socket: AuthenticatedSocket, next) => {
//         const token = socket.handshake.headers.access_token as string
//         if (!token) {
//             return next(new Error('Authentication invalid: No token provided'))
//         }

//         try {
//             const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
//             const user = (await User.findById(payload.id)) as IUser | null
//             if (!user) {
//                 return next(new Error('Authentication invalid: User not found'))
//             }

//             socket.user = { id: payload.id, full_name: payload.full_name as string }
//             next()
//         } catch (error) {
//             console.log('Socket Error', error)
//             return next(new Error('Authentication invalid: Token verification failed'))
//         }
//     })

//     io.on('connection', (socket: AuthenticatedSocket) => {
//         socket.on('JOIN_STREAM', async ({ animeId }: { animeId: string }) => {
//             console.log(animeId, 'user Joined')
//             socket.join(animeId)
//         })

//         socket.on('GET_ANIME_INFO', async ({ animeId }: { animeId: string }) => {
//             const anime = (await Anime.findById(new Types.ObjectId(animeId)).populate('comments.user')) as IAnime | null
//             if (!anime) {
//                 socket.emit('ERROR', { message: 'Anime not found' })
//                 return
//             }
// // Make sure to import ObjectId

// const userId = new ObjectId(socket.user!.id) // Convert user id to ObjectId
// const isLiked = anime.liked_by.includes(userId)
// const isStarred = anime.starred_by.includes(userId)

//             socket.emit('STREAM_ANIME_INFO', {
//                 _id: anime._id, // Use _id instead of id
//                 is_liked: isLiked,
//                 is_starred: isStarred,
//                 likes: anime.likes,
//                 rating: anime.rating,
//                 starred: anime.starred,
//                 comments: anime.comments
//             })
//         })

//         socket.on('LIKE_ANIME', async ({ animeId }: { animeId: string }) => {
//             const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null

//             if (!anime) {
//                 socket.emit('ERROR', { message: 'Anime not found' })
//                 return
//             }

//             const alreadyLiked = anime.liked_by.includes(socket.user!.id)
//             if (!alreadyLiked) {
//                 anime.likes += 1
//                 anime.liked_by.push(new Types.ObjectId(socket.user!.id)) // Convert to ObjectId
//                 await anime.save()

//                 io.to(animeId).emit('STREAM_LIKES', { likes: anime.likes })
//             }
//         })

//         socket.on('RATE_ANIME', async ({ animeId, rating }: { animeId: string; rating: number }) => {
//             const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null

//             if (!anime) {
//                 socket.emit('ERROR', { message: 'Anime not found' })
//                 return
//             }

//             if (rating >= 0 && rating <= 10) {
//                 anime.rating = rating
//                 await anime.save()

//                 io.to(animeId).emit('STREAM_RATING', { rating: anime.rating })
//             }
//         })

//         socket.on('STAR_ANIME', async ({ animeId }: { animeId: string }) => {
//             const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null

//             if (!anime) {
//                 socket.emit('ERROR', { message: 'Anime not found' })
//                 return
//             }

//             const alreadyStarred = anime.starred_by.includes(socket.user!.id)
//             if (!alreadyStarred) {
//                 anime.starred += 1
//                 anime.starred_by.push(new Types.ObjectId(socket.user!.id)) // Convert to ObjectId
//                 await anime.save()

//                 io.to(animeId).emit('STREAM_STARRED', { starred: anime.starred })
//             }
//         })

//         socket.on('NEW_COMMENT', async ({ animeId, comment }: { animeId: string; comment: string }) => {
//             const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null
//             if (!anime) {
//                 socket.emit('ERROR', { message: 'Anime not found' })
//                 return
//             }

//             anime.comments.push({ user: new Types.ObjectId(socket.user!.id), comment }) // Convert to ObjectId
//             await anime.save()

//             const updatedAnime = await Anime.findById(animeId).populate('comments.user')

//             io.to(animeId).emit('STREAM_COMMENTS', updatedAnime!.comments)
//         })

//         socket.on('SEND_REACTION', async ({ animeId, reaction }: { animeId: string; reaction: string }) => {
//             const anime = (await Anime.findById(new Types.ObjectId(animeId))) as IAnime | null
//             if (!anime) {
//                 socket.emit('ERROR', { message: 'Anime not found' })
//                 return
//             }

//             const reactionData = {
//                 emoji: reaction,
//                 timestamp: Date.now()
//             }

//             io.to(animeId).emit('STREAM_REACTIONS', reactionData)
//         })

//         socket.on('disconnect', () => {})
//     })
// }

// export default handleSocketConnection
