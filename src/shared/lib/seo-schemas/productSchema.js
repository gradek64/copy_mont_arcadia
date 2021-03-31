import aggregateRatingSchema from './aggregateRatingSchema'
import offerSchema from './offerSchema'
import propertyValueSchema from './propertyValueSchema'
import ecmcTimestampToISODatetime from '../../lib/dates'

// http://schema.org/Product

export default function productSchema(
  {
    name,
    unitPrice,
    description,
    assets,
    colour,
    productId,
    attributes: {
      AverageOverallRating,
      NumReviews,
      ecmcCreatedTimestamp,
      ecmcUpdatedTimestamp,
    },
  },
  brand,
  url,
  priceCurrency
) {
  return {
    '@context': 'http://schema.org',
    '@type': 'Product',
    brand,
    name,
    offers: offerSchema({
      price: unitPrice,
      priceCurrency,
      url,
      productId,
      description,
    }),
    url,
    description,
    image: assets && assets.length && assets[0] && assets[0].url,
    color: colour,
    productID: productId,
    mpn: productId,
    sku: productId,
    aggregateRating: aggregateRatingSchema(AverageOverallRating, NumReviews),
    additionalProperty: [
      propertyValueSchema({
        property: 'dateCreated',
        value: ecmcTimestampToISODatetime(ecmcCreatedTimestamp),
      }),
      propertyValueSchema({
        property: 'dateModified',
        value: ecmcTimestampToISODatetime(ecmcUpdatedTimestamp),
      }),
    ],
  }
}
