import testComponentHelper, {
  mockLocalise,
} from 'test/unit/helpers/test-component'
import deepFreeze from 'deep-freeze'
import OrderProducts from '../OrderProducts'
import OrderProduct from '../OrderProduct'
import OrderProductPromo from '../OrderProductPromo'
import Price from '../../Price/Price'
import Select from '../../FormComponents/Select/Select'
import productsMockAsJsonObj from 'test/mocks/products-with-inventory'
import { isCFSIToday } from '../../../../lib/get-delivery-days/isCfsi'
import * as siteInteractions from '../../../../analytics/tracking/site-interactions'
import { GTM_CATEGORY, GTM_ACTION } from '../../../../analytics'

jest.mock('../../../../lib/get-delivery-days/isCfsi', () => ({
  isCFSIToday: jest.fn(),
}))

const defaultProps = deepFreeze({
  products: productsMockAsJsonObj.map((product) => ({
    ...product,
    catEntryId: 27126578,
    totalPrice: 10,
    isDDPProduct: false,
    lowStock: false,
    inStock: true,
    quantitySelected: '1',
  })),
  orderId: 123,
  allowEmptyBag: false,
  scrollable: false,
  className: '',
  selectedStore: {},
  deleteFromBag: jest.fn(),
  showModal: jest.fn(),
  closeModal: jest.fn(),
  closeMiniBag: jest.fn(),
  openMiniBag: jest.fn().mockReturnValueOnce(Promise.resolve()),
  editBagProductStatus: jest.fn(),
  fetchProductItemSizesAndQuantities: jest.fn(),
  updateShoppingBagProduct: jest.fn(),
  onUpdateProduct: jest.fn(),
  persistShoppingBagProduct: jest.fn(),
  scrollOnEdit: jest.fn(),
  sendAnalyticsClickEvent: jest.fn(),
  isFeatureWishlistEnabled: false,
  allowMoveToWishlist: false,
  selectedDeliveryLocation: 'STORE',
})

const lowStockProps = {
  oosOnly: true,
  products: productsMockAsJsonObj.map((product) => ({
    ...product,
    catEntryId: 27126578,
    totalPrice: 10,
    isDDPProduct: false,
    lowStock: true,
    inStock: true,
    quantitySelected: '1',
  })),
}

const isDDPProductProps = deepFreeze({
  products: productsMockAsJsonObj.map((product) => ({
    ...product,
    catEntryId: 27126578,
    isDDPProduct: true,
  })),
})

