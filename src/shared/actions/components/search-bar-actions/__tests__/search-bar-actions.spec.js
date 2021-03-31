import * as actions from '../search-bar-actions'

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('Search Bar Actions', () => {
  describe('toggleSearchBar()', () => {
    it('should return the correct action', () => {
      snapshot(actions.toggleSearchBar())
    })
  })

  describe('closeProductsSearchBar()', () => {
    it('should return the correct action', () => {
      snapshot(actions.closeProductsSearchBar())
    })
  })

  describe('trackSearchBarSelected()', () => {
    it('should return the correct action', () => {
      snapshot(actions.trackSearchBarSelected())
    })
  })
})
