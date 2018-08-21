export class Chapter {
  readonly index: number
  volume: number
  title: string
  url: string
  body?: string
  hasBody?: boolean

  constructor (index: number) {
    this.index = index
  }
}
