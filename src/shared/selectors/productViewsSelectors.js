import { PRODUCT, OUTFIT } from '../constants/productImageTypes'
import { path } from 'ramda'

const getOverriddenDefaultView = (state) => {
  const defaultViewType = path(['productViews', 'defaultViewType'], state)
  return defaultViewType || PRODUCT
}

const isProductViewSelected = (state) => {
  const selectedViewType = path(['productViews', 'selectedViewType'], state)
  const viewTypeSelected =
    selectedViewType === PRODUCT || selectedViewType === OUTFIT
  const overriddenDefaultView = getOverriddenDefaultView(state)
  return (
    (viewTypeSelected ? selectedViewType : overriddenDefaultView) === PRODUCT
  )
}

const isOutfitViewSelected = (state) => !isProductViewSelected(state)

export { getOverriddenDefaultView, isProductViewSelected, isOutfitViewSelected }
