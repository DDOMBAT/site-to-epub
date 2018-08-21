import { Crawler } from '../interfaces/crawler'
import { NovelInfo } from '../interfaces/novel-info'
import { SearchResult } from '../interfaces/search-result'

export class Webnovel implements Crawler {
  readonly name = 'Webnovel Crawler'
  _status: string
  _progress: number

  status (): string {
    return this._status || ''
  }
  progress (): number {
    return this._progress || 0
  }

  /**
   * Returns true if the crawler can crawl the given url.
   * @param link the url
   */
  canCrawl (link: string): boolean {
    throw Error('Not Implemented')
  }

  /**
   * Parse the novel id from a given url. It must be crawlable by the current
   * crawler. Otherwise `null` will be returned.
   * @param link the given url
   */
  getNovelId (link: string): string | null {
    throw Error('Not Implemented')
  }

  /**
   * Search for novels.
   * @param query the novel query
   */
  searchNovels (query: string): Promise<SearchResult[]> {
    throw Error('Not Implemented')
  }

  /**
   * Get more search results.
   * The query parameter is optional. If provided, it will be matched against
   * the ongoing query. Empty result will be returned, if not matched.
   * @param query
   */
  searchNovelsNext? (query?: string): Promise<SearchResult[]> {
    throw Error('Not Implemented')
  }

  /**
   * Get top level informations about a novel.
   * @param novelId the novel id
   */
  getNovel (novelId: string): Promise<NovelInfo> {
    throw Error('Not Implemented')
  }

  /**
   * Crawl chapters of a novel. It only crawls chapters with empty `body`. Pass
   * `true` to the restart parameter to start crawling from the beginning.
   * @param novel the novel info to crawl
   * @param start the starting chapter
   * @param stop the final chapter
   * @param restart to redownlod already available chapters
   */
  crawlChapters (
    novel: NovelInfo,
    start?: string | number,
    stop?: string | number,
    restart?: boolean
  ): Promise<NovelInfo> {
    throw Error('Not Implemented')
  }
}
