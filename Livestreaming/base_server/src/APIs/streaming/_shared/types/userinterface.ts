export interface IUsers {
    username: string
    email: string
    password: string
    role?: string
    createdAt?: Date
    loginCount: number
    viewCount: number
    viewedBy: string[]
}
