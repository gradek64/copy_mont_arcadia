import PaymentButtonContainer from '../PaymentButtonContainer'
import ApplePayButton from '../../ApplePayButton/ApplePayButton'
import testComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import * as logger from '../../../../../../client/lib/logger'

import {
  GTM_CATEGORY,
  GTM_ACTION,
  ANALYTICS_ERROR,
} from '../../../../../analytics/analytics-constants'
import Button from '../../../../common/Button/Button'

// actions
import { submitOrder } from '../../../../../actions/common/orderActions'
import { validateForms } from '../../../../../actions/common/checkoutActions'

jest.mock('../../../../../actions/common/orderActions', () => ({
  submitOrder: jest.fn(() => ({ type: 'foo' })),
}))

jest.mock('../../../../../actions/common/checkoutActions', () => ({
  validateForms: jest.fn(() => ({ type: 'foo' })),
}))

jest.spyOn(logger, 'nrBrowserLogError')

const initialProps = {
  className: 'Foo',
  isDDPStandaloneOrder: false,
  checkoutOrderSummaryCountry: 'United Kingdom',
  klarnaAuthToken: 'auth token...',
  paymentType: 'PAY',
  isOrderCoveredByGiftCards: false,
  formNames: ['formOne', 'formTwo'],
  validateDDPForCountry: jest.fn(),
  submitOrder: jest.fn(() => Promise.resolve()),
  validateForms: jest.fn((formNames, { onValid }) => onValid()),
  sendAnalyticsClickEvent: jest.fn(),
  sendAnalyticsErrorMessage: jest.fn(),
  sendEventAnalytics: jest.fn(),
  isOutOfStock: false,
  isKlarnaPaymentBlocked: false,
  paymentMethodsAreOpen: false,
  storedCardHasExpired: false,
  isGuestRecaptchaEnabled: false,
}

const renderComponent = testComponentHelper(
  PaymentButtonContainer.WrappedComponent
)

const propsForEligibleKlarna = {
  ...initialProps,
  paymentButtonLabel: 'Order and Pay Now',
}

const propsForEligibleApplePay = {
  ...initialProps,
  paymentType: 'APPLE',
}

function renderConnectedProps(state, ownProps) {
  return renderConnectedComponentProps(PaymentButtonContainer, state, ownProps)
}

