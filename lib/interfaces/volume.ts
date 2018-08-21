import { Chapter } from './chapter'

export interface Volume {
  number: number
  title: string
  chapters: Chapter[]
}
