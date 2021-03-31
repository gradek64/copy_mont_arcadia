import productSchema from '../productSchema'

describe('productSchema', () => {
  it('should contain correct props', () => {
    const json = productSchema(
      {
        name: 'name',
        unitPrice: 'unitPrice',
        description: 'description',
        assets: [{ url: 'image' }],
        colour: 'colour',
        productId: 'productId',
        attributes: {
          AverageOverallRating: 'AverageOverallRating',
          NumReviews: 'NumReviews',
          ecmcCreatedTimestamp: '2019-08-12-15.41.02.000608',
          ecmcUpdatedTimestamp: '2020-01-21-15.05.06.000363',
        },
      },
      'topshop',
      'm.topshop.com',
      'GBP'
    )
    expect(json).toEqual({
      '@type': 'Product',
      '@context': 'http://schema.org',
      brand: 'topshop',
      color: 'colour',
      description: 'description',
      image: 'image',
      name: 'name',
      productID: 'productId',
      mpn: 'productId',
      sku: 'productId',
      url: 'm.topshop.com',
      offers: {
        '@context': 'http://schema.org',
        '@type': 'Offer',
        description: 'description',
        price: 'unitPrice',
        priceCurrency: 'GBP',
        sku: 'productId',
        identifier: 'productId',
        url: 'm.topshop.com',
      },
      aggregateRating: {
        '@context': 'http://schema.org',
        '@type': 'AggregateRating',
        bestRating: 5,
        ratingValue: 'AverageOverallRating',
        reviewCount: 'NumReviews',
        worstRating: 1,
      },
      additionalProperty: [
        {
          '@context': 'http://schema.org',
          '@type': 'PropertyValue',
          propertyID: 'dateCreated',
          value: '2019-08-12T15:41:02.000Z',
        },
        {
          '@context': 'http://schema.org',
          '@type': 'PropertyValue',
          propertyID: 'dateModified',
          value: '2020-01-21T15:05:06.000Z',
        },
      ],
    })
  })
})
