import { Binder, BinderConfig } from '../interfaces/binder';
import { BindingFormat } from '../models/binding-format'
import { NovelInfo } from '../interfaces/novel-info'

export class JsonBinder implements Binder {
  readonly format = BindingFormat.json
  config: BinderConfig = {
    path: 'json',
    replace: true
  }

  async bindNovel (novel: NovelInfo): Promise<NovelInfo> {
    throw Error('Not Implemented')
  }

  async loadNovel (novel: NovelInfo): Promise<NovelInfo> {
    throw Error('Not Implemented')
  }

  async loadNovelInfo (fullPath: string): Promise<NovelInfo> {
    throw Error('Not Implemented')
  }
}
