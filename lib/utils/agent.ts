import { toPairs } from 'lodash'
import fetch, { RequestInit, Response, Headers } from 'node-fetch'
import { parseCookies, mergeObjects } from './helper'

export default class Agent {
  name: string
  cookies: Object
  headers: Object

  status: string
  progress: number

  constructor (name?: string | null) {
    this.name = name || 'Agent'
    this.cookies = this._defaultCookies()
    this.headers = this._defaultHeaders()
  }

  _defaultCookies (): Object {
    return {}
  }

  _defaultHeaders (): Object {
    return {
      // 'Connection': 'keep-alive',
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'
    }
  }

  _buildRequestInit (): RequestInit {
    const init: RequestInit = {}
    init.headers = new Headers()
    for (const key of Object.keys(this.headers)) {
      init.headers.set(key, this.headers[key])
    }
    const cookie = toPairs(this.cookies).map(v => v.join('=')).join('; ')
    init.headers.set('Cookie', cookie)
    return init
  }

  async _fetch (url: string, method: string): Promise<Response> {
    const init = this._buildRequestInit()
    init.method = method || 'GET'
    const result = await fetch(url, init)
    const cookies = parseCookies(result.headers.get('set-cookie') || '')
    this.cookies = mergeObjects(this.cookies, cookies)
    return result
  }

  async get (url: string): Promise<Response> {
    return this._fetch(url, 'GET')
  }

  async json (url: string): Promise<Object> {
    const resp = await this.get(url)
    return resp.json()
  }

  async post (url: string): Promise<Response> {
    return this._fetch(url, 'POST')
  }
}
