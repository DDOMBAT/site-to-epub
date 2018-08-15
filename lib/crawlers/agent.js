'use strict'
import fetch from 'node-fetch'

function merge (a, b) {
  return Object.assign({}, a || {}, b || {})
}

function defaultCookies () {
  return {}
}

function defaultHeaders () {
  return {
    // 'Accept': 'text/html,application/json',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'
  }
}

export const parseCookie = function (cookie) {
  return cookie
    .match(/(^|(?<=, ))[^=;,]+=[^;]+/g)
    .map(cookie => cookie.split('=').map(v => v.trim()))
    .filter(v => v[0].length && v[1].length)
    .reduce((builder, cur) => {
      builder[cur[0]] = cur[1]
      return builder
    }, {})
}

export default class Agent {
  constructor (name) {
    this.name = name || 'CrawlerAgent'
    this.cookies = defaultCookies()
    this.headers = defaultHeaders()
  }

  async fetch (url, config = null) {
    config = config || {}
    config.method = config.method || 'GET'
    config.cookies = merge(this.cookies, config.cookies)
    config.headers = merge(this.headers, config.headers)
    const res = await fetch(url, config)
    res.cookies = parseCookie(res.headers.get('set-cookie') || '')
    Object.assign(this.cookies, res.cookies)
    return res
  }

  async get (url, config) {
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
}
