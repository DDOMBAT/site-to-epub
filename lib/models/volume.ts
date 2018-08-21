import { orderBy } from 'lodash'
import { Chapter } from './chapter'

export class Volume {
  index: number
  title: string
  private chapters: {[index: number]: Chapter} = {}

  constructor (index: number) {
    this.index = index
  }

  put (chapter: Chapter): void {
    this.chapters[chapter.index] = chapter
  }

  get (index: number): Chapter {
    return this.chapters[index]
  }

  chapterList (): Chapter[] {
    const chapters = Object.keys(this.chapters).map(key => this.chapters[key])
    return orderBy(chapters, (chap: Chapter) => chap.index)
  }
}
