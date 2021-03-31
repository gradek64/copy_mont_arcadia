const { log } = console
const { red, green, blue } = require('chalk')
const { Server } = require('hapi')
const url = require('url')

const server = Server({
  port: process.env.CORE_API_PORT || 4000,
  host: '0.0.0.0',
  routes: { cors: true },
})

let mocks = {}

server.route({
  method: 'POST',
  path: '/mocks',
  handler: (request, h) => {
    const {
      payload: { method, url, response, status = 200, headers = {} },
    } = request

    const type = url.type || 'string'

    if (!method || !url) {
      log(
        red('ERROR'),
        'Missing parameters',
        method || 'missing method',
        url || 'missing url'
      )
      return h.response().code(422)
    }

    if (!mocks[method]) {
      mocks[method] = {
        strings: {},
        matchers: [],
      }
    }

    let description
    switch (type) {
      case 'string':
        description = url
        mocks[method].strings[url] = {
          response,
          headers,
          status,
        }
        break
      case 'RegExp':
        description = url.source
        mocks[method].matchers.push({
          type: 'RegExp',
          RegExp: new RegExp(url.source),
          response,
          headers,
          status,
        })
        break
      default:
        throw new Error(`Unsupported mock URL type: ${type}`)
    }

    log(blue('LOAD'), method, description)

    return h.response().code(201)
  },
})

server.route({
  method: 'DELETE',
  path: '/mocks',
  handler: (request, h) => {
    mocks = {}

    log(blue('RESET'))

    return h.response().code(200)
  },
})

server.route({
  method: 'GET',
  path: '/mocks',
  handler: (request, h) => {
    return h.response(mocks).code(200)
  },
})

function missingMock(reply, { method, path }) {
  log(red('MISSING'), method, path)
  return reply.response().code(404)
}

function matchRequestToResponse({ method, path }) {
  const response = { success: false }
  if (mocks[method].strings[path]) {
    response.success = true
    const { response: res, headers, status } = mocks[method].strings[path]
    response.data = res
    response.headers = headers
    response.status = status
  } else {
    const matcher = mocks[method].matchers.find(
      (matcher) =>
        matcher.type === 'RegExp' ? matcher.RegExp.test(path) : null
    )
    if (matcher) {
      response.success = true
      response.data = matcher.response
      response.headers = matcher.headers
      response.status = matcher.status
    }
  }

  return response
}

server.route({
  method: '*',
  path: '/{any*}',
  handler: (request, h) => {
    const {
      url: { pathname, query },
    } = request
    const method = request.method.toUpperCase()
    const path = url.format({ pathname, query })

    if (!mocks[method]) {
      return missingMock(h, { method, path })
    }

    const response = matchRequestToResponse({ method, path })

    if (!response.success) {
      return missingMock(h, { method, path })
    }

    log(green('REQUEST'), method, path)
    log(
      green('RESPONSE'),
      'status: ',
      response.status,
      'headers: ',
      JSON.stringify(response.headers, null, 2)
    )

    const res = h.response(response.data).code(response.status)

    Object.keys(response.headers).forEach((key) => {
      res.header(key, response.headers[key])
    })

    return res
  },
})

const start = () => {
  try {
    server.start()
  } catch (err) {
    log(err)
    process.exit(1)
  }

  log('Mock server running at:', server.info.uri)
}

start()
