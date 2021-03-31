// http://schema.org/Offer

export default function offerSchema({
  price,
  priceCurrency,
  url,
  productId,
  description,
}) {
  return {
    '@context': 'http://schema.org',
    '@type': 'Offer',
    price,
    priceCurrency,
    url,
    sku: productId,
    description,
    identifier: productId,
  }
}
