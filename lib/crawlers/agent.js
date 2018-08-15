'use strict'
import fetch from 'node-fetch'

export default class Agent {
  constructor (name) {
    this._initCookies()
    this._initHeaders()
    this.name = name || 'CrawlerAgent'
  }

  async fetch (url, config = null) {
    config = this._formatConfig(config)
    const resp = await fetch(url, config)
    resp.headers.get('cookies')
    return resp
  }

  async get (url, config) {
    config = config || {}
    config.method = 'GET'
    return this.fetch(url, config)
  }

  async json (url, config) {
    const resp = await this.get(url, config)
    return resp.json()
  }

  async post (url, config) {
    config = config || {}
    config.method = 'POST'
    return this.fetch(url, config)
  }

  _formatConfig (config) {
    config = config || {}
    config.cookies = this._mergeCookies(config.cookies)
    config.headers = this._mergeCookies(config.headers)
    return config
  }

  _initCookies () {
    this.cookies = {}
  }
  _initHeaders () {
    this.headers = {
      'Accept': 'text/html',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'
    }
  }

  _mergeCookies (cookies) {
    return Object.assign({}, this.cookies, cookies || {})
  }
  _mergeHeaders (headers) {
    return Object.assign({}, this.headers, headers || {})
  }
}
