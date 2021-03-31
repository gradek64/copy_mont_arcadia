// http://schema.org/AggregateRating

export default function aggregateRatingSchema(ratingValue, reviewCount) {
  if (!ratingValue) return undefined

  return {
    '@context': 'http://schema.org',
    '@type': 'AggregateRating',
    ratingValue,
    worstRating: 1,
    bestRating: 5,
    reviewCount,
  }
}
