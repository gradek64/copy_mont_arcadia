import testComponentHelper from 'test/unit/helpers/test-component'
import StoreDelivery from '../StoreDelivery'
import {
  GTM_ACTION,
  GTM_CATEGORY,
} from '../../../../../analytics/analytics-constants'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

import { browserHistory } from 'react-router'

describe('<StoreDelivery />', () => {
  jest.useFakeTimers()

  const renderComponent = testComponentHelper(StoreDelivery.WrappedComponent)
  const initialProps = {
    config: {
      country: 'United Kingdom',
    },
    yourDetails: {
      fields: {
        title: {
          value: 'Mr',
        },
        firstName: {
          value: 'John',
        },
        lastName: {
          value: 'Smith',
        },
        telephone: {
          value: '07123123123',
        },
      },
    },
    orderSummary: {
      deliveryStoreCode: 'TS0001',
      storeDetails: {
        address1: '214 Oxford Street',
        address2: 'Oxford Circus',
        city: 'West End',
        country: 'United Kingdom',
        postcode: 'W1W 8LG',
      },
    },
    useDeliveryAsBilling: true,
    isOutOfStock: false,
    sendAnalyticsClickEvent: jest.fn(),
    setDeliveryAsBillingFlag: jest.fn(),
    clearOrderError: jest.fn(),
    setDeliveryAsBilling: jest.fn(),
  }

  const initialPropsWithoutStore = {
    config: {
      country: 'United Kingdom',
    },
    yourDetails: {
      fields: {
        title: {
          value: 'Mr',
        },
        firstName: {
          value: 'John',
        },
        lastName: {
          value: 'Smith',
        },
        telephone: {
          value: '07123123123',
        },
      },
    },
    orderSummary: {},
  }

  describe('@renders', () => {
    it('UserLocatorInput - isMobile = true, storeUpdating = true', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: true,
          storeUpdating: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('UserLocatorInput - isMobile = true, no storeDetails', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: true,
          orderSummary: {},
        }).getTree()
      ).toMatchSnapshot()
    })

    it('isMobile = true and with storeDetails', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('isMobile = true and deliveryStoreCode starts with "S"', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: true,
          orderSummary: {
            ...initialProps.orderSummary,
            deliveryStoreCode: 'S11111',
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('isMobile = false and with storeDetails', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('isMobile = false and no storeDetails', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderSummary: {},
        }).getTree()
      ).toMatchSnapshot()
    })

    it('hides the titles of its children components when "titlesHidden" = true ', () => {
      expect(
        renderComponent({ ...initialProps, titlesHidden: true }).getTree()
      ).toMatchSnapshot()
    })

    it('hides the next button when "nextButtonHidden" = true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        nextButtonHidden: true,
      })
      expect(wrapper.find('DeliveryContainer-nextButton').length).toEqual(0)
    })

    it('shows CHANGE with CFS and selected store', () => {
      const props = {
        ...initialProps,
      }
      const { wrapper } = renderComponent({ ...props, nextButtonHidden: true })
      expect(
        wrapper
          .find('.StoreDeliveryV2-changeStoreCTA')
          .childAt(0)
          .text()
      ).toEqual('CHANGE')
    })

    it('shows Choose Store with CFS and no selected store', () => {
      const props = {
        ...initialPropsWithoutStore,
        isMobile: false,
      }
      const { wrapper } = renderComponent({ ...props, nextButtonHidden: true })
      expect(
        wrapper
          .find('.StoreDeliveryV2-selectStoreCTA')
          .childAt(0)
          .text()
      ).toEqual('Select store')
    })

    it('shows Choose Shop with CFP and no selected store', () => {
      const orderSummaryCFS = {
        ...initialPropsWithoutStore.orderSummary,
        deliveryStoreCode: 'SSSSS',
      }
      const props = {
        ...initialPropsWithoutStore,
        orderSummary: orderSummaryCFS,
        isMobile: false,
      }
      const { wrapper } = renderComponent({ ...props, nextButtonHidden: true })
      expect(
        wrapper
          .find('.StoreDeliveryV2-selectStoreCTA')
          .childAt(0)
          .text()
      ).toEqual('Select shop')
    })

    it('shows Change Shop with CFP and selected store', () => {
      const orderSummaryCFS = {
        ...initialProps.orderSummary,
        deliveryStoreCode: 'SSSSS',
      }
      const props = {
        ...initialProps,
        orderSummary: orderSummaryCFS,
        isMobile: false,
      }
      const { wrapper } = renderComponent({ ...props, nextButtonHidden: true })
      expect(
        wrapper
          .find('.StoreDeliveryV2-changeStoreCTA')
          .childAt(0)
          .text()
      ).toEqual('CHANGE')
    })

    describe('Button isActive', () => {
      it('should not be active if store not selected', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          storeUpdating: true,
        })
        expect(wrapper.find('DeliveryCTAProceed').prop('isActive')).toBe(false)
      })
      it('should not be active if error in yourDetails', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          yourDetails: {
            fields: {
              title: {
                value: 'Mr',
              },
              firstName: {
                value: '',
              },
              lastName: {
                value: '',
              },
              telephone: {
                value: '',
              },
            },
          },
        })
        expect(wrapper.find('DeliveryCTAProceed').prop('isActive')).toBe(false)
      })
      it('should be active if no error', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find('DeliveryCTAProceed').prop('isActive')).toBe(true)
      })
    })

    describe('Button isDisabled', () => {
      it('should not be disabled if Out of Stock is false', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find('DeliveryCTAProceed').prop('isDisabled')).toBe(
          false
        )
      })
      it('should be disabled if Out of Stock is true', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isOutOfStock: true,
        })
        expect(wrapper.find('DeliveryCTAProceed').prop('isDisabled')).toBe(true)
      })
    })

    it('should render the guest email form if in guest checkout', () => {
      expect(
        renderComponent({
          ...initialProps,
          guestUserForm: {
            fields: {
              email: {
                value: '',
              },
            },
          },
          isGuestOrder: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      const { instance } = renderComponent(initialProps)
      instance.componentDidMount()
      expect(global.window.onpopstate).toBe(instance.onBackButtonEvent)
    })

    describe('UNSAFE_componentWillUpdate', () => {
      it('calls setStoreUpdating with false if isMobile changes', () => {
        const setStoreUpdating = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          setStoreUpdating,
          storeUpdating: true,
        })
        expect(instance.props.setStoreUpdating).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillUpdate({ ...initialProps, isMobile: true })
        expect(instance.props.setStoreUpdating).toHaveBeenCalledTimes(1)
        expect(instance.props.setStoreUpdating).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('UserLocatorInput form submit', () => {
      it('calls searchStoresCheckout and preventDefault on submit', () => {
        const searchStoresCheckout = jest.fn()
        const event = {
          preventDefault: jest.fn(),
        }
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          isMobile: true,
          storeUpdating: true,
          searchStoresCheckout,
        })

        expect(instance.props.searchStoresCheckout).not.toHaveBeenCalled()
        expect(event.preventDefault).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.searchStoresCheckout).toHaveBeenCalledTimes(1)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })
    })

    describe('next button', () => {
      it('redirects to payment if no errors', () => {
        const setDeliveryAsBillingFlag = jest.fn()
        const setDeliveryAsBilling = jest.fn()
        const sendAnalyticsClickEvent = jest.fn()
        const sendAnalyticsErrorMessage = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          isMobile: true,
          setDeliveryAsBillingFlag,
          setDeliveryAsBilling,
          sendAnalyticsClickEvent,
          sendAnalyticsErrorMessage,
        })

        expect(browserHistory.push).not.toHaveBeenCalled()
        wrapper
          .find('DeliveryCTAProceed')
          .first()
          .props()
          .nextHandler()
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenLastCalledWith(
          '/checkout/payment'
        )
        expect(setDeliveryAsBillingFlag).toHaveBeenCalledTimes(1)
        expect(setDeliveryAsBillingFlag).toHaveBeenLastCalledWith(true)
        expect(setDeliveryAsBilling).toHaveBeenCalledTimes(1)
        expect(setDeliveryAsBilling).toHaveBeenLastCalledWith(true)
        expect(sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
        expect(sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.CHECKOUT,
          action: GTM_ACTION.CLICKED,

          label: window.location.href,
          value: '',
        })
        expect(sendAnalyticsErrorMessage).not.toHaveBeenCalled()
      })

      it('redirects to guest checkout payment if no errors', () => {
        const setDeliveryAsBillingFlag = jest.fn()
        const setDeliveryAsBilling = jest.fn()
        const sendAnalyticsClickEvent = jest.fn()
        const sendAnalyticsErrorMessage = jest.fn()
        const touchedMultipleFormFields = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          isMobile: true,
          setDeliveryAsBillingFlag,
          setDeliveryAsBilling,
          sendAnalyticsClickEvent,
          sendAnalyticsErrorMessage,
          touchedMultipleFormFields,
          isGuestOrder: true,
          guestUserForm: {
            fields: {
              email: {
                value: 'email@mail.com',
              },
            },
          },
        })

        expect(browserHistory.push).not.toHaveBeenCalled()
        wrapper
          .find('DeliveryCTAProceed')
          .first()
          .props()
          .nextHandler()
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenLastCalledWith(
          '/guest/checkout/payment'
        )
        expect(setDeliveryAsBillingFlag).toHaveBeenCalledTimes(1)
        expect(setDeliveryAsBillingFlag).toHaveBeenLastCalledWith(true)
        expect(setDeliveryAsBilling).toHaveBeenCalledTimes(1)
        expect(setDeliveryAsBilling).toHaveBeenLastCalledWith(true)
      })

      it('calls scrollToFirstError and touchedMultipleFormFields with errors', () => {
        const touchedMultipleFormFields = jest.fn()
        const sendAnalyticsErrorMessage = jest.fn()
        const sendAnalyticsClickEvent = jest.fn()
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          isMobile: true,
          touchedMultipleFormFields,
          yourDetails: {
            fields: {},
          },
          sendAnalyticsErrorMessage,
          sendAnalyticsClickEvent,
        })
        instance.scrollToFirstError = jest.fn()

        expect(instance.scrollToFirstError).not.toHaveBeenCalled()
        expect(instance.props.touchedMultipleFormFields).not.toHaveBeenCalled()
        wrapper
          .find('DeliveryCTAProceed')
          .first()
          .props()
          .nextHandler()
        expect(instance.scrollToFirstError).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedMultipleFormFields).toHaveBeenCalledTimes(
          2
        )
        expect(instance.props.touchedMultipleFormFields).toHaveBeenCalledWith(
          'yourDetails',
          ['firstName', 'lastName', 'telephone']
        )
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledTimes(
          1
        )
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledWith(
          'Error proceeding to payment'
        )
        expect(sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
        expect(sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.CHECKOUT,
          action: GTM_ACTION.CLICKED,
          label: window.location.href,
          value: '',
        })
      })
    })

    describe('changeStore CTA', () => {
      it('isMobile = true, calls setStoreUpdating', () => {
        const setStoreUpdating = jest.fn()
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          isMobile: true,
          setStoreUpdating,
        })

        expect(instance.props.setStoreUpdating).not.toHaveBeenCalled()
        wrapper
          .find('.StoreDeliveryV2-changeStoreCTA')
          .first()
          .simulate('click')
        expect(instance.props.setStoreUpdating).toHaveBeenCalledTimes(1)
        expect(instance.props.setStoreUpdating).toHaveBeenLastCalledWith(true)
      })

      it('isMobile = false, calls setStoreUpdating and openCollectFromStoreModal', () => {
        const setStoreUpdating = jest.fn()
        const openCollectFromStoreModal = jest.fn()
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          setStoreUpdating,
          openCollectFromStoreModal,
        })

        expect(instance.props.setStoreUpdating).not.toHaveBeenCalled()
        expect(instance.props.openCollectFromStoreModal).not.toHaveBeenCalled()
        wrapper
          .find('.StoreDeliveryV2-changeStoreCTA')
          .first()
          .simulate('click')
        expect(instance.props.setStoreUpdating).toHaveBeenCalledTimes(1)
        expect(instance.props.setStoreUpdating).toHaveBeenLastCalledWith(true)
        expect(instance.props.openCollectFromStoreModal).toHaveBeenCalledTimes(
          1
        )
      })
    })
  })

  describe('@methods', () => {
    describe('onBackButtonEvent', () => {
      it('calls three methods', () => {
        const { instance } = renderComponent(initialProps)
        instance.validateStoreDelivery = jest.fn()
        instance.validateStoreDelivery.mockReturnValueOnce({
          yourDetails: {
            firstName: 'This field is required',
          },
        })
        instance.nextHandler = jest.fn()
        global.window.history.go = jest.fn()
        expect(instance.validateStoreDelivery).not.toHaveBeenCalled()
        expect(global.window.history.go).not.toHaveBeenCalled()
        expect(instance.nextHandler).not.toHaveBeenCalled()
        instance.onBackButtonEvent()
        expect(instance.validateStoreDelivery).toHaveBeenCalledTimes(1)
        expect(global.window.history.go).toHaveBeenCalledTimes(1)
        expect(global.window.history.go).toHaveBeenLastCalledWith(1)
        expect(instance.nextHandler).toHaveBeenCalledTimes(1)
        expect(instance.nextHandler).toHaveBeenLastCalledWith({
          yourDetails: {
            firstName: 'This field is required',
          },
        })
      })
    })

    describe('scrollToFirstError', () => {
      it('calls querySelector and setTimeout', () => {
        const { instance } = renderComponent(initialProps)
        document.querySelector = jest.fn()
        expect(setTimeout).not.toHaveBeenCalled()
        expect(document.querySelector).not.toHaveBeenCalled()
        instance.scrollToFirstError('firstName', true)
        expect(document.querySelector).toHaveBeenCalledTimes(1)
        expect(document.querySelector).toHaveBeenLastCalledWith(
          '.StoreDeliveryV2 .Input-firstName'
        )
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout.mock.calls[0][1]).toBe(15)
      })

      it('should not call setTimeout when isScrollToFirstErrorActive is set to false', () => {
        jest.clearAllMocks()
        const { instance } = renderComponent(initialProps)
        document.querySelector = jest.fn()
        expect(setTimeout).not.toHaveBeenCalled()
        instance.scrollToFirstError('firstName', false)
        expect(setTimeout).not.toHaveBeenCalled()
      })
    })

    describe('orderError', () => {
      it('shows order error when NOT OOS', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          orderError: 'I have an error',
        })
        expect(
          wrapper.find('Connect(OrderErrorMessageContainer)').exists()
        ).toEqual(true)
      })

      it('clears order error when page is submitted and there is orderError and not OOS', () => {
        const { instance } = renderComponent({
          ...initialProps,
          orderError: 'I have an error',
        })
        expect(initialProps.clearOrderError).toHaveBeenCalledTimes(0)
        instance.nextHandler({})
        expect(initialProps.clearOrderError).toHaveBeenCalledTimes(1)
      })
    })
  })
})
