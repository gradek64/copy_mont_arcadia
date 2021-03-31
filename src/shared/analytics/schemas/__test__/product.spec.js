import deepFreeze from 'deep-freeze'

describe('productClickSchema', () => {
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

  const actionField = deepFreeze({
    list: 'some list',
  })
  const product = deepFreeze({
    name: "Big ol' hat",
    id: 123456,
    price: '1 000 000.00',
    brand: 'topshop',
    category: 'HAT',
    position: 2,
  })

  it('should not fail validation if the data is complete and correct', () => {
    const correctData = {
      ecommerce: {
        click: {
          actionField,
          products: [product],
        },
      },
    }
    expect(() => {
      dataLayer.push(correctData, 'productClickSchema', 'productClick')
    }).not.toThrow()
  })

  it('should fail validation if data is empty', () => {
    expect(() => {
      dataLayer.push({}, 'productClickSchema', 'productClick')
    }).toThrow()
  })

  it('should fail validation if data is of the wrong shape', () => {
    const wrongShapeData = {
      ecommerce: {
        click: {
          actionField: product,
          products: [actionField],
        },
      },
    }
    expect(() => {
      dataLayer.push(wrongShapeData, 'productClickSchema', 'productClick')
    }).toThrow()
  })

  it('should fail validation if one of the fields is of the wrong type', () => {
    const wrongTypeData = {
      ecommerce: {
        click: {
          actionField,
          products: [{ ...product, id: 'string not number' }],
        },
      },
    }
    expect(() => {
      dataLayer.push(wrongTypeData, 'productClickSchema', 'productClick')
    }).toThrow()
  })
})
