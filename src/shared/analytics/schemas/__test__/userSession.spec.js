import userSessionSchema from '../userSession'

describe('userSessionSchema', () => {
  /**
   * we have to set `global.process.browser` to true before importing the
   * dataLayer module
   */
  let oldProcessBrowser
  let dataLayer
  beforeAll(() => {
    global.process.browser = true
    dataLayer = require('../../dataLayer').default
  })
  afterAll(() => {
    global.process.browser = oldProcessBrowser
  })

  it('userSessionSchema added', () => {
    expect(dataLayer.getSchema('userSessionSchema')).toBe(userSessionSchema)
  })

  it('throws if fields missing', () => {
    expect(() => {
      dataLayer.push(
        {
          user: {},
        },
        'userSessionSchema'
      )
    }).toThrow()
  })

  it('throws if fields missing', () => {
    expect(() => {
      dataLayer.push(
        {
          user: {},
        },
        'userSessionSchema'
      )
    }).toThrow()
  })

  it('throws logged in true but no ID provided', () => {
    expect(() => {
      dataLayer.push(
        {
          user: {
            loggedIn: 'True',
          },
        },
        'userSessionSchema'
      )
    }).toThrow()
  })

  it('values are valid', () => {
    expect(() => {
      dataLayer.push(
        {
          user: {
            dualRun: 'none',
            loggedIn: 'False',
            id: undefined,
          },
        },
        'userSessionSchema'
      )
    }).not.toThrow()

    expect(() => {
      dataLayer.push(
        {
          user: {
            dualRun: 'monty',
            loggedIn: 'True',
            id: '123',
          },
        },
        'userSessionSchema'
      )
    }).not.toThrow()
  })
})
