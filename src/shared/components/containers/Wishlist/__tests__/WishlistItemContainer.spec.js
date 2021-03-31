import React from 'react'
import { identity } from 'ramda'
import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import WishlistItemContainer from '../WishlistItemContainer'
import WishlistItem from '../WishlistItem'
import AddToBagModal from '../../../common/AddToBagModal/AddToBagModal'
import * as bagActions from '../../../../actions/common/shoppingBagActions'
import '@babel/register'
import { isIE11 } from '../../../../lib/browser'

jest.mock('../../../../lib/browser')

const props = {
  items: [
    {
      imageUrl:
        'https://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/19H30IGRY_small.jpg',
      sourceUrl:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ProductDisplay?langId=-1&storeId=12556&catalogId=33057&productId=21642083&categoryId=209987&parent_category_rn=208549',
      colour: 'GREY',
      parentProductId: 21642083,
      catEntryId: 21642091,
      lineNumber: '19H30IGRY',
      name: 'Lightweight Knit Beanie Hat',
      shipModeId: '',
      addToBagURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/InterestItemDelete?updatePrices=1&calculationUsageId=-1&calculationUsageId=-2&calculationUsageId=-7&langId=-1&storeId=12556&catalogId=33057&productId=21642083&catEntryId=21642091&orderId=700385209&calculateOrder=1&quantity=1.0&pageName=shoppingBag&savedItem=true&URL=OrderItemAddAjax%3fURL%3dOrderCalculate%3fURL%3dAddToBagFromIntListAjaxView',
      removeSavedItemURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/InterestItemDelete?updatePrices=1&calculationUsageId=-1&langId=-1&storeId=12556&catalogId=33057&productId=21642083&catEntryId=21642091&orderId=700385209&calculateOrder=1&quantity=1.0&URL=InterestItemsRemoveItemAjaxView',
      size: 'ONE',
      quantity: 1,
      itemquantity: 'Quantity',
      instock: true,
      updateURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ChangeDetailsDisplayAjaxView?orderId=700385209&langId=-1&storeId=12556&catalogId=33057&productId=21642083&catEntryId=21642091&offerPrice=9.72&size=ONE&quantity=1.0&pageName=interestItem',
      wasPrice: 12,
      unitPrice: 9.72,
      totalLabel: 'Total',
      total: '9.72',
      listItemId: 1234,
      sizeAndQuantity: [
        { catentryId: '21642091', size: 'Size 1', quantity: 10 },
        { catentryId: '21642091', size: 'Size 2', quantity: 10 },
      ],
      price: {
        nowPrice: '1.00000',
        was1Price: '3.00',
        was2Price: '300.00',
      },
    },
    {
      imageUrl:
        'https://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/19H03IBRN_small.jpg',
      sourceUrl:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ProductDisplay?langId=-1&storeId=12556&catalogId=33057&productId=21903388&categoryId=798058&parent_category_rn=277012',
      colour: 'BROWN',
      parentProductId: 21903388,
      catEntryId: 21903390,
      lineNumber: '19H03IBRN',
      name: 'Faux Fur Bear Trapper Hat',
      shipModeId: '',
      addToBagURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/InterestItemDelete?updatePrices=1&calculationUsageId=-1&calculationUsageId=-2&calculationUsageId=-7&langId=-1&storeId=12556&catalogId=33057&productId=21903388&catEntryId=21903390&orderId=700385209&calculateOrder=1&quantity=1.0&pageName=shoppingBag&savedItem=true&URL=OrderItemAddAjax%3fURL%3dOrderCalculate%3fURL%3dAddToBagFromIntListAjaxView',
      removeSavedItemURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/InterestItemDelete?updatePrices=1&calculationUsageId=-1&langId=-1&storeId=12556&catalogId=33057&productId=21903388&catEntryId=21903390&orderId=700385209&calculateOrder=1&quantity=1.0&URL=InterestItemsRemoveItemAjaxView',
      size: 'ONE',
      quantity: 1,
      itemquantity: 'Quantity',
      instock: true,
      updateURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ChangeDetailsDisplayAjaxView?orderId=700385209&langId=-1&storeId=12556&catalogId=33057&productId=21903388&catEntryId=21903390&offerPrice=14.58&size=ONE&quantity=1.0&pageName=interestItem',
      wasPrice: 18,
      unitPrice: 14.58,
      totalLabel: 'Total',
      total: '14.58',
      listItemId: 9876,
      sizeAndQuantity: [
        { catentryId: '21903390', size: 'Size 1', quantity: 10 },
      ],
    },
  ],
  baseUrlPath: '/en/tsuk',
  wishlistId: 12345,
  grid: 4,
  store: {
    getState: () => ({ config: { storeCode: 'tsuk', lang: 'en' } }),
  },
  preserveScroll: jest.fn(),
  addToBagWithCatEntryId: jest.fn(() => Promise.resolve()),
  captureWishlistEvent: jest.fn(),
  showModal: jest.fn(),
  setProductQuickview: jest.fn(),
  setProductIdQuickview: jest.fn(),
  removeProductFromWishlist: jest.fn(),
}

