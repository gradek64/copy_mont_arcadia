import pageSchema from '../page'

describe('pageSchema', () => {
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

  it('pageSchema added', () => {
    expect(dataLayer.getSchema('pageSchema')).toBe(pageSchema)
  })

  it('throws if fields missing', () => {
    expect(() => {
      dataLayer.push(
        {
          pageType: 'test',
        },
        'pageSchema'
      )
    }).toThrow()
  })

  it('throws if value format incorrect', () => {
    expect(() => {
      dataLayer.push(
        {
          pageType: 'Product Listing',
          pageCategory: 123,
        },
        'pageSchema'
      )
    }).toThrow()
  })

  it('values are valid', () => {
    expect(() => {
      dataLayer.push(
        {
          pageType: 'Product Listing',
          pageCategory: 'Shirts',
        },
        'pageSchema'
      )
    }).not.toThrow()
  })
})
