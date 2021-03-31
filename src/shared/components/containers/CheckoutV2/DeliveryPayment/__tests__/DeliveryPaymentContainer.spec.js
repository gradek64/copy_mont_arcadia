import { getOrderDetails } from '../../../../../selectors/common/orderDetails'
import testComponentHelper, {
  analyticsDecoratorHelper,
  renderConnectedComponentProps,
} from '../../../../../../../test/unit/helpers/test-component'
import { sendEvent } from '../../../../../actions/common/googleAnalyticsActions'
import DeliveryAddressDetailsContainer from '../../shared/DeliveryAddressDetailsContainer'
import DeliveryOptionsContainer from '../../shared/DeliveryOptionsContainer'
import PaymentDetailsContainer from '../../shared/PaymentDetailsContainer'
import DigitalDeliveryPass from '../../shared/DigitalDeliveryPass/DigitalDeliveryPass'
import AddressBookComponent from '../../../AddressBook/AddressBook'
import DeliveryMethodsContainer from '../../shared/DeliveryMethodsContainer'
import PaymentBtnWithTC from '../../shared/PaymentBtnWithTC'

import DeliveryPaymentContainerWrapper, {
  DeliveryPaymentContainer,
  mapStateToProps,
} from '../DeliveryPaymentContainer'
import OrderErrorMessageContainer from '../../shared/OrderErrorMessageContainer'
import DeliveryInstructionsContainer from '../../shared/DeliveryInstructions/DeliveryInstructionsContainer'

jest.mock('../../../../../selectors/common/orderDetails')
jest.mock('../../../../../actions/common/googleAnalyticsActions')

const renderComponent = testComponentHelper(DeliveryPaymentContainer, {
  disableLifecycleMethods: false,
})

