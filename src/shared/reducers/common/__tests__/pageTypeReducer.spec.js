import pageTypeReducer from '../pageTypeReducer'

describe('pageTypeReducer', () => {
  it('should set default page type', () => {
    const reducer = pageTypeReducer(null, {})
    expect(reducer).toEqual(null)
  })

  it('should set correct page type', () => {
    const reducer = pageTypeReducer(null, {
      type: 'SET_PAGE_TYPE',
      pageType: 'foo',
    })
    expect(reducer).toEqual('foo')
  })

  it('should clear page type', () => {
    const reducer = pageTypeReducer(null, {
      type: 'CLEAR_PAGE_TYPE',
    })
    expect(reducer).toEqual(null)
  })
})
