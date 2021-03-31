import promosSchema from '../promos'

describe('promosSchema', () => {
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

  it('promosSchema added', () => {
    expect(dataLayer.getSchema('promosSchema')).toBe(promosSchema)
  })

  it('throws if fields missing', () => {
    expect(() => {
      dataLayer.push(
        {
          ecommerce: {
            promoClick: {
              promotions: {},
            },
          },
        },
        'promosSchema'
      )
    }).toThrow()
  })

  it('does not throw if fields valid', () => {
    expect(() => {
      dataLayer.push(
        {
          ecommerce: {
            promoClick: {
              promotions: [
                {
                  id: '123',
                  name: 'testywesty',
                  creative: undefined,
                  position: undefined,
                },
              ],
            },
          },
        },
        'promosSchema'
      )
    }).not.toThrow()
  })
})
