import { merge } from 'lodash'

export function mergeObjects (...values): Object {
  const result = {}
  for (const val of values) {
    merge(result, val || {})
  }
  return result
}

export function parseCookies (cookie: string): Object {
  return cookie
    .match(/(^|(?<=, ))[^=;,]+=[^;]+/g)
    .map(cookie => cookie.split('=').map(v => v.trim()))
    .filter(v => v[0].length && v[1].length)
    .reduce((builder, cur) => {
      builder[cur[0]] = cur[1]
      return builder
    }, {})
}
