import { Chapter } from './chapter'
import { Volume } from './volume'

export interface NovelInfo {
  id: string
  title: string
  author: string
  coverUrl: string
  _chapters: Chapter[]

  add (chapter: Chapter): void
  update (chapter: Chapter): void

  getChapters (): Chapter[]
  getVolumes (): Volume[]
}
