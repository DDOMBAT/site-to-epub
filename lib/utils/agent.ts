import { toPairs } from 'lodash'
import fetch, { RequestInit, Response, Headers } from 'node-fetch'
import { parseCookies } from './helper'

export default class Agent {
  name: string
  cookies: {[index: string]: string}
  headers: {[index: string]: string}

  status: string
  progress: number

  constructor (name?: string | null) {
    this.name = name || 'Agent'
    this.cookies = this.defaultCookies()
    this.headers = this.defaultHeaders()
  }

  private defaultCookies (): {[index: string]: string} {
    return {}
  }

  private defaultHeaders (): {[index: string]: string} {
    return {
      // 'Connection': 'keep-alive',
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'
    }
  }

  private buildRequestInit (): RequestInit {
    const init: RequestInit = {}
    init.headers = new Headers()
    for (const key of Object.keys(this.headers)) {
      init.headers.set(key, this.headers[key])
    }
    const cookie = toPairs(this.cookies).map(v => v.join('=')).join('; ')
    init.headers.set('Cookie', cookie)
    return init
  }

  private async fetch (url: string, method: string): Promise<Response> {
    const init = this.buildRequestInit()
    init.method = method || 'GET'
    const result = await fetch(url, init)
    const cookies = parseCookies(result.headers.get('set-cookie') || '')
    Object.keys(cookies).forEach(key => {
      this.cookies[key] = cookies[key]
    })
    return result
  }

  async get (url: string): Promise<Response> {
    return this.fetch(url, 'GET')
  }

  async json (url: string): Promise<any> {
    const resp = await this.get(url)
    return resp.json()
  }

  async post (url: string): Promise<Response> {
    return this.fetch(url, 'POST')
  }
}
