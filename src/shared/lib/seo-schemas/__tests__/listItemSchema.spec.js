import listItemSchema from '../listItemSchema'

describe('listItemSchema', () => {
  it('should contain correct props', () => {
    const json = listItemSchema(
      {
        id: 'id',
        name: 'name',
      },
      1
    )
    expect(json).toEqual({
      '@context': 'http://schema.org',
      '@type': 'ListItem',
      position: 1,
      item: {
        '@id': 'id',
        name: 'name',
      },
    })
  })
})
