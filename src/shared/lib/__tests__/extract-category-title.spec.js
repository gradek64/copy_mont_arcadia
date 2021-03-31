import extractCategoryTitle from '../extract-category-title'

describe('parseTitle()', () => {
  it('should extract string prior to first pipe character', () => {
    const argOne = "Wrap Dresses | Shop Women's Wrap Dresses Online"
    expect(extractCategoryTitle(argOne)).toEqual('Wrap Dresses')
  })

  it('should trim any extra white space', () => {
    const argOne = "   Wrap Dresses    | Shop Women's Wrap Dresses Online"
    expect(extractCategoryTitle(argOne)).toEqual('Wrap Dresses')
  })

  it('should return provided string trimmed if no pipe character found', () => {
    const argOne = ' Sick Shoes  '
    expect(extractCategoryTitle(argOne)).toEqual('Sick Shoes')
  })

  it('should return empty string if no title provided', () => {
    expect(extractCategoryTitle()).toEqual('')
  })
})
