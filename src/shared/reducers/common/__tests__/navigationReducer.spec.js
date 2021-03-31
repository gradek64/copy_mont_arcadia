import testReducer from '../navigationReducer'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'

describe('Navigation Reducer', () => {
  it('Default values', () => {
    const state = configureMockStore().getState()
    expect(state.navigation.menuLinks).toEqual([])
    expect(state.navigation.categoryHistory).toEqual([])
    expect(state.navigation.productCategories).toEqual([])
    expect(state.navigation.userDetailsGroup).toEqual([])
    expect(state.navigation.helpAndInfoGroup).toEqual([])
    expect(state.navigation.error).toEqual({})
    expect(state.navigation.footerCategories).toEqual([])
    expect(state.navigation.megaNavSelectedCategory).toEqual('')
    expect(state.navigation.megaNavHeight).toEqual(0)
  })
  describe('GET_CATEGORIES', () => {
    it('should set `menuLinks`, `productCategories`, `userDetailsGroup` and `helpAndInfoGroup`', () => {
      const menuLinks = [
        {
          navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
          index: 3,
          label: 'Clothing',
          categoryId: 203984,
        },
      ]
      const productCategories = [
        {
          navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
          index: 15,
          label: 'Dresses',
          categoryId: 746252,
        },
      ]
      const userDetailsGroup = [
        {
          navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
          index: 12,
          label: 'My Topshop Wardrobe',
          categoryId: 3376633,
        },
      ]
      const helpAndInfoGroup = [
        {
          navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
          index: 1,
          label: 'Student Discount',
          categoryId: 3376530,
        },
      ]
      expect(
        testReducer(
          {},
          {
            type: 'GET_CATEGORIES',
            menuLinks,
            productCategories,
            userDetailsGroup,
            helpAndInfoGroup,
          }
        )
      ).toEqual({
        menuLinks,
        productCategories,
        userDetailsGroup,
        helpAndInfoGroup,
      })
    })
  })
  describe('PUSH_CATEGORY_HISTORY', () => {
    it('should add item do `categoryHistory` array', () => {
      const menuItem = {
        index: 3,
        label: 'Clothing',
        categoryId: 203984,
      }
      const newMenuItem = {
        index: 15,
        label: 'Dresses',
        categoryId: 746252,
      }
      expect(
        testReducer(
          { categoryHistory: [menuItem] },
          {
            type: 'PUSH_CATEGORY_HISTORY',
            menuItem: newMenuItem,
          }
        )
      ).toEqual({
        categoryHistory: [menuItem, newMenuItem],
      })
    })
  })
  describe('POP_CATEGORY_HISTORY', () => {
    it('should remove last item from `categoryHistory`', () => {
      const firstMenuItem = {
        index: 3,
        label: 'Clothing',
        categoryId: 203984,
      }
      const secondMenuItem = {
        index: 15,
        label: 'Dresses',
        categoryId: 746252,
      }
      expect(
        testReducer(
          { categoryHistory: [firstMenuItem, secondMenuItem] },
          {
            type: 'POP_CATEGORY_HISTORY',
          }
        )
      ).toEqual({
        categoryHistory: [firstMenuItem],
      })
    })
  })
  describe('UPDATE_USER_DETAILS_GROUP', () => {
    it('should update `userDetailsGroup`', () => {
      const userDetailsGroup = [
        {
          navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
          index: 12,
          label: 'My Topshop Wardrobe',
          categoryId: 3376633,
        },
      ]
      const newUserDetailsGroup = [
        {
          navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
          index: 1,
          label: 'Sign In or Register',
          categoryId: 3376494,
        },
        {
          navigationEntryType: 'NAV_ENTRY_TYPE_LABEL',
          index: 2,
          label: 'My Account',
          categoryId: 3370549,
        },
      ]
      expect(
        testReducer(
          { userDetailsGroup },
          {
            type: 'UPDATE_USER_DETAILS_GROUP',
            newUserDetailsGroup,
          }
        )
      ).toEqual({
        userDetailsGroup: newUserDetailsGroup,
      })
    })
  })
  describe('ERROR_HANDLING_NAVIGATION', () => {
    it('should update `error`', () => {
      expect(
        testReducer(
          { error: 'error' },
          {
            type: 'ERROR_HANDLING_NAVIGATION',
            error: 'some new crucial error',
          }
        )
      ).toEqual({
        error: 'some new crucial error',
      })
    })
  })
  describe('RESET_CATEGORY_HISTORY', () => {
    it('should set `categoryHistory` to empty array', () => {
      const categoryHistory = [
        {
          index: 3,
          label: 'Clothing',
          categoryId: 203984,
        },
      ]
      expect(
        testReducer(
          { categoryHistory },
          {
            type: 'RESET_CATEGORY_HISTORY',
          }
        )
      ).toEqual({
        categoryHistory: [],
      })
    })
  })
  describe('SET_FOOTER_CATEGORIES', () => {
    it('should set `footerCategories` to max 5 elements', () => {
      const footerCategories = [
        {
          label: 'HELP1',
          links: [
            {
              label: 'Store Finder',
              seoUrl:
                '/en/tsuk/category/store-finder-1824332/home?cat2=1102568&intcmpid=W_FOOTER_MAIN_%20STORE_FINDER',
            },
          ],
        },
        {
          label: 'HELP2',
          links: [
            {
              label: 'Store Finder',
              seoUrl:
                '/en/tsuk/category/store-finder-1824332/home?cat2=1102568&intcmpid=W_FOOTER_MAIN_%20STORE_FINDER',
            },
          ],
        },
        {
          label: 'HELP3',
          links: [
            {
              label: 'Store Finder',
              seoUrl:
                '/en/tsuk/category/store-finder-1824332/home?cat2=1102568&intcmpid=W_FOOTER_MAIN_%20STORE_FINDER',
            },
          ],
        },
        {
          label: 'HELP4',
          links: [
            {
              label: 'Store Finder',
              seoUrl:
                '/en/tsuk/category/store-finder-1824332/home?cat2=1102568&intcmpid=W_FOOTER_MAIN_%20STORE_FINDER',
            },
          ],
        },
        {
          label: 'HELP5',
          links: [
            {
              label: 'Store Finder',
              seoUrl:
                '/en/tsuk/category/store-finder-1824332/home?cat2=1102568&intcmpid=W_FOOTER_MAIN_%20STORE_FINDER',
            },
          ],
        },
        {
          label: 'HELP6',
          links: [
            {
              label: 'Store Finder',
              seoUrl:
                '/en/tsuk/category/store-finder-1824332/home?cat2=1102568&intcmpid=W_FOOTER_MAIN_%20STORE_FINDER',
            },
          ],
        },
      ]
      expect(
        testReducer(
          { footerCategories },
          {
            type: 'SET_FOOTER_CATEGORIES',
            footerCategories,
          }
        )
      ).toEqual({
        footerCategories: footerCategories.slice(0, 5),
      })
    })
  })
  describe('SET_MEGA_NAV_SELECTED_CATEGORY', () => {
    it('should set `megaNavSelectedCategory`', () => {
      const megaNavSelectedCategory = 'category id'
      expect(
        testReducer(
          { megaNavSelectedCategory },
          {
            type: 'SET_MEGA_NAV_SELECTED_CATEGORY',
            megaNavSelectedCategory,
          }
        )
      ).toEqual({
        megaNavSelectedCategory,
      })
    })
  })
  describe('SET_MEGA_NAV_HEIGHT', () => {
    it('should set `megaNavHeight`', () => {
      const megaNavHeight = 50
      expect(
        testReducer(
          { megaNavHeight },
          {
            type: 'SET_MEGA_NAV_HEIGHT',
            megaNavHeight,
          }
        )
      ).toEqual({
        megaNavHeight,
      })
    })
  })
})
