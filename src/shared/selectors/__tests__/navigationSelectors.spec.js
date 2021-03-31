import deepFreeze from 'deep-freeze'

import * as navigationSelectors from '../navigationSelectors'

describe('Navigation selectors', () => {
  const state = deepFreeze({
    navigation: {
      megaNavSelectedCategory: 'category id',
      megaNav: {
        categories: [
          {
            isHidden: false,
            columns: [{ subcategories: 'something' }],
          },
          {
            isHidden: false,
            columns: [{ subcategories: '' }],
          },
          {
            isHidden: true,
          },
        ],
      },
      megaNavHeight: 0,
    },
  })

  describe('getMegaNav', () => {
    it('should return megaNav when it exists in state', () => {
      expect(navigationSelectors.getMegaNav(state)).toEqual(
        state.navigation.megaNav
      )
    })

    it('should return default value when it does not exists in state', () => {
      expect(navigationSelectors.getMegaNav({})).toEqual({})
    })
  })

  describe('getMegaNavSelectedCategory', () => {
    it('should return getMegaNavSelectedCategory when it exists in state', () => {
      expect(navigationSelectors.getMegaNavSelectedCategory(state)).toBe(
        state.navigation.megaNavSelectedCategory
      )
    })

    it('should return default value when it does not exists in state', () => {
      expect(navigationSelectors.getMegaNavSelectedCategory({})).toBe('')
    })
  })

  describe('getMegaNavCategories', () => {
    it('should return value when it exists in state', () => {
      expect(navigationSelectors.getMegaNavCategories(state)).toEqual(
        state.navigation.megaNav.categories
      )
    })

    it('should return default value when it does not exists in state', () => {
      expect(navigationSelectors.getMegaNavCategories({})).toEqual([])
    })
  })

  describe('getMegaNavCategoriesVisible', () => {
    it('should return visible categories only', () => {
      expect(navigationSelectors.getMegaNavCategoriesVisible(state)).toEqual([
        state.navigation.megaNav.categories[0],
        state.navigation.megaNav.categories[1],
      ])
    })
  })

  describe('getMegaNavCategoriesFilteredColumns', () => {
    it('should return columns where subcategories in each column is not empty', () => {
      expect(
        navigationSelectors.getMegaNavCategoriesFilteredColumns(state)[0]
          .columns
      ).toEqual(state.navigation.megaNav.categories[0].columns)
      expect(
        navigationSelectors.getMegaNavCategoriesFilteredColumns(state)[1]
          .columns
      ).toEqual([])
    })
  })

  describe('getMegaNavHeight', () => {
    it('should return a value when it exist in state', () => {
      expect(navigationSelectors.getMegaNavHeight(state)).toEqual(
        state.navigation.megaNavHeight
      )
    })

    it('should return the default value when it does not exist in state', () => {
      expect(navigationSelectors.getMegaNavHeight({})).toEqual(0)
    })
  })
})
