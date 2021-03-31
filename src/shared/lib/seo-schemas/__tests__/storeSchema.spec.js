import storeSchema from '../storeSchema'

describe('productSchema', () => {
  it('should contain correct props', () => {
    const schema = storeSchema({
      name: 'Megastore',
      address: {
        line1: '214 Oxford Street',
        line2: 'Second line',
        city: 'London',
        postcode: 'W14R2',
      },
      openingHours: {
        monday: '10:00-21:00',
        tuesday: '10:00-21:00',
        wednesday: '10:00-21:00',
        thursday: '10:00-21:00',
        friday: '10:00-21:00',
        saturday: '11:00-21:00',
        sunday: '12:00-18:00',
      },
      telephoneNumber: '03448 487487',
    })
    expect(schema).toEqual({
      '@context': 'http://schema.org',
      '@type': 'ClothingStore',
      name: 'Megastore',
      openingHours:
        'Mo 10:00-21:00,Tu 10:00-21:00,We 10:00-21:00,Th 10:00-21:00,Fr 10:00-21:00,Sa 11:00-21:00,Su 12:00-18:00',
      telephone: '03448 487487',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        postalCode: 'W14R2',
        streetAddress: '214 Oxford Street, Second line',
      },
    })
  })
})
