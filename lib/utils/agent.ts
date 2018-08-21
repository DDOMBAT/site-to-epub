import { toPairs } from 'lodash'
import { parseCookies } from './helper'
import fetch, { RequestInit, Request, Response, Headers } from 'node-fetch'

export class Agent {
  name: string
  cookies: {[index: string]: string} = {}
  headers: {[index: string]: string} = {}

  status: string
  progress: number

  interceptor = fetch

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

  buildRequestInit (): RequestInit {
    const init: RequestInit = {}
    init.headers = new Headers()
    for (const key of Object.keys(this.headers)) {
      init.headers.set(key, this.headers[key])
    }
    const cookie = toPairs(this.cookies).map(v => v.join('=')).join('; ')
    init.headers.set('Cookie', cookie)
    return init
  }

  private async request (url: string, method: string): Promise<Response> {
    const init = this.buildRequestInit()
    init.method = method || 'GET'
    const result = await this.interceptor(url, init)
    const cookies = parseCookies(result.headers.get('set-cookie') || '')
    cookies && Object.keys(cookies).forEach(key => {
      this.cookies[key] = cookies[key]
    })
    return result
  }

  public async get (url: string): Promise<Response> {
    return this.request(url, 'GET')
  }

  public async post (url: string): Promise<Response> {
    return this.request(url, 'POST')
  }

  public async json (url: string): Promise<any> {
    const result = await this.get(url)
    return result.json()
  }

  public async text (url: string): Promise<string> {
    const result = await this.get(url)
    return result.text()
  }
}

export class TestAgent extends Agent {
  constructor (interceptor: (url: string | Request, init?: RequestInit) => Response) {
    super()
    this.name = 'Test Agent'
    this.interceptor = (url: string | Request, init?: RequestInit) => {
      return new Promise(resolve => {
        resolve(interceptor && interceptor(url, init))
      })
    }
  }
}
