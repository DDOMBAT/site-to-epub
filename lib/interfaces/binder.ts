import { NovelInfo } from './novel-info'
import { BindingFormat } from '../models/binding-format'

export interface Binder {
  readonly format: BindingFormat
  config?: BinderConfig

  bindNovel (novel: NovelInfo, config?: BinderConfig): Promise<NovelInfo>
}

export interface BinderConfig {
  path?: string
  replace?: boolean
  deleteOld?: boolean
  singleFile?: boolean
}
