import { isEmpty } from 'ramda'
import { createSelector } from 'reselect'
import { getLocation } from './routingSelectors'

export const rootSelector = (state) => state.navigation || {}

export const getMegaNav = (state) => {
  const { megaNav } = rootSelector(state)

  return megaNav || {}
}

export const getMegaNavHeight = (state) => {
  const { megaNavHeight } = rootSelector(state)
  return megaNavHeight || 0
}

export const getMegaNavSelectedCategory = (state) => {
  const { megaNavSelectedCategory } = rootSelector(state)

  return megaNavSelectedCategory || ''
}

export const getMegaNavCategories = (state) => {
  const { categories } = getMegaNav(state)

  return categories || []
}

export const getProductCategories = (state) => {
  const { productCategories } = rootSelector(state)

  return productCategories || []
}

export const getCategoryId = (state, seoUrl) =>
  createSelector([getProductCategories, seoUrl], (productCategories, url) => {
    const currentProductCat = productCategories.find((prodCat) =>
      url.includes(prodCat.seoUrl)
    )
    if (currentProductCat && currentProductCat.navigationEntries) {
      const currentProductSubCat = currentProductCat.navigationEntries.find(
        (prodCat) => url.includes(prodCat.seoUrl)
      )
      if (currentProductSubCat) {
        return currentProductSubCat.categoryId
      }
      return currentProductCat.categoryId
    }
  })(state)

export const getCanonicalUrl = (state) =>
  createSelector([getProductCategories], (productCategories) => {
    const pathName = getLocation(state).pathname
    const currentProductCat = productCategories.find((prodCat) =>
      pathName.includes(prodCat.seoUrl)
    )

    if (currentProductCat && currentProductCat.navigationEntries) {
      const currentProductSubCat = currentProductCat.navigationEntries.find(
        (prodCat) => pathName.includes(prodCat.seoUrl)
      )
      if (currentProductSubCat && currentProductSubCat.seoUrl)
        return currentProductSubCat.seoUrl
      return currentProductCat.seoUrl
    }
  })(state)

export const getMegaNavCategoriesVisible = createSelector(
  getMegaNav,
  (megaNav) => {
    const { categories = [] } = megaNav
    return categories.filter((c) => !c.isHidden)
  }
)

export const getMegaNavCategoriesFilteredColumns = createSelector(
  getMegaNavCategoriesVisible,
  (categories) => {
    return categories.map((category = {}) => {
      const { columns = [] } = category
      return {
        ...category,
        columns: columns.filter(
          (column) =>
            Boolean(column.subcategories) && !isEmpty(column.subcategories)
        ),
      }
    })
  }
)