describe(WishlistItemContainer.name, () => {
  const context = {
    l: jest.fn(identity),
  }
  const renderComponent = testComponentHelper(
    WishlistItemContainer.WrappedComponent,
    { context }
  )
  describe('@render', () => {
    const mockProductId = 1234
    const modifier = 'wishlist'
    const reportToGA = true
    const price = 9.72
    const lineNumber = 'VE105'
    const productDetails = {
      price,
      lineNumber,
    }
    const removeProductFromWishlistArgs = {
      productId: mockProductId,
      modifier,
      reportToGA,
      productDetails,
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should render correctly', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('sets the preserveScroll only if IE11', () => {
      isIE11.mockImplementationOnce(() => true)
      const { wrapper } = renderComponent({
        ...props,
      })

      const firstWishListItem = wrapper.find(WishlistItem).first()
      firstWishListItem.prop('handleLinkClick')()
      expect(props.preserveScroll).toHaveBeenCalledWith(0)
    })

    it('sets the selectedSize state correctly', () => {
      const { wrapper } = renderComponent(props)
      const mockProductIds = [6789, 2385]
      const mockCatEntryIds = [1234, 888989]

      wrapper
        .instance()
        .handleSizeChange(
          { target: { value: mockCatEntryIds[0] } },
          mockProductIds[0]
        )
      wrapper
        .instance()
        .handleSizeChange(
          { target: { value: mockCatEntryIds[1] } },
          mockProductIds[1]
        )

      expect(wrapper.state().selectedCatEntryIds[mockProductIds[0]]).toEqual(
        mockCatEntryIds[0]
      )
      expect(wrapper.state().selectedCatEntryIds[mockProductIds[1]]).toEqual(
        mockCatEntryIds[1]
      )
    })

    it('handles adding an item to the bag', () => {
      const { wrapper } = renderComponent(props)
      const firstWishListItem = wrapper.find(WishlistItem).first()
      const mockProductId = 1111
      const mockCatEntryId = 2223

      firstWishListItem.prop('handleSizeChange')(
        { target: { value: mockCatEntryId } },
        mockProductId
      )
      firstWishListItem.prop('handleAddToBag')(
        { preventDefault: () => {} },
        mockProductId
      )

      expect(props.addToBagWithCatEntryId).toHaveBeenCalledWith(
        mockCatEntryId,
        <AddToBagModal />
      )
    })

    it('should capture `add to bag from wishlist` event success', async () => {
      const { wrapper } = renderComponent(props)
      const firstWishListItem = wrapper.find(WishlistItem).first()
      const mockProductId = 1111
      const mockCatEntryId = 2223
      const mockProductDetails = {
        lineNumber: 'TS01234',
        price: '£1.00',
      }

      firstWishListItem.prop('handleSizeChange')(
        { target: { value: mockCatEntryId } },
        mockProductId
      )
      await firstWishListItem.prop('handleAddToBag')(
        { preventDefault: () => {} },
        mockProductId,
        mockProductDetails
      )

      await setImmediate(() => {})

      expect(props.removeProductFromWishlist).toHaveBeenCalledWith({
        productId: mockProductId,
        modifier: 'wishlist',
        productDetails: mockProductDetails,
        reportToGA: false,
      })
      expect(props.captureWishlistEvent).toHaveBeenCalledWith(
        'GA_ADD_TO_BAG_FROM_WISHLIST',
        {
          productId: mockProductId,
          ...mockProductDetails,
        }
      )
    })

    it('should not capture `add to bag from wishlist` event failure', async () => {
      const initialProps = {
        ...props,
        addToBagWithCatEntryId: jest.fn(() => Promise.reject()),
      }
      const { wrapper } = renderComponent(initialProps)
      const firstWishListItem = wrapper.find(WishlistItem).first()
      const mockProductId = 1111
      const mockCatEntryId = 2223
      const mockProductDetails = {
        lineNumber: 'TS01234',
        price: '£1.00',
      }

      firstWishListItem.prop('handleSizeChange')(
        { target: { value: mockCatEntryId } },
        mockProductId
      )
      await firstWishListItem.prop('handleAddToBag')(
        { preventDefault: () => {} },
        {
          mockProductId,
          modifier: 'wishlist',
          mockProductDetails,
        }
      )

      expect(props.captureWishlistEvent).not.toHaveBeenCalled()
    })

    it('does not add to the bag when a size has not been selected', () => {
      const { wrapper } = renderComponent(props)
      bagActions.addToBagWithCatEntryId = jest.fn()
      const mockProductId = 1111

      wrapper
        .instance()
        .handleAddToBag({ preventDefault: () => {} }, mockProductId)

      expect(bagActions.addToBagWithCatEntryId).not.toHaveBeenCalled()
      expect(wrapper.state().sizeValidationErrorIds).toContain(1111)
    })

    it('handles calling the product quickview', () => {
      const { wrapper } = renderComponent(props)
      const firstWishListItem = wrapper.find(WishlistItem).first()
      const mockProductId = 1234
      firstWishListItem.prop('handleQuickView')(mockProductId)

      expect(props.setProductQuickview).toHaveBeenCalledWith({})
      expect(props.setProductIdQuickview).toHaveBeenCalledWith(mockProductId)
      expect(props.showModal).toHaveBeenCalled()
    })

    it('handles removing an item from the wishlist', async () => {
      const { wrapper } = renderComponent(props)
      const firstWishListItem = wrapper.find(WishlistItem).first()

      await firstWishListItem.prop('handleRemoveFromWishlist')(
        mockProductId,
        productDetails
      )
      expect(props.removeProductFromWishlist).toHaveBeenCalledWith(
        removeProductFromWishlistArgs
      )
    })

    it('should capture `remove from wishlist` event success', async () => {
      const { wrapper } = renderComponent(props)
      const firstWishListItem = wrapper.find(WishlistItem).first()
      const mockProductId = '666666'

      await firstWishListItem.prop('handleRemoveFromWishlist')(
        mockProductId,
        productDetails
      )
      expect(props.captureWishlistEvent).not.toHaveBeenCalled()
    })

    it('should not capture `remove from wishlist` event failure', async () => {
      const initialProps = {
        ...props,
        removeProductFromWishlist: jest.fn(() => Promise.reject()),
      }
      const { wrapper } = renderComponent(initialProps)
      const firstWishListItem = wrapper.find(WishlistItem).first()

      await firstWishListItem.prop('handleRemoveFromWishlist')(
        mockProductId,
        productDetails
      )
      expect(props.captureWishlistEvent).not.toHaveBeenCalled()
    })

    describe('when the items prop contains products available with only one size', () => {
      it('should add them to the selectedCatEntryIds', () => {
        const { wrapper } = renderComponent({
          ...props,
          items: [
            {
              parentProductId: 123456,
              catEntryId: 654321,
              sizeAndQuantity: [
                { catentryId: '654321', size: 'Size 1', quantity: 10 },
              ],
            },
          ],
        })
        expect(wrapper.state().selectedCatEntryIds).toEqual({
          '123456': 654321,
        })
      })
    })

    describe('when the items prop does not contain products available with only one size', () => {
      it('should not add them to the selectedCatEntryIds', () => {
        const { wrapper } = renderComponent({
          ...props,
          items: [
            {
              parentProductId: 123456,
              catEntryId: 654321,
              sizeAndQuantity: [
                { catentryId: '654321', size: 'Size 1', quantity: 10 },
                { catentryId: '654321', size: 'Size 2', quantity: 10 },
              ],
            },
          ],
        })
        expect(wrapper.state().selectedCatEntryIds).toEqual({})
      })
    })
  })

  describe('@lifecycles', () => {
    describe('componentWillReceiveProps', () => {
      it('shoud call getOneSizeOnlyProducts with the correct arguments', () => {
        const { wrapper, instance } = renderComponent(props)
        const getOneSizeOnlyProductsSpy = jest.spyOn(
          instance,
          'getOneSizeOnlyProducts'
        )

        expect(getOneSizeOnlyProductsSpy).not.toHaveBeenCalled()

        const newItems = [
          {
            parentProductId: 1,
            catEntryId: 2,
            sizeAndQuantity: [
              { catentryId: '2', size: 'Size 1', quantity: 10 },
            ],
          },
        ]

        wrapper.setProps({
          items: [...newItems],
        })

        expect(getOneSizeOnlyProductsSpy).toHaveBeenCalledTimes(1)
        expect(getOneSizeOnlyProductsSpy).toHaveBeenCalledWith(2, newItems)
      })
    })
  })
})