describe('<PaymentButtonContainer />', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('@renders', () => {
    describe('the rendered button', () => {
      it('renders with the right props', () => {
        const component = renderComponent(propsForEligibleKlarna)
        const button = component.wrapper.find(Button)
        expect(component.getTreeFor(button)).toMatchSnapshot()
      })
      describe('button is disabled', () => {
        it('with errors next button is not active and card payment is selected', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isCardPaymentSelected: true,
            formErrors: {
              yourAddress: {
                address1: 'This field is required',
              },
            },
          })

          expect(wrapper.find('Button').prop('isDisabled')).toBe(true)
        })
        it('if Out of Stock is true', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isOutOfStock: true,
          })
          expect(wrapper.find('Button').prop('isDisabled')).toBe(true)
        })

        it('isKlarnaPaymentBlocked prop is true', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isKlarnaPaymentBlocked: true,
          })
          expect(wrapper.find('Button').prop('isDisabled')).toBe(true)
        })

        it('Saved Account / Debit or Credit Card form is not completed yet', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isCardPaymentSelected: true,
            formErrors: {
              billingCardDetails: {
                erorrs: { cardNumber: 'A 16 digit card number is required' },
              },
            },
          })
          expect(wrapper.find('Button').prop('isDisabled')).toBe(true)
        })

        describe('Saved Account / Debit or Credit Card has expired', () => {
          describe('User is not changing card payment details', () => {
            it('Should be disabled', () => {
              const { wrapper } = renderComponent({
                ...initialProps,
                storedCardHasExpired: true,
              })
              expect(wrapper.find('Button').prop('isDisabled')).toBe(true)
            })
          })
        })

        it('if order is not covered by gift cards', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            paymentType: '',
            isOrderCoveredByGiftCards: false,
          })
          expect(wrapper.find('Button').prop('isDisabled')).toBe(true)
        })
      })
      describe('button is NOT disabled', () => {
        it('should keep button active when selected payment is "CARD" and form has no errors', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            formErrors: {},
            isCardPaymentSelected: true,
          })
          expect(wrapper.find('Button').prop('isDisabled')).toBe(false)
        })
        it('should keep button active when selected payment is not card payment', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isCardPaymentSelected: false,
          })
          expect(wrapper.find('Button').prop('isDisabled')).toBe(false)
        })

        it('if order is covered by gift cards', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            paymentType: '',
            isOrderCoveredByGiftCards: true,
          })
          expect(wrapper.find('Button').prop('isDisabled')).toBe(false)
        })
      })
    })
    describe('labels', () => {
      it('should render ‘Pay via PayPal’ text in button for paypal', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          paymentButtonLabel: 'Pay via PayPal',
        })
        expect(
          wrapper
            .find(Button)
            .render()
            .text()
        ).toBe('Pay via PayPal')
      })

      it('should render ‘Pay with Klarna’ text in button for klarna', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          paymentButtonLabel: 'Pay with Klarna',
        })
        expect(
          wrapper
            .find('Button')
            .render()
            .text()
        ).toBe('Pay with Klarna')
      })

      it('should render `Proceed to Clearpay` text in button for Clearpay', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          paymentButtonLabel: 'Proceed to Clearpay',
        })
        expect(
          wrapper
            .find('Button')
            .render()
            .text()
        ).toBe('Proceed to Clearpay')
      })
    })

    describe('when using klarna', () => {
      describe('when klarna eligibility check passed', () => {
        it('renders the button', () => {
          const component = renderComponent(propsForEligibleKlarna)
          expect(component.wrapper.find(Button).exists()).toBe(true)
        })
      })
    })

    describe('when using ApplePay', () => {
      it('renders the ApplePay button', () => {
        const component = renderComponent(propsForEligibleApplePay)

        expect(component.wrapper.find(ApplePayButton).exists()).toBe(true)
      })
    })

    describe('Qubit wrapper', () => {
      it('renders the button text within a qubit wrapper with correctPayment Type', () => {
        const paymentType = 'PYPAL'
        const { wrapper } = renderComponent({
          ...initialProps,
          paymentType,
        })
        const qubitBtnTextWrapper = wrapper.find('#qubit-payment-button-text')
        expect(qubitBtnTextWrapper).not.toBeNull()
        expect(qubitBtnTextWrapper.prop('paymentType')).toBe(paymentType)
      })
    })

    describe('User is changing card payment details', () => {
      it('Should not be disabled', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          storedCardHasExpired: true,
          paymentMethodsAreOpen: true,
        })
        expect(wrapper.find('Button').prop('isDisabled')).toBe(false)
      })
    })

    describe('OrderProductNotification', () => {
      it('should not render Out of Stock is false', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
        })
        expect(wrapper.find('OrderProductNotification').exists()).toBe(false)
      })

      it('should render Out of Stock is true', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isOutOfStock: true,
        })
        expect(wrapper.find('OrderProductNotification').length).toBe(1)
      })

      it('should not display error `Message` component if isOutOfStock is true and render `OrderProductNotification` component', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isOutOfStock: true,
          errorMessage: 'The credit card number must be valid',
        })
        const message = wrapper.find('Message')
        expect(message.exists()).toBe(false)
        expect(wrapper.find('OrderProductNotification').length).toBe(1)
      })
    })
  })

  describe('@events', () => {
    it('should submit order on submit button click if valid', async () => {
      const props = {
        ...initialProps,
        formNames: ['AAAA'],
        validateForms: jest.fn((formNames, { onValid = () => {} }) => {
          onValid()
        }),
      }
      const { wrapper, instance } = renderComponent(props)
      instance.recaptchaRef.current = {
        executeAsync: () => Promise.resolve('aToken'),
      }
      await wrapper
        .find(Button)
        .dive()
        .simulate('click')
      expect(props.submitOrder).toHaveBeenCalled()
    })

    it('should only submit an order only once if clicked twice', () => {
      const props = {
        ...initialProps,
        formNames: ['AAAA'],
        validateForms: jest.fn((formNames, { onValid = () => {} }) => {
          onValid()
        }),
      }
      const { wrapper } = renderComponent(props)

      wrapper
        .find(Button)
        .dive()
        .simulate('click')

      wrapper
        .find(Button)
        .dive()
        .simulate('click')

      expect(props.submitOrder).toHaveBeenCalledTimes(1)
    })

    it('returns validateDDPForCountry if only a ddp order and checkoutOrderSummaryCountry not United Kingdom', () => {
      const props = {
        ...initialProps,
        isDDPStandaloneOrder: true,
        checkoutOrderSummaryCountry: 'Australia',
      }
      const { wrapper, instance } = renderComponent(props)
      wrapper
        .find(Button)
        .dive()
        .simulate('click')

      expect(instance.props.submitOrder).not.toHaveBeenCalled()
      expect(instance.props.validateDDPForCountry).toHaveBeenCalledTimes(1)
      expect(instance.props.validateDDPForCountry).toHaveBeenCalledWith(
        'Australia'
      )
    })

    it('does not return validateDDPForCountry if not only a ddp order', async () => {
      const props = {
        ...initialProps,
        isDDPStandaloneOrder: false,
      }
      const { wrapper, instance } = renderComponent(props)
      instance.recaptchaRef.current = {
        executeAsync: () => Promise.resolve('aToken'),
      }
      await wrapper
        .find(Button)
        .dive()
        .simulate('click')

      expect(instance.props.validateDDPForCountry).not.toHaveBeenCalled()
      expect(instance.props.submitOrder).toHaveBeenCalledTimes(1)
      expect(instance.props.validateDDPForCountry).not.toHaveBeenCalled()
    })

    it('does not return validateDDPForCountry if checkoutOrderSummaryCountry is United Kingdom', async () => {
      const props = {
        ...initialProps,
        isDDPStandaloneOrder: true,
      }
      const { wrapper, instance } = renderComponent(props)

      instance.recaptchaRef.current = {
        executeAsync: () => Promise.resolve('aToken'),
      }

      await wrapper
        .find(Button)
        .dive()
        .simulate('click')

      expect(instance.props.validateDDPForCountry).not.toHaveBeenCalled()
      expect(instance.props.submitOrder).toHaveBeenCalledTimes(1)
      expect(instance.props.validateDDPForCountry).not.toHaveBeenCalled()
    })

    it('should submit GTM events when order is successful', async () => {
      const { wrapper, instance } = renderComponent({
        ...initialProps,
      })
      wrapper
        .find(Button)
        .dive()
        .simulate('click')
      expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
      expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
        category: GTM_CATEGORY.CHECKOUT,
        action: GTM_ACTION.CLICKED,
        label: 'confirm-and-pay',
        value: '',
      })
      expect(instance.props.sendAnalyticsErrorMessage).not.toHaveBeenCalled()
    })

    it('should submit GTM error events when order fails', async () => {
      const { wrapper, instance } = renderComponent({
        ...initialProps,
        formErrors: {
          yourAddress: {
            address1: 'This field is required',
          },
        },
      })

      wrapper
        .find(Button)
        .dive()
        .simulate('click')

      expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
      expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
        category: GTM_CATEGORY.CHECKOUT,
        action: GTM_ACTION.CLICKED,
        label: 'confirm-and-pay',
        value: '',
      })
      expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledWith(
        ANALYTICS_ERROR.CONFIRM_AND_PAY
      )
    })

    it('should not send analytics on submit order success', () => {
      const props = { ...initialProps }
      const { wrapper, instance } = renderComponent(props)
      instance.recaptchaRef.current = {
        executeAsync: () => Promise.resolve('aToken'),
      }
      const clickHandler = wrapper.find(Button).prop('clickHandler')

      return clickHandler().then(() => {
        expect(props.sendEventAnalytics).not.toHaveBeenCalled()
      })
    })
  })

  describe('@connected', () => {
    const ownProps = { formNames: ['form'] }
    describe('mapping state to props', () => {
      describe('paymentType', () => {
        it('`paymentType` is correctly mapped from state when the payment type is available', () => {
          const value = 'FOO'
          const state = {
            forms: {
              checkout: {
                billingCardDetails: {
                  fields: {
                    paymentType: {
                      value,
                    },
                  },
                },
              },
            },
            klarna: {
              blockKlarnaPayment: false,
            },
          }
          const props = renderConnectedProps(state, ownProps)
          expect(props.paymentType).toBe(value)
        })

        it('is mapped as an empty string when the payment type is not available', () => {
          const props = renderConnectedProps(
            {
              klarna: { blockKlarnaPayment: false },
            },
            ownProps
          )
          expect(props.paymentType).toBe('')
        })
      })
    })

    describe('mapping dispatch to props', () => {
      const state = {
        klarna: { blockKlarnaPayment: false },
      }
      it('`submitOrder()` is correctly mapped', () => {
        const props = renderConnectedProps(state, ownProps)
        props.submitOrder('hello')
        expect(submitOrder).toHaveBeenCalledTimes(1)
        expect(submitOrder).toHaveBeenCalledWith('hello')
      })

      it('`validateForms()` is correctly mapped', () => {
        const props = renderConnectedProps(state, ownProps)
        props.validateForms('yes')
        expect(validateForms).toHaveBeenCalledTimes(1)
        expect(validateForms).toHaveBeenCalledWith('yes')
      })
    })
  })

  describe('ReCAPTCHA', () => {
    describe('when isGuestRecaptchaEnabled is true', () => {
      it('should inject the ReCAPTCHA component', () => {
        const props = {
          ...initialProps,
          isGuestRecaptchaEnabled: true,
          googleRecaptchaSiteKey: 'recaptcha site key for topshop',
        }
        const { wrapper } = renderComponent(props)
        const recaptcha = wrapper.find('AsyncScriptLoader(ReCAPTCHA)')
        expect(recaptcha).toHaveLength(1)
        expect(recaptcha.prop('size')).toBe('invisible')
        expect(recaptcha.prop('sitekey')).toBe('recaptcha site key for topshop')
      })
    })

    describe('when isGuestRecaptchaEnabled is false', () => {
      it('should not inject the ReCAPTCHA component', () => {
        const props = {
          ...initialProps,
        }
        const { wrapper } = renderComponent(props)
        const recaptcha = wrapper.find('AsyncScriptLoader(ReCAPTCHA)')
        expect(recaptcha).toHaveLength(0)
      })
    })

    describe('onErrored', () => {
      it('calls nrBrowserLogError', () => {
        const props = {
          ...initialProps,
          isGuestRecaptchaEnabled: true,
          googleRecaptchaSiteKey: 'recaptcha site key for topshop',
        }
        const { wrapper } = renderComponent(props)
        const recaptcha = wrapper.find('AsyncScriptLoader(ReCAPTCHA)')
        recaptcha.props().onErrored()

        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'ReCaptcha, token errored',
          {}
        )
      })
    })

    describe('onExpired', () => {
      it('calls nrBrowserLogError', () => {
        const props = {
          ...initialProps,
          isGuestRecaptchaEnabled: true,
          googleRecaptchaSiteKey: 'recaptcha site key for topshop',
        }
        const { wrapper } = renderComponent(props)
        const recaptcha = wrapper.find('AsyncScriptLoader(ReCAPTCHA)')
        recaptcha.props().onExpired()

        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'ReCaptcha, token expired',
          {}
        )
      })
    })
  })
})
