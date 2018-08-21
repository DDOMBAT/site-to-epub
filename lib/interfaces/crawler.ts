import { SearchResult } from './search-result'

export interface Crawler {
  readonly name?: string
  searchNovels (name: string): SearchResult
}
