import {
  getOverriddenDefaultView,
  isProductViewSelected,
  isOutfitViewSelected,
} from '../productViewsSelectors'
import { PRODUCT, OUTFIT } from '../../constants/productImageTypes'

describe(isProductViewSelected.name, () => {
  it('returns true when the product view is selected', () => {
    expect(
      isProductViewSelected({ productViews: { selectedViewType: PRODUCT } })
    ).toBeTruthy()
  })
  it('returns false when the outfit view is selected', () => {
    expect(
      isProductViewSelected({ productViews: { selectedViewType: OUTFIT } })
    ).toBeFalsy()
  })
  it('returns true when the product view is not selected', () => {
    expect(isProductViewSelected({ productViews: {} })).toBeTruthy()
  })
})

describe(isOutfitViewSelected.name, () => {
  it('returns true when the outfit view is selected', () => {
    expect(
      isOutfitViewSelected({ productViews: { selectedViewType: OUTFIT } })
    ).toBeTruthy()
  })
  it('returns true when the outfit view is not selected', () => {
    expect(
      isOutfitViewSelected({ productViews: { selectedViewType: PRODUCT } })
    ).toBeFalsy()
  })
})

describe(getOverriddenDefaultView.name, () => {
  it('returns the correct value when the default is OUTFIT', () => {
    const state = { productViews: { defaultViewType: OUTFIT } }
    expect(getOverriddenDefaultView(state)).toEqual(OUTFIT)
  })
  it('returns the correct value when the default is PRODUCT', () => {
    const state = { productViews: { defaultViewType: PRODUCT } }
    expect(getOverriddenDefaultView(state)).toEqual(PRODUCT)
  })
  it('returns the correct value when the default is undefined', () => {
    const state = { productViews: { defaultViewType: undefined } }
    expect(getOverriddenDefaultView(state)).toEqual(PRODUCT)
  })
})
