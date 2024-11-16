export interface IStream {
    userId: string
    title: string
    description: string
    category: string
    status: 'live' | 'ended' // or you can use an enum for more clarity
    createdAt: Date
}