describe('<DeliveryPaymentContainer />', () => {
  const initialProps = {
    brandName: 'topshop',
    isDDPStandaloneOrder: false,
    ddpDefaultName: 'Topshop Unlimited',
    getShippingCountry: 'United Kingdom',
    orderSummary: {
      deliveryLocations: [
        {
          deliveryLocationType: 'HOME',
          label: 'Home Delivery Standard (UK up to 4 days; worldwide varies)',
          selected: true,
          deliveryMethods: [
            {
              shipModeId: 26504,
              shipCode: 'S',
              deliveryType: 'HOME_STANDARD',
              label: 'UK Standard up to 4 days',
              additionalDescription: 'Up to 4 days',
              selected: true,
              deliveryOptions: [],
            },
          ],
        },
      ],
      basket: {
        subTotal: '918.00',
        total: '918.00',
        totalBeforeDiscount: '918.00',
        discounts: [],
      },
      giftCards: [],
    },
    isHomeDeliverySelected: true,
    isFeatureAddressBookEnabled: false,
    getPaymentMethods: () => {},
    submitOrder: () => Promise.resolve(),
    validateForms: (_, { onValid }) => onValid(),
    sendEventAnalytics: () => {},
    sendEvent,
    ddpDefaultSku: { name: 'topshop' },
    billingCardDetails: {
      fields: {
        paymentType: {
          value: 'VISA',
        },
      },
    },
    isNewPaypalEnabled: false,
    selectedPaymentMethod: 'VISA',
  }

  afterAll(() => {
    jest.unmock('../../../../../selectors/common/orderDetails')
  })

  describe('decorators', () => {
    analyticsDecoratorHelper(
      DeliveryPaymentContainerWrapper,
      'delivery-payment',
      {
        componentName: 'DeliveryPaymentContainer',
        isAsync: true,
      }
    )

    it('should be decorated with @whenCheckedOut', () => {
      expect(DeliveryPaymentContainerWrapper.WrappedComponent.displayName).toBe(
        'Connect(WhenCheckedOut)'
      )
    })

    it('should be decorated with @connect', () => {
      expect(
        DeliveryPaymentContainerWrapper.WrappedComponent.WrappedComponent
          .displayName
      ).toBe('Connect(DeliveryPaymentContainer)')
    })
  })

  describe('@renders', () => {
    it('should render the widgets specific to the delivery and payments page', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should only render delivery options if not home delivery and no store selected', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isHomeDeliverySelected: false,
        hasSelectedStore: false,
      })
      expect(wrapper.find(DeliveryAddressDetailsContainer).length).toBe(0)
    })

    it('should not render delivery methods, delivery options and delivery instructions if bag only contains DDP product', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isDDPStandaloneOrder: true,
      })
      expect(wrapper.find(DeliveryInstructionsContainer).exists()).toBe(false)
      expect(wrapper.find(DeliveryMethodsContainer).exists()).toBe(false)
      expect(wrapper.find(DeliveryOptionsContainer).exists()).toBe(false)
    })

    it('with errors next button is not active', () => {
      const { getTree } = renderComponent({
        ...initialProps,
        formErrors: {
          yourAddress: {
            address1: 'This field is required',
          },
        },
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('AddressBook when isFeaturedAddressBookEnabled', () => {
      const { getTree } = renderComponent({
        ...initialProps,
        isFeatureAddressBookEnabled: true,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('DeliveryAddressDetailsContainer when not isFeaturedAddressBookEnabled', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should not render PaymentDetailsContainer if there is a giftCard that covers the basket total', () => {
      const props = {
        ...initialProps,
        orderSummary: {
          ...initialProps.orderSummary,
          basket: {
            subTotal: '918.00',
            total: '0.00',
            totalBeforeDiscount: '918.00',
            discounts: [{ value: '918.00' }],
          },
          giftCards: [
            {
              giftCardId: '6646689',
              giftCardNumber: 'XXXX XXXX XXXX 0830',
              balance: '918.00',
              amountUsed: '918.00',
              remainingBalance: '1257.15',
            },
          ],
        },
      }

      const { getTree, wrapper } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find(PaymentDetailsContainer).length).toBe(0)
    })

    it('should not display OrderErrorMessageContainer if isOutOfStock is true', () => {
      const props = {
        ...initialProps,
        isOutOfStock: true,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('Connect(OrderErrorMessageContainer)').exists()
      ).toEqual(false)
    })

    it('should display OrderErrorMessageContainer if isOutOfStock is false', () => {
      const props = {
        ...initialProps,
        isOutOfStock: false,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('Connect(OrderErrorMessageContainer)').exists()
      ).toEqual(true)
    })

    it('should not display DDP accordion if DDP purchase is not available', () => {
      const props = {
        ...initialProps,
        isFeatureDDPEnabled: true,
        isDDPPromotionEnabled: false,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(DigitalDeliveryPass).exists()).toEqual(false)
    })

    it('should not display AddressBook or DeliveryAddressDetailsContainer when store collection has been selected', () => {
      const props = {
        ...initialProps,
        isHomeDeliverySelected: false,
        hasSelectedStore: true,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(AddressBookComponent).length).toBe(0)
      expect(wrapper.find(DeliveryAddressDetailsContainer).length).toBe(0)
    })

    it('should not display `DDP applied to order` message if no DDP product in bag', () => {
      const props = {
        ...initialProps,
        isDDPOrder: false,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('DDPAppliedToOrderMsg').exists()).toBe(false)
    })

    it('should render the OrderErrorMessageContainer component if there is an error when submitting the order', () => {
      const state = {
        forms: {
          checkout: {
            order: {
              message: {
                message: 'Something went wrong...',
              },
            },
          },
        },
      }
      const props = renderConnectedComponentProps(
        OrderErrorMessageContainer,
        state
      )
      expect(props.errorMessage).toBe('Something went wrong...')
    })

    it('should render the OrderSummaryEspot', () => {
      const props = {
        ...initialProps,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('OrderSummaryEspot').exists()).toBe(true)
    })

    it('should not mount the Device Data Collection iframe if PSD2 is disabled', () => {
      const props = {
        ...initialProps,
        isPSD2PunchoutPopupEnabled: false,
        isPSD2ThreeDSecure2Enabled: true,
        prePaymentConfig: {},
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('Connect(DeviceDataCollectionIFrame)').exists()
      ).toEqual(false)
    })

    it('should not mount the Device Data Collection iframe if 3DS2 is disabled', () => {
      const props = {
        ...initialProps,
        isPSD2PunchoutPopupEnabled: true,
        isPSD2ThreeDSecure2Enabled: false,
        prePaymentConfig: {},
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('Connect(DeviceDataCollectionIFrame)').exists()
      ).toEqual(false)
    })

    it('should not mount the Device Data Collection iframe if prePaymentConfig is missing', () => {
      const props = {
        ...initialProps,
        isPSD2PunchoutPopupEnabled: true,
        isPSD2ThreeDSecure2Enabled: false,
        prePaymentConfig: null,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('Connect(DeviceDataCollectionIFrame)').exists()
      ).toEqual(false)
    })

    it('should mount the Device Data Collection iframe when PSD2 and 3DS2 are enabled, and prePaymentConfig is present', () => {
      const props = {
        ...initialProps,
        mountDDCIFrame: true,
        prePaymentConfig: {},
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('Connect(DeviceDataCollectionIFrame)').exists()
      ).toEqual(true)
    })

    it('should show DDPRenewal component if isDDPStandaloneOrder is true', () => {
      const props = {
        ...initialProps,
        isDDPStandaloneOrder: true,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('Connect(DDPRenewal)').exists()).toEqual(true)
    })
    describe('when `isNewPaypalEnabled` is equal to true and `selectedPaymentMethod` is equal to PYPAL', () => {
      it('should render the PayPalSmartButtons component', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isNewPaypalEnabled: true,
          selectedPaymentMethod: 'PYPAL',
        })
        expect(wrapper.find(PaymentBtnWithTC).prop('paypalSmartButtons')).toBe(
          true
        )
      })
    })

    describe('when `isNewPaypalEnabled` is equal to false or `selectedPaymentMethod` is not equal to PYPAL', () => {
      it('should render the PaymentBtnWithTC component with paypalSmartButtons prop to false', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isNewPaypalEnabled: false,
          selectedPaymentMethod: 'PYPAL',
        })
        expect(wrapper.find(PaymentBtnWithTC).prop('paypalSmartButtons')).toBe(
          false
        )
      })

      it('should render the PaymentBtnWithTC component with paypalSmartButtons prop to false', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isNewPaypalEnabled: true,
          selectedPaymentMethod: 'KLRNA',
        })
        expect(wrapper.find(PaymentBtnWithTC).prop('paypalSmartButtons')).toBe(
          false
        )
      })

      it('should render the PaymentBtnWithTC component with paypalSmartButtons prop to false', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isNewPaypalEnabled: false,
          selectedPaymentMethod: 'KLRNA',
        })
        expect(wrapper.find(PaymentBtnWithTC).prop('paypalSmartButtons')).toBe(
          false
        )
      })
    })
  })

  describe('@lifecycle', () => {
    describe('@compentDidUpdate', () => {
      describe('when DDP has been added to bag and was NOT in bag before', () => {
        it('it should call validateDDPForCountry with shipping country', () => {
          const { instance, wrapper } = renderComponent({
            ...initialProps,
            isDDPOrder: false,
            shippingCountry: 'Poland',
            validateDDPForCountry: jest.fn(),
          })
          wrapper.setProps({ isDDPOrder: true })
          expect(instance.props.validateDDPForCountry).toHaveBeenCalledWith(
            'Poland'
          )
        })
      })
    })
  })

  describe('mapStateToProps', () => {
    describe('orderDetails', () => {
      it('should return correct order details', () => {
        const orderDetailsMock = {
          delivery: '',
          billing: '',
          amount: '',
        }
        const state = {
          forms: {
            checkout: {
              billingCardDetails: {},
            },
          },
          klarna: {
            authorizationToken: '',
          },
        }
        getOrderDetails.mockImplementation(() => orderDetailsMock)
        expect(mapStateToProps(state).orderDetails).toBe(orderDetailsMock)
      })

      it('should return `undefined` if all properties are ‘nil’', () => {
        const orderDetailsMock = {
          delivery: undefined,
          billing: undefined,
          amount: undefined,
        }
        const state = {
          forms: {
            checkout: {
              billingCardDetails: {},
            },
          },
          klarna: {
            authorizationToken: '',
          },
        }
        getOrderDetails.mockImplementation(() => orderDetailsMock)
        expect(mapStateToProps(state).orderDetails).toBeUndefined()
      })
    })
  })
})
