import testComponentHelper from 'test/unit/helpers/test-component'
import generateMockFormProps from 'test/unit/helpers/form-props-helper'
import {
  initialMiniBagProps as initialProps,
  initialMiniBagFormProps as initialFormProps,
} from './miniBagMocks'
import {
  GTM_CATEGORY,
  GTM_ACTION,
} from '../../../../analytics/analytics-constants'

import { browserHistory } from 'react-router'
import QubitReact from 'qubit-react/wrapper'
import MiniBag from '../MiniBag'
import EnhancedMessage from '../../../common/EnhancedMessage/EnhancedMessage'
import FreeShippingMessage from '../../../common/FreeShippingMessage/FreeShippingMessage'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

jest.mock('../../../../selectors/shoppingBagSelectors', () => ({
  calculateBagDiscount: jest.fn(),
  getShoppingBagSubTotal: jest.fn(),
  getShoppingBag: jest.fn(),
}))

describe('<MiniBag />', () => {
  const renderComponent = testComponentHelper(MiniBag.WrappedComponent)
  const generateProps = (newFormProps) => ({
    ...initialProps,
    ...generateMockFormProps(initialFormProps, newFormProps),
  })

  describe('@renders', () => {
    describe('in default state', () => {
      it('should display an empty bag', () => {
        expect(
          renderComponent({
            bagProducts: [],
            isLockImageEnabled: false,
            sendAnalyticsClickEvent: () => {},
            getTrendingProducts: () => {},
            getSocialProofBanners: () => {},
          }).getTree()
        ).toMatchSnapshot()
      })

      it('should display products added to basket', () => {
        expect(renderComponent(generateProps()).getTree()).toMatchSnapshot()
      })

      it('should display number of products in header', () => {
        const { wrapper } = renderComponent(generateProps())
        expect(wrapper.find('.MiniBag-header').text()).toMatch('My Bag (1)')
      })

      it('when CFSi is true and not in checkout', () => {
        expect(
          renderComponent({
            ...generateProps(),
            inCheckout: false,
            CFSi: true,
          }).getTree()
        ).toMatchSnapshot()
      })
    })

    describe('bag messaging', () => {
      it('displays bag messages from store', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          bagMessages: [
            { id: '123', message: 'this is a minibag message' },
            { id: '456', message: 'this is another minibag message' },
          ],
        })
        expect(wrapper.find('.MiniBag-messages')).toHaveLength(1)
        expect(wrapper.find(EnhancedMessage)).toHaveLength(2)
      })

      it('renders disabled checkout button with error message if a bag product is out of stock', () => {
        const { wrapper } = renderComponent({
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          bagTotal: '26.00',
          bagContainsOutOfStockProduct: true,
          isLockImageEnabled: false,
          sendAnalyticsClickEvent: () => {},
          getTrendingProducts: () => {},
          getSocialProofBanners: () => {},
        })
        expect(wrapper.find(EnhancedMessage)).toHaveLength(2)
        expect(
          wrapper
            .find(EnhancedMessage)
            .at(0)
            .prop('isError')
        ).toBe(true)
        expect(
          wrapper
            .find(EnhancedMessage)
            .at(1)
            .prop('isError')
        ).toBe(true)
        expect(wrapper.find('.MiniBag-continueButton')).toHaveLength(2)
        expect(
          wrapper
            .find('.MiniBag-continueButton')
            .at(0)
            .prop('isDisabled')
        ).toBe(true)
        expect(
          wrapper
            .find('.MiniBag-continueButton')
            .at(1)
            .prop('isDisabled')
        ).toBe(true)
      })

      it('renders disabled checkout button with error message if a bag product is partially out of stock', () => {
        const { wrapper } = renderComponent({
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          bagTotal: '26.00',
          bagContainsPartiallyOutOfStockProduct: true,
          isLockImageEnabled: false,
          sendAnalyticsClickEvent: () => {},
          getTrendingProducts: () => {},
          getSocialProofBanners: () => {},
        })
        expect(wrapper.find(EnhancedMessage)).toHaveLength(2)
        expect(
          wrapper
            .find(EnhancedMessage)
            .at(0)
            .prop('isError')
        ).toBe(true)
        expect(
          wrapper
            .find(EnhancedMessage)
            .at(1)
            .prop('isError')
        ).toBe(true)
        expect(
          wrapper
            .find('.MiniBag-continueButton')
            .at(0)
            .prop('isDisabled')
        ).toBe(true)
        expect(
          wrapper
            .find('.MiniBag-continueButton')
            .at(1)
            .prop('isDisabled')
        ).toBe(true)
      })

      it('renders relevant message if bag contains a standard delivery only product', () => {
        const { wrapper } = renderComponent({
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          bagTotal: '26.00',
          bagContainsStandardDeliveryOnlyProduct: true,
          isLockImageEnabled: false,
          sendAnalyticsClickEvent: () => {},
          getTrendingProducts: () => {},
          getSocialProofBanners: () => {},
        })
        expect(wrapper.find(EnhancedMessage)).toHaveLength(1)
      })

      it('does not display message if bag does not contain a standard delivery only product', () => {
        const { wrapper } = renderComponent({
          bagMessages: [],
          bagProducts: [{ productId: '1234' }],
          bagTotal: '26.00',
          bagContainsStandardDeliveryOnlyProduct: false,
          isLockImageEnabled: false,
          sendAnalyticsClickEvent: () => {},
          getTrendingProducts: () => {},
          getSocialProofBanners: () => {},
        })
        expect(wrapper.find(EnhancedMessage).exists()).toEqual(false)
      })

      it('should render <FreeShippingMessage>', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeatureThresholdMessageEnabled: true,
          isDDPActiveUserPreRenewWindow: false,
          bagContainsDDPProduct: false,
        })

        const FreeShippingNode = wrapper.find(FreeShippingMessage)
        expect(FreeShippingNode.exists()).toBeTruthy()
      })

      it('should not render <FreeShippingMessage> if the user has an active DDP subscription', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeatureThresholdMessageEnabled: true,
          isDDPActiveUserPreRenewWindow: true,
          bagContainsDDPProduct: false,
        })

        const FreeShippingNode = wrapper.find(FreeShippingMessage)
        expect(FreeShippingNode.exists()).toBeFalsy()
      })

      it('should not render <FreeShippingMessage> if the user has a DDP product in the shopping bag', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeatureThresholdMessageEnabled: true,
          isDDPActiveUserPreRenewWindow: false,
          bagContainsDDPProduct: true,
        })

        const FreeShippingNode = wrapper.find(FreeShippingMessage)
        expect(FreeShippingNode.exists()).toBeFalsy()
      })
    })

    describe('in other states', () => {
      it('should display discounts when available', () => {
        expect(
          renderComponent({
            ...generateProps(),
            bagDiscount: 2,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('should render <Loader /> while loading products', () => {
        expect(
          renderComponent({
            ...generateProps(),
            loadingShoppingBag: true,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('should display PromotionCode if not in checkout', () => {
        expect(
          renderComponent({
            ...generateProps(),
            inCheckout: false,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('should not display PromotionCode if in checkout', () => {
        expect(
          renderComponent({
            ...generateProps(),
            inCheckout: true,
          }).getTree()
        ).toMatchSnapshot()
      })

      describe('in Checkout', () => {
        it('should not render <ShoppingBagDeliveryOptions />', () => {
          expect(
            renderComponent({
              ...generateProps(),
              inCheckout: true,
            }).getTree()
          ).toMatchSnapshot()
        })

        it('should render Delivery estimate in Payment page for New Checkout Workflow', () => {
          expect(
            renderComponent({
              ...generateProps(initialFormProps),
              inCheckout: true,
              pathname: '/checkout/payment',
            }).getTree()
          ).toMatchSnapshot()
        })

        describe('when Feature flag FEATURE_CHECKOUT_BUTTON_LOCK is enabled', () => {
          it('should add Minibag-lock className to span', () => {
            const { wrapper } = renderComponent({
              ...generateProps(),
              isCheckout: true,
              isLockImageEnabled: true,
            })

            expect(wrapper.find('span.MiniBag-lock').exists()).toBe(true)
          })
        })

        describe('when Feature flag FEATURE_CHECKOUT_BUTTON_LOCK is disabled', () => {
          it('should not add Minibag-lock className to span', () => {
            const { wrapper } = renderComponent({
              ...generateProps(),
              isCheckout: true,
              isLockImageEnabled: false,
            })

            expect(wrapper.find('span.MiniBag-lock').exists()).toBe(false)
          })
        })
      })
    })

    describe('DDP only product', () => {
      it('should not display the Delivery details if the bag contains only DDP product and it is not checkout', () => {
        expect(
          renderComponent({
            ...generateProps(),
            bagContainsOnlyDDPProduct: true,
            inCheckout: false,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('should display the Delivery details if the bag does not contains only DDP product and it is not checkout', () => {
        expect(
          renderComponent({
            ...generateProps(),
            bagContainsOnlyDDPProduct: false,
            inCheckout: false,
          }).getTree()
        ).toMatchSnapshot()
      })
    })
    describe('@qubit', () => {
      const { wrapper } = renderComponent(initialProps)
      const qubitWrapper = wrapper.find(QubitReact)
      it('should render eight qubit react wrappers', () => {
        expect(qubitWrapper.length).toBe(8)
      })
      it('should render a qubit react wrapper for header with correct id', () => {
        expect(qubitWrapper.at(0).props().id).toBe('qubit-MiniBag-header')
      })
      it('should render a qubit react wrapper for minibag-promo with correct id', () => {
        expect(qubitWrapper.at(1).props().id).toBe('qubit-minibag-promo')
      })
      it('should render a qubit react wrapper for minibag-delivery with correct id', () => {
        expect(qubitWrapper.at(2).props().id).toBe('qubit-minibag-delivery')
      })
      it('should render a qubit react wrapper for minibag-summary with correct id', () => {
        expect(qubitWrapper.at(3).props().id).toBe('qubit-mini-bag-summary')
      })
      it('should render a qubit react wrapper for minibag-labels with correct id', () => {
        expect(qubitWrapper.at(4).props().id).toBe('qubit-minibag-labels')
      })
      it('should render a qubit react wrapper for minibag-total-wording with correct id', () => {
        expect(qubitWrapper.at(5).props().id).toBe(
          'qubit-minibag-total-wording'
        )
      })
      it('should render a qubit react wrapper for minibag total-price with correct id', () => {
        expect(qubitWrapper.at(6).props().id).toBe('qubit-minibag-total-price')
      })
      it('should render a qubit react wrapper for minibag bottom-espot with correct id', () => {
        expect(qubitWrapper.at(7).props().id).toBe('qubit-minibag-bottom-espot')
      })
    })
  })

  describe('@events', () => {
    const autoCloseDelayLength = 3000

    beforeEach(() => {
      jest.resetAllMocks()
      jest.useFakeTimers()
    })

    describe('on close button click', () => {
      it('should close the minibag', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
        wrapper.find('.MiniBag-closeButton').simulate('click')
        expect(initialProps.closeMiniBag).toHaveBeenCalled()
      })

      it('should fire a GTM click event', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
        wrapper.find('.MiniBag-closeButton').simulate('click')
        expect(initialProps.sendAnalyticsClickEvent).toHaveBeenCalled()
        expect(initialProps.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.SHOPPING_BAG,
          action: GTM_ACTION.CLICKED,
          label: 'close-button',
        })
      })
    })

    describe('On "Continue shopping" button click', () => {
      it('should close mini bag', () => {
        const closeMiniBagMock = jest.fn()
        const { wrapper } = renderComponent({
          bagProducts: [],
          closeMiniBag: closeMiniBagMock,
          isLockImageEnabled: false,
          sendAnalyticsClickEvent: () => {},
          getTrendingProducts: () => {},
          getSocialProofBanners: () => {},
        })
        expect(closeMiniBagMock).toHaveBeenCalledTimes(0)
        wrapper
          .find('.Button--primary')
          .props()
          .clickHandler()
        expect(closeMiniBagMock).toHaveBeenCalledTimes(1)
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(setInterval).not.toHaveBeenCalled()
      })
    })

    describe('On "Checkout Now" button click', () => {
      it('should redirect to checkout and close mini bag', () => {
        const generatedProps = generateProps()
        const { wrapper } = renderComponent(generatedProps)
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
        expect(generatedProps.closeMiniBag).toHaveBeenCalledTimes(0)
        expect(generatedProps.sendAnalyticsClickEvent).toHaveBeenCalledTimes(0)
        wrapper
          .find('.MiniBag-continueButton')
          .first()
          .props()
          .clickHandler()
        expect(browserHistory.push).toHaveBeenCalledWith('/checkout')
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(generatedProps.closeMiniBag).toHaveBeenCalledTimes(1)
        expect(generatedProps.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
        expect(generatedProps.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.SHOPPING_BAG,
          action: GTM_ACTION.CLICKED,
          label: 'checkout-button',
        })

        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(setInterval).not.toHaveBeenCalled()
      })
    })

    describe('On "Back to checkout" button click', () => {
      it('should close mini bag', () => {
        const { wrapper } = renderComponent({
          ...generateProps(initialFormProps),
          inCheckout: true,
        })
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(0)
        wrapper
          .find('.MiniBag-backToCheckout')
          .props()
          .clickHandler()
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(1)
      })
    })

    describe('Trending products', () => {
      let getTrendingProductsMock
      let getSocialProofBannersMock
      beforeEach(() => {
        getTrendingProductsMock = jest.fn()
        getSocialProofBannersMock = jest.fn()
      })

      describe('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE is enabled and minibag is closed and you open it', () => {
        it('should get trending products from tally and banners from CMS', () => {
          const { wrapper } = renderComponent({
            ...generateProps(initialFormProps),
            isFeatureSocialProofMinibagBadgeEnabled: true,
            miniBagOpen: false,
            getTrendingProducts: getTrendingProductsMock,
            getSocialProofBanners: getSocialProofBannersMock,
          })

          wrapper.setProps({ miniBagOpen: true })

          expect(getTrendingProductsMock).toHaveBeenCalledTimes(1)
          expect(getSocialProofBannersMock).toHaveBeenCalledTimes(1)
        })
      })

      describe('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE is enabled and minibag is closed', () => {
        it('should not get trending products from tally and banners from CMS', () => {
          renderComponent({
            ...generateProps(initialFormProps),
            isFeatureSocialProofMinibagBadgeEnabled: true,
            miniBagOpen: false,
            getTrendingProducts: getTrendingProductsMock,
            getSocialProofBanners: getSocialProofBannersMock,
          })

          expect(getTrendingProductsMock).toHaveBeenCalledTimes(0)
          expect(getSocialProofBannersMock).toHaveBeenCalledTimes(0)
        })
      })

      describe('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE is disabled', () => {
        it('should not get trending products from tally and banners from CMS', () => {
          const { wrapper } = renderComponent({
            ...generateProps(initialFormProps),
            isFeatureSocialProofMinibagBadgeEnabled: false,
            miniBagOpen: false,
            getTrendingProducts: getTrendingProductsMock,
            getSocialProofBanners: getSocialProofBannersMock,
          })

          wrapper.setProps({ miniBagOpen: true })

          expect(getTrendingProductsMock).not.toHaveBeenCalled()
          expect(getSocialProofBannersMock).not.toHaveBeenCalled()
        })
      })

      describe('FEATURE_SOCIAL_PROOF_MINIBAG_BADGE is enabled and no products are presents', () => {
        it('should not get trending products from tally and banners from CMS', () => {
          const { wrapper } = renderComponent({
            ...generateProps(initialFormProps),
            isFeatureSocialProofMinibagBadgeEnabled: true,
            miniBagOpen: false,
            getTrendingProducts: getTrendingProductsMock,
            getSocialProofBanners: getSocialProofBannersMock,
            bagProducts: [],
          })

          wrapper.setProps({ miniBagOpen: true })

          expect(getTrendingProductsMock).not.toHaveBeenCalled()
          expect(getSocialProofBannersMock).not.toHaveBeenCalled()
        })
      })
    })

    describe('auto close mini bag', () => {
      it('should not close automatically if autoClose prop is false', () => {
        const { wrapper } = renderComponent({
          ...generateProps(initialFormProps),
          miniBagOpen: false,
        })
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(0)
        expect(setInterval).not.toHaveBeenCalled()
        wrapper.setProps({ miniBagOpen: true })
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(setInterval).not.toHaveBeenCalled()
      })

      it('should close after 3 seconds when not interacted with', () => {
        const { wrapper } = renderComponent({
          ...generateProps(initialFormProps),
          miniBagOpen: false,
          autoClose: true,
        })
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(0)
        expect(setInterval).not.toHaveBeenCalled()
        wrapper.setProps({ miniBagOpen: true })
        expect(setInterval).toHaveBeenCalledWith(
          expect.any(Function),
          autoCloseDelayLength
        )
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(1)
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(setInterval).toHaveBeenCalledTimes(1)
      })

      it('should not close automatically when is just being hovered', () => {
        const { wrapper } = renderComponent({
          ...generateProps(initialFormProps),
          miniBagOpen: false,
          autoClose: true,
        })
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(0)
        expect(setInterval).not.toHaveBeenCalled()
        wrapper.setProps({ miniBagOpen: true })
        expect(setInterval).toHaveBeenCalledWith(
          expect.any(Function),
          autoCloseDelayLength
        )
        wrapper.prop('onMouseEnter')()
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
      })

      it('should close automatically on mouse out when has just been hovered', () => {
        const { wrapper } = renderComponent({
          ...generateProps(initialFormProps),
          miniBagOpen: false,
          autoClose: true,
        })
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(0)
        expect(setInterval).not.toHaveBeenCalled()
        wrapper.setProps({ miniBagOpen: true })
        expect(setInterval).toHaveBeenCalledWith(
          expect.any(Function),
          autoCloseDelayLength
        )
        expect(setInterval).toHaveBeenCalledTimes(1)
        wrapper.prop('onMouseEnter')()
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
        wrapper.prop('onMouseLeave')()
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(1)
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(1)
      })

      it('should not close automatically if it was clicked', () => {
        const { wrapper } = renderComponent({
          ...generateProps(initialFormProps),
          miniBagOpen: false,
          autoClose: true,
        })
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(0)
        expect(setInterval).not.toHaveBeenCalled()
        wrapper.setProps({ miniBagOpen: true })
        expect(setInterval).toHaveBeenCalledWith(
          expect.any(Function),
          autoCloseDelayLength
        )
        wrapper.prop('onClick')()
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
      })

      it('should not close automatically if it was touched', () => {
        const { wrapper } = renderComponent({
          ...generateProps(initialFormProps),
          miniBagOpen: false,
          autoClose: true,
        })
        expect(initialProps.closeMiniBag).toHaveBeenCalledTimes(0)
        expect(setInterval).not.toHaveBeenCalled()
        wrapper.setProps({ miniBagOpen: true })
        expect(setInterval).toHaveBeenCalledWith(
          expect.any(Function),
          autoCloseDelayLength
        )
        wrapper.prop('onTouchStart')()
        jest.advanceTimersByTime(autoCloseDelayLength)
        expect(initialProps.closeMiniBag).not.toHaveBeenCalled()
      })
    })
  })

  describe('@methods', () => {
    describe('scrollMinibag(pos)', () => {
      it('should modify scrollTop property', () => {
        const { instance } = renderComponent(generateProps())
        instance.miniContent = {
          offsetHeight: 1200,
          scrollTop: 0,
        }

        instance.scrollMinibag(100)
        expect(instance.miniContent.scrollTop).toBe(-1100)
      })
    })
  })
})
