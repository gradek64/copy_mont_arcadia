import aggregateRatingSchema from '../aggregateRatingSchema'

describe('aggregateRatingSchema', () => {
  it('should return undefined if no rating is provided', () => {
    expect(aggregateRatingSchema()).toBe(undefined)
  })

  it('aggregateRatingSchema should contain correct props', () => {
    const json = aggregateRatingSchema(3, 10)
    expect(json).toEqual({
      '@context': 'http://schema.org',
      '@type': 'AggregateRating',
      worstRating: 1,
      bestRating: 5,
      ratingValue: 3,
      reviewCount: 10,
    })
  })
})
