import React from 'react'
import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import {
  showQuickviewModal,
  updateQuickviewShowItemsError,
  updateQuickViewActiveItem,
  setProductQuickview,
  setProductIdQuickview,
  updateQuickViewActiveItemQuantity,
  getQuickViewProduct,
} from '../quickviewActions'

jest.mock(
  '../../../components/containers/ProductQuickview/ProductQuickview',
  () => jest.fn(() => <div />)
)

jest.mock('../../../actions/common/productsActions')

import {
  getProductRequest,
  preSelectActiveItem,
} from '../../../actions/common/productsActions'

describe('quickviewActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('showQuickviewModal', () => {
    it('should show the quick view modal', () => {
      const store = mockStoreCreator({})
      store.dispatch(showQuickviewModal())

      const expectedActions = [
        { type: 'SET_MODAL_MODE', mode: 'plpQuickview' },
        {
          type: 'SET_MODAL_CHILDREN',
          children: expect.stringContaining('<div'),
        },
      ]

      expect(store.getActions()).toMatchObject(
        expect.arrayContaining(expectedActions)
      )
    })
  })

  describe('updateQuickviewShowItemsError', () => {
    it('should return an action to set the show error state', () => {
      expect(updateQuickviewShowItemsError(false)).toMatchSnapshot()
    })
  })

  describe('updateQuickViewActiveItem', () => {
    it('should return an action to set the active product state', () => {
      expect(updateQuickViewActiveItem({ activeItem: true })).toMatchSnapshot()
    })
  })

  describe('setProductQuickview', () => {
    it('should return action to set the product state', () => {
      expect(setProductQuickview({ product: true })).toMatchSnapshot()
    })
  })

  describe('setProductIdQuickview', () => {
    it('should return action to set the productId state', () => {
      expect(setProductIdQuickview('abc123')).toMatchSnapshot()
    })
  })

  describe('updateQuickViewActiveItemQuantity', () => {
    it('should return an action to update selected quantity', () => {
      expect(updateQuickViewActiveItemQuantity(10)).toMatchSnapshot()
    })
  })

  describe('getQuickViewProduct', () => {
    it('should fetch products and set quick view product state', async () => {
      const mockProduct = {
        product: true,
      }

      getProductRequest.mockReturnValueOnce(() => mockProduct)

      const expectedActions = [
        { type: 'SET_PRODUCT_QUICKVIEW', product: mockProduct },
      ]

      const store = mockStoreCreator()
      await store.dispatch(getQuickViewProduct({ identifier: 'abc123' }))

      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    it('should call preSelectActiveItems if items are available', async () => {
      const mockProduct = {
        items: [{ one: true }, { two: true }],
      }

      getProductRequest.mockReturnValueOnce(() => mockProduct)
      const store = mockStoreCreator()
      await store.dispatch(getQuickViewProduct({ identifier: 'abc123' }))

      expect(preSelectActiveItem).toHaveBeenCalledWith(mockProduct)
    })

    it('should not call preSelectActiveItems if there are no items', async () => {
      const mockProduct = {}

      getProductRequest.mockReturnValueOnce(() => mockProduct)
      const store = mockStoreCreator()
      await store.dispatch(getQuickViewProduct({ identifier: 'abc123' }))

      expect(preSelectActiveItem).not.toHaveBeenCalled()
    })

    it('should set the quickview with success false if an error occurs', async () => {
      getProductRequest.mockImplementationOnce(() => {
        throw new Error()
      })

      const expectedActions = [
        { type: 'SET_PRODUCT_QUICKVIEW', product: { success: false } },
      ]

      const store = mockStoreCreator()
      await store.dispatch(getQuickViewProduct({ identifier: 'abc123' }))

      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })
  })
})
