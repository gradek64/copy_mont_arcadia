import React from 'react'
import ProductQuickview from '../../components/containers/ProductQuickview/ProductQuickview'
import { showModal } from './modalActions'
import { getProductRequest, preSelectActiveItem } from './productsActions'

export function showQuickviewModal() {
  return showModal(<ProductQuickview />, { mode: 'plpQuickview' })
}

export function updateQuickviewShowItemsError(showError) {
  return {
    type: 'UPDATE_QUICK_VIEW_SHOW_ITEMS_ERROR',
    showError,
  }
}

export function updateQuickViewActiveItem(activeItem) {
  return {
    type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM',
    activeItem,
  }
}

export function setProductQuickview(product) {
  return {
    type: 'SET_PRODUCT_QUICKVIEW',
    product,
  }
}

export function setProductIdQuickview(productId) {
  return {
    type: 'SET_PRODUCT_ID_QUICKVIEW',
    productId,
  }
}

export function updateQuickViewActiveItemQuantity(selectedQuantity) {
  return {
    type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM_QUANTITY',
    selectedQuantity,
  }
}

export function getQuickViewProduct(args) {
  return async (dispatch, getState) => {
    try {
      const product = await dispatch(getProductRequest(args))

      // if One size product then make that size active
      if (product.items) preSelectActiveItem(product)(dispatch, getState)

      dispatch(setProductQuickview(product))
    } catch (error) {
      dispatch(setProductQuickview({ success: false }))
    }
  }
}
