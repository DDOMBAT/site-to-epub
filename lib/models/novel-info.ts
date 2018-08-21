import { orderBy, trimEnd } from 'lodash'
import { Chapter } from './chapter'
import { Volume } from './volume'
import { BindingFormat } from './binding-format'

export class NovelInfo {
  readonly id: string
  title: string
  author: string
  coverUrl: string
  private volumes: { [index: number]: Volume} = {}

  constructor (id: string) {
    this.id = id
  }

  outputPath: string = null
  outputFormats: BindingFormat[] = [ BindingFormat.json, BindingFormat.epub ]

  getVolumes (): Volume[] {
    const volumes = Object.keys(this.volumes).map(key => this.volumes[key])
    return orderBy(volumes, vol => vol.number)
  }

  getChapters (): Chapter[] {
    let chapters = this.getVolumes().map(vol => vol.chapterList())
    return [].concat(...chapters)
  }

  putVolume (volume: Volume): void {
    this.volumes[volume.number] = volume
  }

  getVolume (index: number): Volume {
    return this.volumes[index]
  }

  putChapter (chapter: Chapter): void {
    this.volumes[chapter.volume].put(chapter)
  }

  getChapter (index: number): Chapter {
    for (const key of Object.keys(this.volumes)) {
      const chapter = (this.volumes[key] as Volume).get(index)
      if (chapter) return chapter
    }
    return null
  }

  getChapterByUrl (link: string): Chapter {
    link = trimEnd(link, '/').toLowerCase()
    for (const chap of this.getChapters()) {
      if (trimEnd(chap.url, '/') === link) {
        return chap
      }
    }
    return null
  }
}
