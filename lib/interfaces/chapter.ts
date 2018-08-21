export interface Chapter {
  number: number
  title: string
  volume: number
  body?: string

  getUrl (): string
  hasBody (): boolean
}
