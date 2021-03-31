import addressSchema from '../addressSchema'

describe('addressSchema', () => {
  it('should return an address schema', () => {
    expect(
      addressSchema({
        addressLocality: '__addressLocality__',
        postalCode: '__postalCode__',
        streetAddress: '__streetAddress__',
        foo: 'bar',
      })
    ).toEqual({
      '@type': 'PostalAddress',
      addressLocality: '__addressLocality__',
      postalCode: '__postalCode__',
      streetAddress: '__streetAddress__',
    })
  })
})
