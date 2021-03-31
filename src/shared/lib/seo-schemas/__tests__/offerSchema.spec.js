import offerSchema from '../offerSchema'

describe('offerSchema', () => {
  it('should contain correct props', () => {
    const json = offerSchema({
      price: '24.00',
      priceCurrency: 'GBP',
      url: 'http://test.com',
      productId: 'ID',
      description: 'Description',
    })

    expect(json).toEqual({
      '@context': 'http://schema.org',
      '@type': 'Offer',
      price: '24.00',
      priceCurrency: 'GBP',
      url: 'http://test.com',
      description: 'Description',
      sku: 'ID',
      identifier: 'ID',
    })
  })
})
