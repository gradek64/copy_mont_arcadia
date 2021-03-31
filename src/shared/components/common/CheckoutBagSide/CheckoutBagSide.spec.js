import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutBagSide from './CheckoutBagSide'
import Espot from '../../containers/Espot/Espot'
import EnhancedMessage from '../../common/EnhancedMessage/EnhancedMessage'
import OrderProducts from '../OrderProducts/OrderProducts'

jest.mock('../../../lib/checkout-utilities/reshaper', () => ({
  selectedDeliveryLocation: jest.fn((deliveryLocations) => ({
    deliveryType: deliveryLocations[0].type,
    label: 'My shipping inf',
    additionalDescription: 'my addi info',
    shipModeId: 12,
  })),
}))

describe('<CheckoutBagSide />', () => {
  const renderComponent = testComponentHelper(
    CheckoutBagSide.WrappedComponent.WrappedComponent
  )
  const basicProps = {
    orderSummary: {
      basket: {
        subTotal: '10.00',
        total: '12.00',
        totalBeforeDiscount: '8.00',
        products: [],
        inventoryPositions: [],
      },
      deliveryLocations: [
        {
          type: 'HOME_DELIVERY',
          deliveryLocationType: 'HOME',
          selected: true,
        },
      ],
      estimatedDelivery: 'Today',
      storeDetails: { details: 'details' },
    },
    yourAddress: {
      fields: [{ value: 'My address1' }, { value: 'My address2' }],
    },
    yourDetails: { fields: [{ value: 'My details' }] },
    subTotal: '10.00',
    totalShoppingBagItems: 1,
    isDDPStandaloneOrder: false,
    pathName: '',
    getTrendingProducts: () => {},
    getSocialProofBanners: () => {},
  }
  describe('@renders', () => {
    it('in initial state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })
    it('in isHomeDelivery state', () => {
      expect(renderComponent(basicProps).getTree()).toMatchSnapshot()
    })
    it('in NOT isHomeDelivery state', () => {
      const newOrderSummary = {
        ...basicProps.orderSummary,
        deliveryLocations: [
          {
            type: 'STORE_EXPRESS',
            deliveryLocationType: 'STORE',
            selected: true,
          },
        ],
      }
      expect(
        renderComponent({
          ...basicProps,
          orderSummary: newOrderSummary,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('in className state', () => {
      expect(
        renderComponent({ ...basicProps, className: 'MyClassName' }).getTree()
      ).toMatchSnapshot()
    })
    it('in isDDPStandaloneOrder state', () => {
      expect(
        renderComponent({
          ...basicProps,
          inCheckout: true,
          canModify: false,
          isDDPStandaloneOrder: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('in orderProducts state', () => {
      expect(
        renderComponent({
          ...basicProps,
          orderProducts: [{ productId: 'myProductId' }],
        }).getTree()
      ).toMatchSnapshot()
    })
    it('in scrollMinibag, inCheckout=true, canModify=false state', () => {
      expect(
        renderComponent({
          ...basicProps,
          scrollMinibag: (scrolled) => scrolled,
          inCheckout: true,
          canModify: false,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('in path="/checkout" state', () => {
      expect(
        renderComponent({ ...basicProps, path: '/checkout' }).getTree()
      ).toMatchSnapshot()
    })
    it('in path="/delivery" state', () => {
      expect(
        renderComponent({ ...basicProps, path: '/delivery' }).getTree()
      ).toMatchSnapshot()
    })
    it('in path="/checkout/delivery" state', () => {
      expect(
        renderComponent({ ...basicProps, path: '/checkout/delivery' }).getTree()
      ).toMatchSnapshot()
    })
    it('in path="/checkout/delivery-payment" state', () => {
      expect(
        renderComponent({
          ...basicProps,
          path: '/checkout/delivery-payment',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('apply the drawer CSS modifier if the prop "drawer" is true', () => {
      expect(
        renderComponent({ ...basicProps, drawer: true }).wrapper.hasClass(
          'CheckoutBagSide--drawer'
        )
      ).toBe(true)
    })
    it('should not allow an empty bag if in checkout', () => {
      const { wrapper } = renderComponent({
        ...basicProps,
        inCheckout: true,
      })
      expect(wrapper.find(OrderProducts).props().allowEmptyBag).toBeFalsy()
    })
    it('should allow an empty bag if not in checkout', () => {
      const { wrapper } = renderComponent({
        ...basicProps,
        inCheckout: false,
      })
      expect(wrapper.find(OrderProducts).props().allowEmptyBag).toBeTruthy()
    })

    describe('when FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE is enabled', () => {
      describe('when not on order complete page', () => {
        it('should pass down shouldDisplaySocialProofLabel true to OrderProducts', () => {
          const { wrapper } = renderComponent({
            ...basicProps,
            orderCompleted: undefined,
            isFeatureSocialProofCheckoutBadgeEnabled: true,
          })
          expect(
            wrapper.find(OrderProducts).prop('shouldDisplaySocialProofLabel')
          ).toBe(true)
        })
      })

      describe('when on order complete page', () => {
        it('should not pass down shouldDisplaySocialProofLabel true to OrderProducts', () => {
          const { wrapper } = renderComponent({
            ...basicProps,
            orderCompleted: { id: '1234' },
            isFeatureSocialProofCheckoutBadgeEnabled: true,
          })
          expect(
            wrapper.find(OrderProducts).prop('shouldDisplaySocialProofLabel')
          ).toBe(false)
        })
      })
    })

    describe('when FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE is disabled', () => {
      it('should pass down shouldDisplaySocialProofLabel false to OrderProducts', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          isFeatureSocialProofCheckoutBadgeEnabled: false,
        })
        expect(
          wrapper.find(OrderProducts).prop('shouldDisplaySocialProofLabel')
        ).toBe(false)
      })
    })

    describe('header', () => {
      it('should not render the totalShoppingBagItems if the value is 0', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          totalShoppingBagItems: 0,
        })
        expect(wrapper.find('h3.CheckoutBagSide-title').text()).not.toMatch(
          `(0)`
        )
      })

      it('should render the totalShoppingBagItems', () => {
        const values = [1, 6, 24]
        values.forEach((totalShoppingBagItems) => {
          const { wrapper } = renderComponent({
            ...basicProps,
            totalShoppingBagItems,
          })
          expect(wrapper.find('h3.CheckoutBagSide-title').text()).toMatch(
            `(${totalShoppingBagItems})`
          )
        })
      })
    })

    describe('bag messages', () => {
      it('renders bag messages container', () => {
        const { wrapper } = renderComponent(basicProps)
        expect(wrapper.find('.CheckoutBagSide-messages')).toHaveLength(1)
      })
      it('renders bag messages from store', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          bagMessages: [
            { message: 'this is a minibag message' },
            { message: 'this is another minibag message' },
          ],
        })
        expect(wrapper.find(EnhancedMessage)).toHaveLength(2)
      })
      it('should not render the merged bag message if it is an user with no order history', () => {
        const props = {
          ...basicProps,
          bagMessages: [
            {
              message:
                'You have items in your shopping bag from a previous visit.',
            },
          ],
          pathName: '/payment',
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(EnhancedMessage).exists()).toBe(false)
      })
      it('should render the merged bag message if it is an user with order history', () => {
        const props = {
          ...basicProps,
          bagMessages: [
            {
              message:
                'You have items in your shopping bag from a previous visit.',
            },
          ],
          pathName: '/delivery-payment',
        }
        const { wrapper } = renderComponent(props)
        const enhancedMessage = wrapper.find(EnhancedMessage)
        expect(enhancedMessage.exists()).toBe(true)
        expect(enhancedMessage.props().message).toEqual(
          'You have items in your shopping bag from a previous visit.'
        )
      })
      it('should render the merged bag message if in delivery page', () => {
        const props = {
          ...basicProps,
          bagMessages: [
            {
              message:
                'You have items in your shopping bag from a previous visit.',
            },
          ],
          pathName: '/delivery',
        }
        const { wrapper } = renderComponent(props)
        const enhancedMessage = wrapper.find(EnhancedMessage)
        expect(enhancedMessage.exists()).toBe(true)
        expect(enhancedMessage.props().message).toEqual(
          'You have items in your shopping bag from a previous visit.'
        )
      })
      it('renders relevant error message if order contains out of stock product', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          orderContainsOutOfStockProduct: true,
        })
        expect(wrapper.find(EnhancedMessage)).toHaveLength(1)
        expect(wrapper.find(EnhancedMessage).prop('isError')).toBe(true)
      })
      it('renders relevant error message if order contains partially out of stock product', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          orderContainsPartiallyOutOfStockProduct: true,
        })
        expect(wrapper.find(EnhancedMessage)).toHaveLength(1)
        expect(wrapper.find(EnhancedMessage).prop('isError')).toBe(true)
      })
      it('renders relevant message if order contains a standard delivery only product', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          orderContainsStandardDeliveryOnlyProduct: true,
        })
        expect(wrapper.find(EnhancedMessage)).toHaveLength(1)
      })
      it('does not render message if order does not contain a standard delivery only product', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          orderContainsStandardDeliveryOnlyProduct: false,
        })
        expect(wrapper.find(EnhancedMessage).exists()).toEqual(false)
      })
      it('does not render message if order contains a standard delivery only product and user has completed order', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          orderContainsStandardDeliveryOnlyProduct: true,
          orderCompleted: { orderCompleted: {} },
        })
        expect(wrapper.find(EnhancedMessage).exists()).toEqual(false)
      })
    })

    describe('espots should', () => {
      it('render when order is completed', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...basicProps,
          orderCompleted: { orderId: '1234' },
        })
        expect(wrapper.find(Espot).map(getTreeFor)).toMatchSnapshot()
      })

      it('not render when order is not completed', () => {
        const { wrapper } = renderComponent({
          ...basicProps,
          orderCompleted: false,
        })
        expect(wrapper.find(Espot).length).toBe(0)
      })
    })

    describe('with orderSummary discounts', () => {
      const newOrderSummary = {
        ...basicProps.orderSummary,
        basket: {
          ...basicProps.orderSummary.basket,
          discounts: [
            {
              label: 'Topshop Card- £5 Welcome offer',
              value: '5.00',
            },
          ],
        },
      }

      it('should render discounts with showDiscounts prop', () => {
        const component = renderComponent({
          ...basicProps,
          orderSummary: newOrderSummary,
          showDiscounts: true,
          discountInfo: [
            {
              label: 'Topshop Card- £5 Welcome offer',
              value: '5.00',
            },
          ],
        })

        expect(
          component.wrapper.find('SimpleTotals').prop('discounts').length
        ).toBe(1)
        expect(component.getTree()).toMatchSnapshot()
      })

      it('should not render discounts without showDiscounts prop', () => {
        const component = renderComponent({
          ...basicProps,
          orderSummary: newOrderSummary,
        })

        expect(
          component.wrapper.find('SimpleTotals').prop('discounts').length
        ).toBe(0)
        expect(component.getTree()).toMatchSnapshot()
      })
    })
  })

  describe('@lifecyle', () => {
    describe('componentDidMount', () => {
      describe('getTrendingProducts', () => {
        describe('when not on order complete page', () => {
          const props = { ...basicProps, orderCompleted: undefined }

          it('should fetch the trending products if FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE enabled and is not order complete page', () => {
            const getTrendingProductsMock = jest.fn()
            const { instance } = renderComponent({
              ...props,
              isFeatureSocialProofCheckoutBadgeEnabled: true,
              getTrendingProducts: getTrendingProductsMock,
            })
            expect(getTrendingProductsMock).not.toHaveBeenCalled()
            instance.componentDidMount()
            expect(getTrendingProductsMock).toHaveBeenCalledWith('checkout')
          })

          it('should not fetch the trending products if FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE disabled', () => {
            const getTrendingProductsMock = jest.fn()
            const { instance } = renderComponent({
              ...props,
              isFeatureSocialProofCheckoutBadgeEnabled: false,
              getTrendingProducts: getTrendingProductsMock,
            })
            instance.componentDidMount()
            expect(getTrendingProductsMock).not.toHaveBeenCalled()
          })
        })

        describe('when on order complete page', () => {
          it('should not fetch trending products even if FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE enabled', () => {
            const getTrendingProductsMock = jest.fn()
            const { instance } = renderComponent({
              ...basicProps,
              orderCompleted: { orderId: '1234' },
              isFeatureSocialProofCheckoutBadgeEnabled: true,
              getTrendingProducts: getTrendingProductsMock,
            })
            instance.componentDidMount()
            expect(getTrendingProductsMock).not.toHaveBeenCalled()
          })
        })
      })

      describe('getSocialProofBanners', () => {
        describe('when not on order complete page', () => {
          const props = { ...basicProps, orderCompleted: undefined }

          it('should fetch the banners if FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE enabled and is not order complete page', () => {
            const getSocialProofBannersMock = jest.fn()
            const { instance } = renderComponent({
              ...props,
              isFeatureSocialProofCheckoutBadgeEnabled: true,
              getSocialProofBanners: getSocialProofBannersMock,
            })
            expect(getSocialProofBannersMock).not.toHaveBeenCalled()
            instance.componentDidMount()
            expect(getSocialProofBannersMock).toHaveBeenCalledWith()
          })

          it('should not fetch the trending products if FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE disabled', () => {
            const getSocialProofBannersMock = jest.fn()
            const { instance } = renderComponent({
              ...props,
              isFeatureSocialProofCheckoutBadgeEnabled: false,
              getTrendingProducts: getSocialProofBannersMock,
            })
            instance.componentDidMount()
            expect(getSocialProofBannersMock).not.toHaveBeenCalled()
          })
        })

        describe('when on order complete page', () => {
          it('should not fetch the banners even if FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE enabled', () => {
            const getSocialProofBannersMock = jest.fn()
            const { instance } = renderComponent({
              ...basicProps,
              orderCompleted: { orderId: '1234' },
              isFeatureSocialProofCheckoutBadgeEnabled: true,
              getSocialProofBanners: getSocialProofBannersMock,
            })
            instance.componentDidMount()
            expect(getSocialProofBannersMock).not.toHaveBeenCalled()
          })
        })
      })
    })
  })
})
