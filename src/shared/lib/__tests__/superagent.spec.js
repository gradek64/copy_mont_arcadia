describe('Superagent caching', () => {
  let superagentCache

  beforeEach(() => {
    jest.resetModules()
    jest.mock('superagent-cache', () => jest.fn())
    superagentCache = require('superagent-cache')
  })

  describe('On the client', () => {
    beforeAll(() => {
      process.browser = true
    })

    afterAll(() => {
      process.browser = false
    })

    it('does not use a custom cache', () => {
      require('../superagent')
      expect(superagentCache).not.toHaveBeenCalled()
    })

    it('cleans up previous entries in session storage', () => {
      const key = 'cache-module-session-storage'

      window.sessionStorage.setItem(key, 'ABC')
      require('../superagent')

      const result = key in window.sessionStorage
      expect(result).toBe(false)
    })
  })

  describe('On the server', () => {
    beforeAll(() => {
      process.browser = false
    })

    it('creates a caching system', () => {
      const superagent = require('../superagent')
      const {
        default: {
          Request: {
            prototype: { cache },
          },
        },
      } = superagent

      expect(typeof cache).toBe('function')
      expect(superagentCache).toHaveBeenCalled()
    })
  })
})
