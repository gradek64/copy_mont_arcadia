const transform = (mappedArr) => (string) =>
  string
    ? mappedArr.reduce(
        (cur, next) => cur.replace(next.replaceFrom, next.replaceTo),
        string
      )
    : string

export const heDecode = transform([
  { replaceTo: '&', replaceFrom: /&amp;/g },
  { replaceTo: '"', replaceFrom: /&quot;/g },
  { replaceTo: "'", replaceFrom: /&#x27;/g },
  { replaceTo: "'", replaceFrom: /&#039;/g },
  { replaceTo: '<', replaceFrom: /&lt;/g },
  { replaceTo: '>', replaceFrom: /&gt;/g },
  { replaceTo: '`', replaceFrom: /&#x60;/g },
])

export const heShallowEncode = transform([
  { replaceTo: '&lt;', replaceFrom: /</g },
  { replaceTo: '&gt;', replaceFrom: />/g },
])

export const heEncode = transform([
  { replaceTo: '&amp;', replaceFrom: /&/g },
  { replaceTo: '&quot;', replaceFrom: /"/g },
  { replaceTo: '&#x27;', replaceFrom: /'/g },
  { replaceTo: '&lt;', replaceFrom: /</g },
  { replaceTo: '&gt;', replaceFrom: />/g },
  { replaceTo: '&#x60;', replaceFrom: /`/g },
])

export const replaceUrl = (url) => {
  if (url === undefined) return ''

  const pat = /^https?:\/\//i
  if (!pat.test(url)) return url

  const urlRegex = /(http[s]?:\/\/)?([^/\s]+\/)(.*)/
  return url && url.replace(urlRegex, '/$3')
}

export const removeUrlProtocol = (url) => {
  if (typeof url === 'string') {
    return String(url).replace(/^https?:/, '')
  }
  return ''
}
