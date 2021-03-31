import basketSchema from '../basket'

describe('basketSchema', () => {
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

  it('basketSchema added', () => {
    expect(dataLayer.getSchema('basketSchema')).toBe(basketSchema)
  })

  it('add basket values are invalid', () => {
    expect(() => {
      dataLayer.push(
        {
          ecommerce: {
            add: {
              actionField: {
                addType: 'wrong',
              },
              products: [
                {
                  id: 123,
                  name: 'test',
                  unitWasPrice: undefined,
                  price: 123.0,
                },
              ],
            },
          },
        },
        'basketSchema'
      )
    }).toThrow()
  })

  it('remove basket values are invalid', () => {
    expect(() => {
      dataLayer.push(
        {
          ecommerce: {
            remove: {
              productsx: [
                {
                  id: '123',
                  name: 'test',
                  unitWasPrice: undefined,
                  price: '123.00',
                },
              ],
            },
          },
        },
        'basketSchema'
      )
    }).toThrow()
  })

  it('add basket values are valid', () => {
    expect(() => {
      dataLayer.push(
        {
          ecommerce: {
            add: {
              actionField: {
                addType: 'Add to Basket',
              },
              products: [
                {
                  id: '123',
                  lineNumber: 'bbbjbjb',
                  name: 'test',
                  unitWasPrice: undefined,
                  price: '123.00',
                },
              ],
            },
          },
        },
        'basketSchema'
      )
    }).not.toThrow()
  })

  it('remove basket values are valid', () => {
    expect(() => {
      dataLayer.push(
        {
          ecommerce: {
            remove: {
              products: [
                {
                  id: '123',
                  name: 'test',
                  unitWasPrice: undefined,
                  price: '123.00',
                },
              ],
            },
          },
        },
        'basketSchema'
      )
    }).not.toThrow()
  })
})
