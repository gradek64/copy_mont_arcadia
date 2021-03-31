import breadcrumbListSchema from '../breadcrumbListSchema'

describe('breadcrumbListSchema', () => {
  it('should contain correct props', () => {
    const json = breadcrumbListSchema([
      {
        label: 'label1',
        url: 'url1',
      },
      {
        label: 'label2',
        url: 'url2',
      },
    ])
    expect(json).toEqual({
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@context': 'http://schema.org',
          '@type': 'ListItem',
          item: {
            '@id': 'url1',
            name: 'label1',
          },
          position: 0,
        },
        {
          '@context': 'http://schema.org',
          '@type': 'ListItem',
          item: {
            '@id': 'url2',
            name: 'label2',
          },
          position: 1,
        },
      ],
    })
  })
})
