export class Chapter {
  readonly index: number
  readonly volume: number
  title: string
  url: string
  body?: string
  hasBody?: boolean

  constructor (index: number, volume: number) {
    this.index = index
  }
}
