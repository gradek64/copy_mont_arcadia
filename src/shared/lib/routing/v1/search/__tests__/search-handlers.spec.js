import { searchRedirect } from '../search-handlers'

jest.mock('../../../../../actions/common/productsActions.js', () => ({
  getServerProducts: (a, replace) => {
    replace()
    return 'success'
  },
}))

describe('Search Routing Handlers', () => {
  describe('searchRedirect', () => {
    it('should dispatch an action server side when a user reloads a page with a search query', () => {
      const dispatch = jest.fn(
        () =>
          new Promise((resolve) => {
            resolve()
          })
      )
      const replace = jest.fn()
      searchRedirect({ dispatch }, {}, replace, () => {})
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).lastCalledWith('success')
      expect(replace).toHaveBeenCalledTimes(1)
    })
    it('should return callback client side, when a user searches for a product', () => {
      const dispatch = jest.fn(
        () =>
          new Promise((resolve) => {
            resolve()
          })
      )
      const replace = jest.fn()
      const callback = jest.fn()
      const processbrowser = process.browser
      process.browser = true
      searchRedirect({ dispatch }, {}, replace, callback)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(dispatch).not.toHaveBeenCalled()
      expect(replace).not.toHaveBeenCalled()
      process.browser = processbrowser
    })
  })
})
