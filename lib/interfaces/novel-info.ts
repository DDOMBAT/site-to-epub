import { Chapter } from './chapter'
import { Volume } from './volume'
import { SupportedFormat } from '../models/supported-format'

export interface NovelInfo {
  id: string
  title: string
  author: string
  coverUrl: string
  _chapters: Chapter[]

  outputPath: string
  outputFormat: SupportedFormat

  add (chapter: Chapter): void
  update (chapter: Chapter): void

  getChapters (): Chapter[]
  getVolumes (): Volume[]
}
