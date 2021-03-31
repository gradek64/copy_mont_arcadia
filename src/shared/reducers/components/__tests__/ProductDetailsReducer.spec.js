import { createStore } from 'redux'
import { UPDATE_LOCATION } from 'react-router-redux'

import productDetail from '../ProductDetailsReducer'
import * as actions from 'src/shared/actions/common/productsActions'

import { getMockStoreWithInitialReduxState } from 'test/unit/helpers/get-redux-mock-store'

describe('ProductDetailsReducer', () => {
  const initialProps = {
    productId: '1234',
    sku: '123a',
    showError: false,
  }

  it('Default values', () => {
    const state = getMockStoreWithInitialReduxState().getState()
    expect(state.productDetail.activeItem).toEqual({})
    expect(state.productDetail.selectedOosItem).toEqual({})
    expect(state.productDetail.showError).toBe(false)
    expect(state.productDetail.sizeGuideOpen).toBe(false)
    expect(state.productDetail.sizeGuideType).toBe(null)
  })

  it('UPDATE_ACTIVE_ITEM', () => {
    const store = createStore(productDetail)
    const item = { ...initialProps, showError: false }

    store.dispatch(actions.updateActiveItem(item))
    const state = store.getState()

    Object.keys(item).forEach((key) => {
      expect(state.activeItem[key]).toBe(item[key])
    })
  })

  it('UPDATE_ACTIVE_ITEM_QUANTITY', () => {
    const store = createStore(productDetail)
    const selectedQuantity = 4

    store.dispatch(actions.updateActiveItemQuantity(selectedQuantity))
    const state = store.getState()

    expect(state.selectedQuantity).toBe(selectedQuantity)
  })

  it('UPDATE_SELECTED_OOS_ITEM', () => {
    const store = createStore(productDetail)
    const item = { ...initialProps }

    store.dispatch(actions.updateSelectedOosItem(item))
    const state = store.getState()

    Object.keys(item).forEach((key) => {
      expect(state.selectedOosItem[key]).toBe(item[key])
    })
  })

  it('UPDATE_SHOW_ITEMS_ERROR', () => {
    const store = createStore(productDetail)
    const showError = true

    store.dispatch(actions.updateShowItemsError(showError))
    const state = store.getState()

    expect(state.showError).toBe(showError)
  })

  it('SET_SIZE_GUIDE', () => {
    expect(
      productDetail(
        { sizeGuideType: null },
        {
          type: 'SET_SIZE_GUIDE',
          sizeGuideType: 'tops',
        }
      )
    ).toEqual({
      sizeGuideType: 'tops',
    })
  })

  it('SHOW_SIZE_GUIDE', () => {
    const store = createStore(productDetail)

    store.dispatch(actions.showSizeGuide())
    expect(store.getState().sizeGuideOpen).toEqual(true)
  })

  it('HIDE_SIZE_GUIDE', () => {
    const store = createStore(productDetail)

    store.dispatch(actions.hideSizeGuide())
    expect(store.getState().sizeGuideOpen).toEqual(false)
  })

  it('HIDE_SIZE_GUIDE', () => {
    expect(
      productDetail(
        { sizeGuideOpen: true, sizeGuideType: 'tops' },
        {
          type: 'HIDE_SIZE_GUIDE',
        }
      )
    ).toEqual({
      sizeGuideOpen: false,
      sizeGuideType: null,
    })
  })

  it('UPDATE_LOCATION', () => {
    const store = createStore(productDetail)

    store.dispatch({ type: UPDATE_LOCATION })
    expect(store.getState().sizeGuideOpen).toEqual(false)
  })
})
