import { Chapter } from './chapter'
import { Volume } from './volume'
import { BindingFormat } from '../models/binding-format'

export interface NovelInfo {
  id: string
  title: string
  author: string
  coverUrl: string
  _chapters: Chapter[]

  outputPath: string
  outputFormats: BindingFormat[]

  add (chapter: Chapter): void
  update (chapter: Chapter): void

  getChapters (): Chapter[]
  getVolumes (): Volume[]

  getChapter (link: string): Chapter
}
