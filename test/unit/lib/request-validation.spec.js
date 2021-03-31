import { validate } from '../../../src/server/lib/request-validation'

test('GET query string params are filtered and payload nulled', () => {
  const request = {
    route: { method: 'get', path: '/api/cms/page/url' },
    query: { url: 1, someItem: 1 },
    payload: { breakStuff: true },
  }
  const reply = jest.fn()
  reply.continue = jest.fn()

  validate(request, reply)

  expect(reply).not.toHaveBeenCalled()
  expect(reply.continue).toHaveBeenCalledTimes(1)

  expect(request.payload).toBe(null)
  expect(request.query.someItem).toBeFalsy()
})

test('GET query string value for url is sanitised', () => {
  const request = {
    route: { method: 'get', path: '/api/cms/page/url' },
    query: { url: 'http://www.domain.com/path' },
  }
  const reply = jest.fn()
  reply.continue = jest.fn()

  validate(request, reply)

  expect(reply).not.toHaveBeenCalled()
  expect(reply.continue).toHaveBeenCalledTimes(1)

  expect(request.payload).toBe(null)
  expect(request.query.url).toBe('/path')
})
