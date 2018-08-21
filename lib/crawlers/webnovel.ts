import { Crawler } from '../interfaces/crawler'
import { NovelInfo } from '../models/novel-info';
import { SearchResult } from '../models/search-result'
import Agent from '../utils/agent'
import { Volume } from '../models/volume'
import { Chapter } from '../models/chapter';

export class Webnovel implements Crawler {
  readonly name = 'Webnovel Crawler'
  private agent: Agent
  private csrfToken: string

  constructor () {
    this.agent = new Agent(this.name)
  }

  status (): string {
    return this.agent.status || ''
  }
  progress (): number {
    return this.agent.progress || 0
  }

  canCrawl (link: string): boolean {
    return !!this.getNovelId(link)
  }
  getNovelId (link: string): string | null {
    const possibleIds = /\d{16,17}/g.exec(link)
    return possibleIds && possibleIds[0]
  }

  async searchNovels (query: string): Promise<SearchResult[]> {
    throw Error('Not Implemented')
  }
  async searchNovelsNext? (query?: string): Promise<SearchResult[]> {
    throw Error('Not Implemented')
  }

  private async getCsrfToken (): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken
    }
    await this.agent.get('https://www.webnovel.com')
    this.csrfToken = this.agent.cookies['_csrfToken']
    return this.csrfToken
  }

  async getNovel (novelId: string): Promise<NovelInfo> {
    novelId = this.getNovelId(novelId)
    const csrf = await this.getCsrfToken()

    const listUrlPath = 'https://www.webnovel.com/apiajax/chapter/GetChapterList'
    const chapterUrlPath = 'https://www.webnovel.com/apiajax/chapter/GetContent'
    const listUrl = `${listUrlPath}?_csrfToken=${csrf}&bookId=${novelId}`
    const result = await this.agent.json(listUrl)

    const novel = new NovelInfo(novelId)
    novel.title = result.data.bookInfo.bookName
    for (const volumeItem of result.data.volumeItems) {
      const vol = new Volume(volumeItem.index)
      vol.title = volumeItem.name
      for (const chapterItem of volumeItem.chapterItems) {
        const chap = new Chapter(chapterItem.index, vol.index)
        chap.title = chapterItem.name
        chap.url = `${chapterUrlPath}?_csrfToken=${csrf}&bookId=${novelId}&chapterId=${chapterItem.id}`
        vol.put(chap)
      }
      novel.putVolume(vol)
    }

    return novel
  }

  async crawlChapters (
    novel: NovelInfo,
    start?: string | number,
    stop?: string | number,
    restart?: boolean
  ): Promise<NovelInfo> {
    throw Error('Not Implemented')
  }
}
