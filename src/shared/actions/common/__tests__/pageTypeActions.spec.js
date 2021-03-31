import { setPageType, clearPageType } from '../pageTypeActions'

describe('pageTypeActions', () => {
  it('setPageType', () => {
    expect(setPageType('foo')).toEqual({
      type: 'SET_PAGE_TYPE',
      pageType: 'foo',
    })
  })

  it('clearPageType', () => {
    expect(clearPageType()).toEqual({
      type: 'CLEAR_PAGE_TYPE',
    })
  })
})
