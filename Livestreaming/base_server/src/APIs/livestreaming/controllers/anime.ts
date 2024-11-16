import { Request, Response } from 'express'
import Anime, { IAnime } from '../models/Anime'

const selectors = 'id title description likes rating starred thumbnail_url stream_url genre'
//@ts-ignore
export const getAnime = async (req: Request, res: Response): Promise<void> => {
    try {
        const liveAnime: IAnime[] = await Anime.find({ is_live: true }).select(selectors).lean()

        const topLikedAnime: IAnime[] = await Anime.find({}).sort({ likes: -1 }).limit(10).select(selectors).lean()

        const topStarredAnime: IAnime[] = await Anime.find({}).sort({ starred: -1 }).limit(10).select(selectors).lean()

        const topRatedAnime: IAnime[] = await Anime.find({}).sort({ rating: -1 }).limit(10).select(selectors).lean()

        res.json({
            live: liveAnime,
            top_liked: topLikedAnime,
            top_starred: topStarredAnime,
            top_rated: topRatedAnime
        })
    } catch (error) {
        console.error('Error fetching anime:', error)
        res.status(500).json({ message: 'Failed to fetch anime' })
    }
}
