import propertyValueSchema from '../propertyValueSchema'

describe('propertyValueSchema', () => {
  it('should contain correct props', () => {
    const json = propertyValueSchema({
      property: 'testProperty',
      value: 'testValue',
    })

    expect(json).toEqual({
      '@context': 'http://schema.org',
      '@type': 'PropertyValue',
      propertyID: 'testProperty',
      value: 'testValue',
    })
  })
})
