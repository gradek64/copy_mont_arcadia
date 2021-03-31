import transform from '../desktopNavigation'

const testData = {
  foo: 'bar',
  id: 2,
  categories: [
    {
      url: 'en/category/clothing',
      redirectionUrl: 'en/category/redirect',
      columns: [
        {
          subcategories: [
            {
              test: [
                {
                  url: 'en/category/clothing',
                  redirectionUrl: 'en/category/redirect',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

describe('desktopNavigation transform', () => {
  it('should transform navigation data', () => {
    expect(transform(testData)).toMatchSnapshot()
  })

  it('should not transform non-category properties', () => {
    const result = transform(testData)

    expect(result.foo).toBe(testData.foo)
    expect(result.id).toBe(testData.id)
  })

  it('should normalise urls at main category level', () => {
    const result = transform(testData)
    const category = result.categories[0]
    const originalCategory = testData.categories[0]

    expect(category.url).toBe(`/${originalCategory.url}`)
    expect(category.redirectionUrl).toBe(`/${originalCategory.redirectionUrl}`)
  })

  it('should normalise urls at subcategory level', () => {
    const result = transform(testData)
    const category = result.categories[0].columns[0].subcategories[0].test[0]
    const originalCategory =
      testData.categories[0].columns[0].subcategories[0].test[0]

    expect(category.url).toBe(`/${originalCategory.url}`)
    expect(category.redirectionUrl).toBe(`/${originalCategory.redirectionUrl}`)
  })
})
