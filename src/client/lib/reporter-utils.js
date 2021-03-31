import {
  getTraceIdFromCookie,
  getDRETValue,
} from '../../../src/shared/lib/cookie'

export const postToServer = (docurl, namespace, body) => {
  const timestamp = Math.round(new Date().getTime())

  if (process.browser && window.XMLHttpRequest) {
    const traceId = getTraceIdFromCookie(window.document.cookie)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/${docurl}`, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.setRequestHeader('X-TRACE-ID', traceId)

    const url = window.location.href
    const { userAgent } = window.navigator

    const dretValue = getDRETValue({ cookies: window.document.cookie })

    xhr.send(
      JSON.stringify({
        ...body,
        namespace,
        traceId,
        dretValue,
        userAgent,
        url,
        timestamp,
      })
    )
  }
}
