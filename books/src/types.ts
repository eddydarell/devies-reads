import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Book {
  id: string
  name: string
  coverUrl: string
  description: string
  averageRating: number
  haveRead: number
  currentlyReading: number
  wantToRead: number
  userRating: number
}

export interface ShelvedBook {
  bookId: string
  status?: string
  rating?: number
}