describe('OrderProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(siteInteractions, 'analyticsShoppingBagClickEvent')
  })

  const renderComponent = testComponentHelper(OrderProducts.WrappedComponent, {
    disableLifecycleMethods: false,
    context: {
      l: jest.fn(mockLocalise),
    },
  })

  it('should render with the default props', () => {
    expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
  })

  describe('Low Stock products', () => {
    it('should be rendered', () => {
      const { wrapper } = renderComponent(lowStockProps)
      expect(wrapper.find('.OrderProducts-product').length).toBe(
        lowStockProps.products.length
      )
    })
  })

  describe('Wishlist', () => {
    it('should show move to wishlist button with allowMoveToWishlist=true and isFeatureWishlistEnabled=true', () => {
      const props = {
        ...defaultProps,
        allowMoveToWishlist: true,
        isFeatureWishlistEnabled: true,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('.OrderProducts-movetowishlistContainer').length
      ).not.toBe(0)
    })
    it('should not show move to wishlist with isFeatureWishlistEnabled=true / allowMoveToWishlist=false', () => {
      const props = {
        ...defaultProps,
        isFeatureWishlistEnabled: true,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('.OrderProducts-movetowishlistContainer').length
      ).toBe(0)
    })
    it('should not show move to wishlist with isFeatureWishlistEnabled=false / allowMoveToWishlist=true', () => {
      const props = {
        ...defaultProps,
        allowMoveToWishlist: true,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('.OrderProducts-movetowishlistContainer').length
      ).toBe(0)
    })
    it('should not show move to wishlist if it is a DDPProduct', () => {
      const props = {
        ...defaultProps,
        isFeatureWishlistEnabled: true,
        allowMoveToWishlist: true,
        ...isDDPProductProps,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('.OrderProducts-movetowishlistContainer').exists()
      ).toBe(false)
    })
  })

  describe('Stock messages', () => {
    const product = {
      quantity: 1,
      lowStock: true,
      inventoryPositions: {
        invavls: [{ quantity: 2 }],
        inventorys: [{ quantity: 3 }],
      },
    }
    describe('@render - Low Stock', () => {
      it('displays low stock message if lowStock prop is true', () => {
        const { wrapper } = renderComponent({
          products: [product],
        })
        const lowStockComponent = wrapper.find(
          '.OrderProducts-productLowStockMessage'
        )
        expect(lowStockComponent).toHaveLength(1)
        expect(lowStockComponent.text()).toEqual('Low stock')
      })
      it('does not display low stock message if lowStock prop is false', () => {
        const lowStock = false
        const { wrapper } = renderComponent({
          products: [{ ...product, lowStock }],
        })
        expect(
          wrapper.find('.OrderProducts-productLowStockMessage').exists()
        ).toBe(false)
      })
      it('does not display the low stock message if the user is on the thank you page', () => {
        const { wrapper } = renderComponent({
          pathname: '/order-complete',
          products: [product],
        })
        expect(
          wrapper.find('.OrderProducts-productLowStockMessage').exists()
        ).toBe(false)
      })
    })

    describe('@render - Out of stock message', () => {
      const product = {
        quantity: 1,
        inStock: false,
        inventoryPositions: {
          invavls: [{ quantity: 2 }],
          inventorys: [{ quantity: 3 }],
        },
      }
      it('displays out of stock message if inStock is false', () => {
        const { wrapper } = renderComponent({
          products: [product],
        })
        const productOutOfStockMessages = wrapper.find(
          '.OrderProducts-productOutOfStockMessage'
        )
        expect(productOutOfStockMessages).toHaveLength(2)
        expect(productOutOfStockMessages.at(0).text()).toEqual('Out of stock')
        expect(productOutOfStockMessages.at(1).text()).toEqual(
          'Please edit or remove'
        )
      })
      it('does not display out of stock message if inStock is true and product quantity is not greater than stock available', () => {
        const inStock = true
        const { wrapper } = renderComponent({
          products: [{ ...product, inStock }],
        })
        expect(
          wrapper.find('.OrderProducts-productOutOfStockMessage').exists()
        ).toBe(false)
      })
      it('should not display the out of stock message if the user is on the thank you page', () => {
        const { wrapper } = renderComponent({
          pathname: '/order-complete',
          products: [product],
        })
        expect(
          wrapper.find('.OrderProducts-productOutOfStockMessage').exists()
        ).toBe(false)
      })
    })

    describe('Partially out of stock message', () => {
      const product = {
        inStock: true,
        quantity: 10,
        inventoryPositions: {
          invavls: [{ quantity: 2 }],
          inventorys: [{ quantity: 3 }],
        },
      }
      it('displays partially out of stock message if inStock is true and product quantity is greater than  available stock', () => {
        const { wrapper } = renderComponent({
          products: [product],
        })
        const productOutOfStockMessages = wrapper.find(
          '.OrderProducts-productOutOfStockMessage'
        )
        expect(productOutOfStockMessages).toHaveLength(2)
        expect(productOutOfStockMessages.at(0).text()).toEqual(
          'Only 5 available'
        )
        expect(productOutOfStockMessages.at(1).text()).toEqual(
          'Please edit or remove'
        )
      })
      it('does not display partially out of stock message if product quantity is equal to available stock', () => {
        const quantity = 5
        const { wrapper } = renderComponent({
          products: [{ ...product, quantity }],
        })
        expect(
          wrapper.find('.OrderProducts-productOutOfStockMessage').exists()
        ).toBe(false)
      })
      it('does not display partially out of stock message if product quantity is less than available stock', () => {
        const quantity = 1
        const { wrapper } = renderComponent({
          products: [{ ...product, quantity }],
        })
        expect(
          wrapper.find('.OrderProducts-productOutOfStockMessage').exists()
        ).toBe(false)
      })
      it('does not display the partially out of stock message if the user is on the thank you page', () => {
        const { wrapper } = renderComponent({
          pathname: '/order-complete',
          products: [product],
        })
        expect(
          wrapper.find('.OrderProducts-productOutOfStockMessage').exists()
        ).toBe(false)
      })
    })

    describe('Standard Delivery Only', () => {
      const product = {
        inStock: true,
        quantity: 1,
        inventoryPositions: {
          inventorys: [{ quantity: 2 }],
        },
      }
      it('displays SDO message if product quantity is greater than available DC stock', () => {
        const quantity = 5
        const { wrapper } = renderComponent({
          products: [{ ...product, quantity }],
        })
        expect(wrapper.find('OrderProductNotification').length).toBe(1)
      })
      it('does not display SDO message if product quantity is equal to available DC stock', () => {
        const quantity = 2
        const { wrapper } = renderComponent({
          products: [{ ...product, quantity }],
        })
        expect(wrapper.find('OrderProductNotification').exists()).toBe(false)
      })
      it('does not display SDO message if product quantity is less than available DC stock', () => {
        const { wrapper } = renderComponent({
          products: [product],
        })
        expect(wrapper.find('OrderProductNotification').exists()).toBe(false)
      })
    })
  })

  describe('Scroll Bar', () => {
    it('should be activated', () => {
      const props = deepFreeze({
        ...defaultProps,
        scrollable: true,
      })
      expect(renderComponent(props).wrapper.hasClass('is-scrollable')).toBe(
        true
      )
    })
    it('should not be activated when drawer prop is set to true', () => {
      const props = deepFreeze({
        ...defaultProps,
        drawer: true,
      })
      expect(renderComponent(props).wrapper.hasClass('is-scrollable')).toBe(
        false
      )
    })
    it('should not be activated when scrollable prop is set to false', () => {
      const props = deepFreeze({
        ...defaultProps,
        scrollable: false,
      })
      expect(renderComponent(props).wrapper.hasClass('is-scrollable')).toBe(
        false
      )
    })
    it('should not be activated when there are less than 4 products', () => {
      const props = deepFreeze({
        ...defaultProps,
        products: [defaultProps.products[0]],
      })
      expect(renderComponent(props).wrapper.hasClass('is-scrollable')).toBe(
        false
      )
    })
  })

  describe('Order Product', () => {
    describe('Collection Details', () => {
      afterEach(() => {
        jest.restoreAllMocks()
      })

      it('should not render if CFSI Feature is disabled', () => {
        const props = {
          ...defaultProps,
          oosOnly: false,
          isCFSIEnabled: false,
          products: [defaultProps.products[0]],
        }
        const orderProduct = renderComponent(props).wrapper.find(OrderProduct)
        const collectionDetails = orderProduct.find(
          '.OrderProducts-collectionDetails'
        )

        expect(collectionDetails.exists()).toBe(false)
        expect(isCFSIToday).not.toHaveBeenCalled()
      })

      it('should not render if Collect From Store is not selected', () => {
        const props = deepFreeze({
          ...defaultProps,
          oosOnly: false,
          isCFSIEnabled: true,
          selectedDeliveryLocation: 'HOME',
          products: [defaultProps.products[0]],
        })
        const orderProduct = renderComponent(props).wrapper.find(OrderProduct)
        const collectionDetails = orderProduct.find(
          '.OrderProducts-collectionDetails'
        )

        expect(collectionDetails.exists()).toBe(false)
        expect(isCFSIToday).not.toHaveBeenCalled()
      })

      it('should not render for DDP Subscription product', () => {
        const props = {
          ...defaultProps,
          oosOnly: false,
          isCFSIEnabled: true,
          selectedStore: { brandName: 'tsuk' },
          products: [
            {
              ...defaultProps.products[0],
              isDDPProduct: true,
            },
          ],
        }
        const orderProduct = renderComponent(props).wrapper.find(OrderProduct)
        const collectionDetails = orderProduct.find(
          '.OrderProducts-collectionDetails'
        )

        expect(collectionDetails.exists()).toBe(false)
        expect(isCFSIToday).not.toHaveBeenCalled()
      })

      it('should render store availability', () => {
        isCFSIToday.mockReturnValueOnce(true)
        const props = {
          ...defaultProps,
          oosOnly: false,
          isCFSIEnabled: true,
          selectedStore: { brandName: 'Topshop', name: 'Oxford Circus' },
          products: [defaultProps.products[0]],
        }
        const orderProduct = renderComponent(props).wrapper.find(OrderProduct)
        const collectionDetails = orderProduct.find(
          '.OrderProducts-collectionDetails'
        )

        expect(collectionDetails.exists()).toBe(true)
        expect(collectionDetails.text()).toBe(
          'In stock at Topshop Oxford Circus'
        )
        expect(isCFSIToday).toHaveBeenCalled()
      })
    })

    describe('confirmDeleteFromBag', () => {
      beforeEach(() => jest.clearAllMocks())

      it('calls showModal', () => {
        const props = {
          ...defaultProps,
        }
        const { instance } = renderComponent(props)
        instance.confirmDeleteFromBag({ name: 'name' })()
        expect(props.showModal).toHaveBeenCalledTimes(1)
      })
    })

    describe('afterAddToWishlist', () => {
      beforeEach(() => jest.clearAllMocks())

      const orderItemId = '123'
      const bagProduct = { name: 'name', orderItemId }

      it('calls doDeleteFromBag and openMiniBag', async () => {
        const props = {
          ...defaultProps,
          closeModal: jest.fn().mockReturnValue(Promise.resolve()),
          deleteFromBag: jest.fn().mockReturnValue(Promise.resolve()),
        }
        const { instance } = renderComponent(props)

        expect(props.openMiniBag).toHaveBeenCalledTimes(0)
        expect(props.closeModal).toHaveBeenCalledTimes(0)
        expect(props.deleteFromBag).toHaveBeenCalledTimes(0)

        await instance.afterAddToWishlist(bagProduct)()

        expect(props.closeModal).toHaveBeenCalledTimes(0)
        expect(props.openMiniBag).toHaveBeenCalledTimes(1)
        expect(props.deleteFromBag).toHaveBeenCalledTimes(1)
      })
    })

    describe('doDeleteFromBag', () => {
      beforeEach(() => jest.clearAllMocks())

      const orderItemId = '123'
      const bagProduct = { name: 'name', orderItemId }
      const successModalText = 'Success'

      it('callsDeleteFromBag', () => {
        const props = {
          ...defaultProps,
        }
        const { instance } = renderComponent(props)
        const closeConfirmationModal = true
        expect(props.deleteFromBag).toHaveBeenCalledTimes(0)
        expect(props.closeModal).toHaveBeenCalledTimes(0)
        instance.doDeleteFromBag(
          bagProduct,
          closeConfirmationModal,
          successModalText
        )()
        expect(props.deleteFromBag).toHaveBeenCalledTimes(1)
        expect(props.closeModal).toHaveBeenCalledTimes(1)
        expect(props.deleteFromBag.mock.calls[0]).toEqual([
          props.orderId,
          bagProduct,
          successModalText,
        ])
      })
      it('callsDeleteFromBag without closing modal', () => {
        const props = {
          ...defaultProps,
        }
        const { instance } = renderComponent(props)
        const closeConfirmationModal = false
        instance.doDeleteFromBag(
          bagProduct,
          closeConfirmationModal,
          successModalText
        )()
        expect(props.closeModal).toHaveBeenCalledTimes(0)
      })
    })

    describe('Product Subtotal', () => {
      it('should be displayed if the oosOnly prop is set to false', () => {
        const props = deepFreeze({
          ...defaultProps,
          oosOnly: false,
          products: [
            {
              ...defaultProps.products[0],
              totalPrice: 15,
            },
          ],
        })
        const orderProduct = renderComponent(props).wrapper.find(OrderProduct)
        const productSubtotal = orderProduct.find(
          '.OrderProducts-productSubtotal'
        )
        const price = renderComponent(props).wrapper.find(Price)

        expect(productSubtotal.length).toEqual(1)
        expect(price.props().price).toEqual(15)
      })

      it('should not be displayed if the oosOnly prop is set to true', () => {
        const props = deepFreeze({
          ...defaultProps,
          oosOnly: true,
          products: [defaultProps.products[0]],
        })
        const orderProduct = renderComponent(props).wrapper.find(OrderProduct)

        const productSubtotal = orderProduct.find(
          '.OrderProducts-productSubtotal'
        )

        expect(productSubtotal.length).toEqual(0)
      })
    })

    describe('Pass shouldDisplaySocialProofLabel prop down to OrderProduct', () => {
      describe('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE is enabled and we are on minibag', () => {
        it('the passed prop should be true', () => {
          const props = {
            ...defaultProps,
            shouldDisplaySocialProofLabel: true,
          }

          const { wrapper } = renderComponent(props)
          const product = wrapper.find(OrderProduct)

          expect(product.at(0).prop('shouldDisplaySocialProofLabel')).toBe(true)
        })
      })

      describe('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE is disabled or we are not on mininbag', () => {
        it('the passed prop should be false', () => {
          const props = {
            ...defaultProps,
            isFeatureSocialProofMinibagBadgeEnabled: false,
          }

          const { wrapper } = renderComponent(props)
          const product = wrapper.find(OrderProduct)

          expect(product.at(0).prop('shouldDisplaySocialProofLabel')).toBe(
            false
          )
        })
      })
    })

    describe('Order Product Promo', () => {
      it('should be rendered', () => {
        const props = deepFreeze({
          products: [defaultProps.products[0]],
        })
        const orderProductPromo = renderComponent(props).wrapper.find(
          OrderProductPromo
        )

        expect(orderProductPromo.length).toEqual(1)
        expect(orderProductPromo.props().product).toEqual(
          defaultProps.products[0]
        )
      })
    })

    describe('Edit Container', () => {
      describe('Edit Button', () => {
        it('should be displayed', () => {
          const props = deepFreeze({
            ...defaultProps,
            oosOnly: false,
            canModify: true,
            products: [defaultProps.products[0]],
          })
          const editButton = renderComponent(props).wrapper.find(
            '.OrderProducts-editText'
          )

          expect(editButton.length).toEqual(1)
        })

        it('should call sendAnalyticsClickEvent onClick', () => {
          const props = {
            ...defaultProps,
            oosOnly: false,
            canModify: true,
            products: [defaultProps.products[0]],
            sendAnalyticsClickEvent: jest.fn(),
          }
          const { wrapper } = renderComponent(props)
          wrapper
            .find('.OrderProducts-editContainer .OrderProducts-editText')
            .simulate('click')
          expect(props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
            category: GTM_CATEGORY.BAG_DRAWER,
            action: GTM_ACTION.BAG_DRAW_EDIT,
            label: productsMockAsJsonObj[0].productId,
          })
        })

        it('should not be be displayed when oosOnly prop is set to true', () => {
          const props = deepFreeze({
            ...defaultProps,
            oosOnly: true,
            canModify: true,
            products: [defaultProps.products[0]],
          })
          const editButton = renderComponent(props).wrapper.find(
            '.OrderProducts-editText'
          )

          expect(editButton.length).toEqual(0)
        })

        it('should be displayed when isDDPProduct is set to false', () => {
          const props = deepFreeze({
            ...defaultProps,
            canModify: true,
            products: [defaultProps.products[0]],
          })
          const editButton = renderComponent(props).wrapper.find(
            '.OrderProducts-editText'
          )

          expect(editButton.exists()).toBe(true)
        })

        it('should not be be displayed when isDDPProduct is set to true', () => {
          const props = deepFreeze({
            ...defaultProps,
            canModify: true,
            products: [isDDPProductProps.products[0]],
          })
          const editButton = renderComponent(props).wrapper.find(
            '.OrderProducts-editText'
          )

          expect(editButton.exists()).toBe(false)
        })

        it('should not be be displayed when canModify prop is set to false', () => {
          const props = deepFreeze({
            ...defaultProps,
            oosOnly: false,
            canModify: false,
            products: [defaultProps.products[0]],
          })
          const editButton = renderComponent(props).wrapper.find(
            '.OrderProducts-editText'
          )

          expect(editButton.length).toEqual(0)
        })

        it('should not be be displayed when bagProduct.editing is true', () => {
          const props = deepFreeze({
            ...defaultProps,
            oosOnly: false,
            canModify: true,
            products: [
              {
                ...defaultProps.products[0],
                editing: true,
              },
            ],
          })
          const editButton = renderComponent(props).wrapper.find(
            '.OrderProducts-editText'
          )

          expect(editButton.length).toEqual(0)
        })

        it('should edit the product when the edit button is clicked', () => {
          const props = deepFreeze({
            ...defaultProps,
            oosOnly: false,
            canModify: true,
            products: [defaultProps.products[0]],
            sendAnalyticsClickEvent: () => {},
          })

          const { wrapper } = renderComponent(props)
          const editButton = wrapper.find('.OrderProducts-editText')

          editButton.simulate('click')

          expect(props.onUpdateProduct).toHaveBeenCalledWith(0, {
            editing: true,
          })
          expect(props.updateShoppingBagProduct).toHaveBeenCalledWith(0, {
            editing: true,
          })
          expect(props.fetchProductItemSizesAndQuantities).toHaveBeenCalledWith(
            0
          )
        })
      })

      describe('Remove Button', () => {
        it('should be displayed', () => {
          const props = deepFreeze({
            ...defaultProps,
            canModify: true,
            allowEmptyBag: true,
            products: [
              {
                ...defaultProps.products[0],
                isDDPProduct: false,
              },
            ],
          })

          const removeButton = renderComponent(props).wrapper.find(
            '.OrderProducts-deleteText'
          )

          expect(removeButton.length).toEqual(1)
        })

        it('should not be be displayed when canModify prop is set to false', () => {
          const props = deepFreeze({
            ...defaultProps,
            canModify: false,
            allowEmptyBag: true,
            products: [defaultProps.products[0]],
          })
          const removeButton = renderComponent(props).wrapper.find(
            '.OrderProducts-deleteText'
          )

          expect(removeButton.length).toEqual(0)
        })

        it('should not be be displayed when allowEmptyBag is set to false and there are less than 2 products', () => {
          const props = deepFreeze({
            ...defaultProps,
            canModify: true,
            allowEmptyBag: false,
            products: [defaultProps.products[0]],
          })
          const removeButton = renderComponent(props).wrapper.find(
            '.OrderProducts-deleteText'
          )

          expect(removeButton.length).toEqual(0)
        })

        it('should display the modal when the Remove button is clicked', () => {
          const props = deepFreeze({
            ...defaultProps,
            canModify: true,
            allowEmptyBag: true,
            products: [defaultProps.products[0]],
          })
          const removeButton = renderComponent(props).wrapper.find(
            '.OrderProducts-deleteText'
          )

          removeButton.simulate('click')

          expect(props.showModal).toHaveBeenCalled()
        })

        it('should be displayed when isDDPProduct set to true', () => {
          const props = deepFreeze({
            ...defaultProps,
            canModify: true,
            allowEmptyBag: true,
            products: [
              {
                ...defaultProps.products[0],
                isDDPProduct: true,
              },
            ],
          })

          const removeButton = renderComponent(props).wrapper.find(
            '.OrderProducts-deleteText'
          )
          expect(removeButton.exists()).toBe(true)
        })
      })
    })
  })

  describe('The Bag Product is in edit mode', () => {
    it('should display the edit form', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        canModify: true,
        products: [
          {
            ...defaultProps.products[0],
            editing: true,
          },
        ],
      })
      const editForm = renderComponent(props).wrapper.find('Form')

      expect(editForm.length).toEqual(1)
    })

    it('should not display the edit form', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        canModify: true,
        products: [
          {
            ...defaultProps.products[0],
            editing: false,
          },
        ],
      })
      const editForm = renderComponent(props).wrapper.find('form')

      expect(editForm.length).toEqual(0)
    })

    it('should call analyticsShoppingBagClickEvent when the size select changes', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        canModify: true,
        products: [
          {
            ...defaultProps.products[0],
            editing: true,
          },
        ],
      })

      const sizeSelect = renderComponent(props)
        .wrapper.find(Select)
        .at(0)

      sizeSelect.simulate('change', {
        target: {
          value: '6',
          options: { selectedIndex: 1 },
        },
      })

      expect(
        siteInteractions.analyticsShoppingBagClickEvent
      ).toHaveBeenCalledWith({
        ea: 'sizeUpdate',
        el: props.products[0].productId,
      })
    })

    it('should update the size when the size select changes', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        canModify: true,
        products: [
          {
            ...defaultProps.products[0],
            editing: true,
          },
        ],
      })
      const selectOptions = [
        {
          disabled: false,
          label: '4: Low stock',
          value: '4',
        },
        {
          disabled: false,
          label: '6',
          value: '6',
        },
        {
          disabled: true,
          label: '8: Out of stock',
          value: '8',
        },
        {
          disabled: false,
          label: '10: Low stock',
          value: '10',
        },
      ]
      const sizeSelect = renderComponent(props)
        .wrapper.find(Select)
        .at(0)

      expect(sizeSelect.props().options).toEqual(selectOptions)

      sizeSelect.simulate('change', {
        target: {
          value: '6',
          options: { selectedIndex: 1 },
        },
      })

      expect(props.onUpdateProduct).toHaveBeenCalledWith(0, {
        catEntryIdToAdd: 1,
        sizeSelected: '6',
        quantitySelected: '1',
        selectedQuantityWasCorrected: false,
      })

      expect(props.updateShoppingBagProduct).toHaveBeenCalledWith(0, {
        catEntryIdToAdd: 1,
        sizeSelected: '6',
        quantitySelected: '1',
        selectedQuantityWasCorrected: false,
      })

      expect(
        siteInteractions.analyticsShoppingBagClickEvent
      ).toHaveBeenCalledWith({
        ea: 'sizeUpdate',
        el: props.products[0].productId,
      })
    })

    it('should update the quantity when the quantity select changes', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        canModify: true,
        products: [
          {
            ...defaultProps.products[0],
            editing: true,
          },
        ],
      })
      const selectOptions = [{ disabled: false, label: 1, value: 1 }]

      const quantitySelect = renderComponent(props)
        .wrapper.find(Select)
        .at(1)

      expect(quantitySelect.props().options).toEqual(selectOptions)

      quantitySelect.simulate('change', {
        target: {
          value: '1',
          options: { selectedIndex: 0 },
        },
      })

      expect(props.onUpdateProduct).toHaveBeenCalledWith(0, {
        quantitySelected: '1',
        selectedQuantityWasCorrected: false,
      })
      expect(props.updateShoppingBagProduct).toHaveBeenCalledWith(0, {
        quantitySelected: '1',
        selectedQuantityWasCorrected: false,
      })
    })

    describe('When the Save button is clicked', () => {
      let props
      beforeEach(() => {
        props = deepFreeze({
          ...defaultProps,
          oosOnly: false,
          canModify: true,
          products: [
            {
              ...defaultProps.products[0],
              editing: true,
            },
          ],
        })
        const saveButton = renderComponent(props).wrapper.find(
          '.OrderProducts-saveButton'
        )

        expect(saveButton.length).toEqual(1)

        saveButton.props().clickHandler()
      })

      test('it should persist the shopping bag product ', () => {
        expect(props.persistShoppingBagProduct).toHaveBeenCalledWith(0)
      })
    })

    it('should close the edit mode when the Cancel button is clicked', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        canModify: true,
        products: [
          {
            ...defaultProps.products[0],
            editing: true,
          },
        ],
      })
      const cancelButton = renderComponent(props).wrapper.find(
        '.OrderProducts-cancelButton'
      )

      expect(cancelButton.length).toEqual(1)

      cancelButton.props().clickHandler()

      expect(props.onUpdateProduct).toHaveBeenCalledWith(0, { editing: false })
      expect(props.updateShoppingBagProduct).toHaveBeenCalledWith(0, {
        editing: false,
      })
    })

    describe('Auto Quantity Reduction', () => {
      let props
      let renderedComponent
      const setupProps = ({
        quantity,
        quantitySelected,
        selectedQuantityWasCorrected,
      }) => {
        props = deepFreeze({
          ...defaultProps,
          oosOnly: false,
          canModify: true,
          products: [
            {
              ...defaultProps.products[0],
              editing: true,
              quantity,
              quantitySelected,
              selectedQuantityWasCorrected,
            },
          ],
        })
      }

      const setupTest = (extraProductProps) => {
        setupProps(extraProductProps)

        renderedComponent = renderComponent(props)

        const sizeSelect = renderedComponent.wrapper.find(Select).at(0)

        sizeSelect.simulate('change', {
          target: {
            value: '10',
            options: { selectedIndex: 3 },
          },
        })
      }

      describe('If the size has been changed from a high stock size to a low stock size', () => {
        const checkExpectations = ({
          quantitySelected,
          selectedQuantityWasCorrected,
        }) => {
          expect(props.onUpdateProduct).toHaveBeenCalledWith(0, {
            catEntryIdToAdd: 3,
            quantitySelected,
            selectedQuantityWasCorrected,
            sizeSelected: '10',
          })

          expect(props.updateShoppingBagProduct).toHaveBeenCalledWith(0, {
            catEntryIdToAdd: 3,
            quantitySelected,
            selectedQuantityWasCorrected,
            sizeSelected: '10',
          })

          expect(
            siteInteractions.analyticsShoppingBagClickEvent
          ).toHaveBeenCalledWith({
            ea: 'sizeUpdate',
            el: props.products[0].productId,
          })
        }

        test('it should reduce the selected quantity to the max quantity of the new size if the saved quantity of the high stock size is too high for the new size', () => {
          setupTest({ quantity: 10, quantitySelected: undefined })
          checkExpectations({
            quantitySelected: '3',
            selectedQuantityWasCorrected: true,
          })
        })

        test('it should reduce the selected quantity to the max quantity of the new size if the previously selected quantity (either selected automatically or via the quantity drop down) is too high for the new size', () => {
          setupTest({ quantity: 2, quantitySelected: 8 }) // The calculation uses quantitySelected in favour of quantity where possible
          checkExpectations({
            quantitySelected: '3',
            selectedQuantityWasCorrected: true,
          })
        })

        test('it should not change the selected quantity if the saved quantity of the high stock size size is lower or equal to than the max quantity for the new size', () => {
          setupTest({ quantity: 2, quantitySelected: undefined })
          checkExpectations({
            quantitySelected: '2',
            selectedQuantityWasCorrected: false,
          })
        })

        test('it should not change the selected quantity if the previously selected quantity (either selected automatically or via the quantity drop down) is lower or equal to the max quantity for the new size', () => {
          setupTest({ quantity: 6, quantitySelected: 2 })
          checkExpectations({
            quantitySelected: '2',
            selectedQuantityWasCorrected: false,
          })
        })
      })

      describe('Info box', () => {
        beforeEach(() => {
          setupProps({
            quantity: 10,
            quantitySelected: undefined,
            selectedQuantityWasCorrected: true,
          })
          renderedComponent = renderComponent(props)
        })

        test('it should show a warning about the auto reduction if the selected quantity was corrected', () => {
          expect(
            renderedComponent.wrapper.find('.OrderProducts-infoBox').exists()
          ).toBe(true)
        })
        test('it should not show a warning about auto reduction if the selected quantity was not corrected', () => {
          setupProps({
            quantity: 10,
            quantitySelected: undefined,
            selectedQuantityWasCorrected: false,
          })
          renderedComponent = renderComponent(props)
          expect(
            renderedComponent.wrapper.find('.OrderProducts-infoBox').exists()
          ).toBe(false)
        })
      })
    })
  })

  describe('The Component has updated', () => {
    it('should scroll to the reference product', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        isCFSIEnabled: true,
        selectedStore: { brandName: 'tsuk' },
        products: [defaultProps.products[0]],
      })
      const { wrapper, instance } = renderComponent(props)

      instance.products = [
        {
          offsetTop: 10,
          offsetHeight: 20,
        },
      ]

      wrapper.setProps({
        products: [
          {
            ...defaultProps.products[0],
            editing: true,
          },
        ],
      })

      expect(props.scrollOnEdit).toHaveBeenCalled()
    })

    it('should focus the edit form', () => {
      const props = deepFreeze({
        ...defaultProps,
        oosOnly: false,
        canModify: true,
        isCFSIEnabled: true,
        selectedStore: { brandName: 'tsuk' },
        products: [defaultProps.products[0]],
      })
      const { wrapper, instance } = renderComponent(props)

      instance.editSizeQtyFormRef = {
        current: {
          focus: jest.fn(),
        },
      }

      instance.products = [
        {
          offsetTop: 10,
          offsetHeight: 20,
        },
      ]

      wrapper.setProps({
        products: [
          {
            ...defaultProps.products[0],
            editing: true,
          },
        ],
      })

      expect(instance.editSizeQtyFormRef.current.focus).toHaveBeenCalled()
    })
  })
})
