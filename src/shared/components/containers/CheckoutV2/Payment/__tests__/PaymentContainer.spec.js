import testComponentHelper, {
  analyticsDecoratorHelper,
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import PaymentContainer from '../PaymentContainer'
import BillingAddressForm from '../../shared/AddressForm/BillingAddressForm'
import BillingDetailsForm from '../../shared/DetailsForm/BillingDetailsForm'
import AddressPreview from '../../../../common/AddressPreview/AddressPreview'
import { sendEvent } from '../../../../../actions/common/googleAnalyticsActions'
import OrderErrorMessageContainer from '../../shared/OrderErrorMessageContainer'
import PaymentBtnWithTC from '../../shared/PaymentBtnWithTC'

jest.mock('../../../../../actions/common/googleAnalyticsActions')

jest.mock('../../../../../lib/checkout', () => ({
  createOrder: jest.fn(),
  fixTotal: jest.fn(),
  giftCardCoversTotal: jest.fn(),
}))

jest.mock('../../../../../lib/checkout-utilities/klarna-utils', () => ({
  assembleFullPayload: jest.fn(),
}))

describe('<PaymentContainer />', () => {
  jest.useFakeTimers()
  beforeEach(() => {
    jest.resetAllMocks()
    global.scrollTo = jest.fn()
  })

  const renderComponent = testComponentHelper(
    PaymentContainer.WrappedComponent.WrappedComponent
  )
  const detailsFields = {
    title: {
      value: 'Dr',
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
  }
  const billingCardDetails = {
    fields: {
      paymentType: {
        value: 'VISA',
      },
      cardNumber: {
        value: '4444333322221111',
      },
      cvv: {
        value: '123',
      },
      expiryMonth: {
        value: '0810',
      },
    },
  }
  const initialProps = {
    isDDPStandaloneOrder: false,
    setFormField: jest.fn(),
    setFormMeta: jest.fn(),
    touchedFormField: jest.fn(),
    setManualAddressMode: jest.fn(),
    resetAddress: jest.fn(),
    resetForm: jest.fn(),
    findAddress: jest.fn(),
    touchedMultipleFormFields: jest.fn(),
    resetFormPartial: jest.fn(),
    getPaymentMethods: jest.fn(),
    addGiftCard: jest.fn(),
    hideGiftCardBanner: jest.fn(),
    removeGiftCard: jest.fn(),
    createOrder: jest.fn(),
    reAuthorize: jest.fn(),
    useDeliveryAsBilling: false,
    setDeliveryAsBillingFlag: jest.fn(),
    copyDeliveryValuesToBillingForms: jest.fn(),
    resetBillingForms: jest.fn(),
    homeDeliverySelected: false,
    sendAnalyticsErrorMessage: jest.fn(),
    sendAnalyticsClickEvent: jest.fn(),
    orderSummary: {
      creditCard: {
        cardNumberStar: '************1111',
      },
      basket: {
        total: '40.00',
        totalBeforeDiscount: '52.00',
        subTotal: '52.00',
        discounts: [],
      },
      giftCards: [],
      estimatedDelivery: ['No later than Friday 22 July 2016'],
      deliveryLocations: [
        {
          deliveryLocationType: 'HOME',
          label:
            'Home Delivery Standard (UK up to 4 working days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
          selected: true,
          deliveryMethods: [],
        },
        {
          deliveryLocationType: 'STORE',
          label:
            'Collect from Store Standard (3-7 working days) Express (next day)',
          selected: false,
          deliveryMethods: [],
        },
        {
          deliveryLocationType: 'PARCELSHOP',
          label: 'Collect from ParcelShop',
          selected: false,
          deliveryMethods: [],
        },
      ],
    },
    auth: {
      authentication: 'full',
    },
    billingDetails: {
      fields: detailsFields,
    },
    billingCardDetails,
    deliveryInstructions: {
      fields: {
        deliveryInstructions: {
          value: 'None',
        },
        smsMobileNumber: {
          value: '07979797979',
        },
      },
    },
    billingAddress: {
      fields: {
        country: {
          value: 'United Kingdom',
        },
      },
    },
    order: {
      fields: {
        isAcceptedTermsAndConditions: {
          value: false,
        },
      },
    },
    config: {
      checkoutAddressFormRules: {
        'United Kingdom': {},
      },
    },
    findAddressState: {
      isManual: true,
    },
    billingFindAddress: {
      fields: {
        postCode: {
          value: 'HP10 8HD',
        },
        houseNumber: {
          value: 'Sinclairs',
        },
      },
    },
    isMobile: true,
    yourDetails: {
      fields: detailsFields,
    },
    yourAddress: {
      fields: {
        address1: {
          value: 'Sinclairs, Sandpits Lane',
        },
        address2: {
          value: 'Penn',
        },
        city: {
          value: 'HIGH WYCOMBE',
        },
        country: {
          value: 'United Kingdom',
        },
        postcode: {
          value: 'HP10 8HD',
        },
      },
    },
    siteOptions: {
      titles: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'],
    },
    shoppingBag: {
      bag: {
        discounts: [
          {
            label: 'Topshop Card- £5 Welcome offer on a £50+ spend',
            value: '5.00',
          },
        ],
      },
    },
    paymentMethods: [],
    orderDetails: {
      amount: '20',
      billing: 'United Kingdom',
      delivery: 'United Kingdom',
    },
    user: {
      exists: true,
      email: 'winston@churchill.co.uk',
    },
    submitOrder: () => {},
    updateBillingForms: () => {},
    validateForms: () => {},
    sendEvent,
    isOutOfStock: false,
    isNewPaypalEnabled: false,
    selectedPaymentMethod: 'VISA',
    isGuestRecaptchaEnabled: false,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with storeDetails', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderSummary: {
            ...initialProps.orderSummary,
            storeDetails: {
              address1: 'c/o Top Shop, 60/64 The Strand',
              city: 'Strand',
              country: 'United Kingdom',
              postcode: 'WC2N 5LR',
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with findAddressState.address as false', () => {
      expect(
        renderComponent({
          ...initialProps,
          findAddressState: {
            address: false,
            monikers: [],
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('returns null when orderSummary is empty', () => {
      expect(
        renderComponent({
          ...initialProps,
          orderSummary: {},
        }).getTree()
      ).toMatchSnapshot()
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

    describe('CheckoutPaymentDetails component renders', () => {
      it('no orderSummary.creditCard', () => {
        expect(
          renderComponent({
            ...initialProps,
            orderSummary: {
              ...initialProps.orderSummary,
              creditCard: null,
            },
          }).getTree()
        ).toMatchSnapshot()
      })

      it('billingCardDetails.isShown is true', () => {
        expect(
          renderComponent({
            ...initialProps,
            billingCardDetails: {
              ...initialProps.billingCardDetails,
              isShown: true,
            },
          }).getTree()
        ).toMatchSnapshot()
      })
    })

    it(
      'hides the AddressPreview component and shows YourDetails and AddressForm components' +
        'when useDeliveryAsBilling is false',
      () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          useDeliveryAsBilling: false,
          homeDeliverySelected: true,
        })
        expect(wrapper.find(AddressPreview).length).toBe(0)
        expect(wrapper.find(BillingDetailsForm).length).toBe(1)
        expect(wrapper.find(BillingAddressForm).length).toBe(1)
      }
    )
    it(
      'hides the BillingAddress component and shows YourDetails and AddressForm components' +
        'when homeDeliverySelected is false',
      () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          useDeliveryAsBilling: true,
          homeDeliverySelected: false,
        })
        expect(wrapper.find(AddressPreview).length).toBe(0)
        expect(wrapper.find(BillingDetailsForm).length).toBe(1)
        expect(wrapper.find(BillingAddressForm).length).toBe(1)
      }
    )
    it(
      'shows the AddressPreview component and hides YourDetails and AddressForm components' +
        'when useDeliveryAsBilling is true',
      () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          useDeliveryAsBilling: true,
          homeDeliverySelected: true,
        })
        expect(wrapper.find(AddressPreview).length).toBe(1)
        expect(wrapper.find(BillingDetailsForm).length).toBe(0)
        expect(wrapper.find(BillingAddressForm).length).toBe(0)
      }
    )
    it('always has the "Same as delivery address" checkbox', () => {
      expect(
        renderComponent(initialProps).wrapper.find('.PaymentContainer-checkbox')
          .length
      ).toBe(1)
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

    it('should not render the save payment details checkout box if in guest checkout', () => {
      expect(
        renderComponent({
          ...initialProps,
          isGuestOrder: true,
        }).getTree()
      ).toMatchSnapshot()
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

    describe('when `isNewPaypalEnabled` is equal to true and `selectedPaymentMethod` is equal to PYPAL', () => {
      it('should render the PaymentBtnWithTC component with paypalSmartButtons prop to true', () => {
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
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(PaymentContainer, 'payment-details', {
      componentName: 'PaymentContainer',
      isAsync: false,
      redux: true,
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => jest.resetAllMocks())

    describe('componentDidMount', () => {
      it('calls resetAddress', () => {
        const resetAddress = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          location: {
            hash: '',
          },
          resetAddress,
        })
        expect(resetAddress).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(resetAddress).toHaveBeenCalledTimes(1)
      })

      it('calls global.window.scrollTo without hash', () => {
        const { instance } = renderComponent({
          ...initialProps,
          location: {
            hash: '',
          },
          resetAddress: jest.fn(),
        })
        global.window.scrollTo = jest.fn()
        expect(global.window.scrollTo).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(global.window.scrollTo).toHaveBeenCalledTimes(1)
        expect(global.window.scrollTo).toHaveBeenCalledWith(0, 0)
      })

      it('calls global.window.scrollTo with hash', () => {
        const { instance } = renderComponent({
          ...initialProps,
          location: {
            hash: '#fakehash',
          },
          resetAddress: jest.fn(),
        })
        global.window.scrollTo = jest.fn()
        document.getElementById = jest.fn()
        document.getElementById.mockReturnValueOnce({
          offsetTop: 10,
        })
        expect(global.window.scrollTo).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(global.window.scrollTo).toHaveBeenCalledTimes(1)
        expect(global.window.scrollTo).toHaveBeenCalledWith(0, 10)
      })
    })
  })

  describe('@methods', () => {
    describe('onChangeDeliveryAsBilling', () => {
      it('should call copyDeliveryValuesToBillingForms when checked = true', () => {
        const copyDeliveryValuesToBillingForms = jest.fn()
        const setDeliveryAsBillingFlag = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          copyDeliveryValuesToBillingForms,
          setDeliveryAsBillingFlag,
        })
        const checked = true
        expect(copyDeliveryValuesToBillingForms).not.toHaveBeenCalled()
        instance.onChangeDeliveryAsBilling(checked)
        expect(copyDeliveryValuesToBillingForms).toHaveBeenCalledTimes(1)
        expect(copyDeliveryValuesToBillingForms).toHaveBeenCalledWith()
        expect(setDeliveryAsBillingFlag).toHaveBeenCalledTimes(1)
        expect(setDeliveryAsBillingFlag).toHaveBeenCalledWith(true)
      })
      it('should call resetBillingForms when checked = false', () => {
        const resetBillingForms = jest.fn()
        const setDeliveryAsBillingFlag = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          resetBillingForms,
          setDeliveryAsBillingFlag,
        })
        const checked = false
        expect(resetBillingForms).not.toHaveBeenCalled()
        instance.onChangeDeliveryAsBilling(checked)
        expect(resetBillingForms).toHaveBeenCalledTimes(1)
        expect(resetBillingForms).toHaveBeenCalledWith()
        expect(setDeliveryAsBillingFlag).toHaveBeenCalledTimes(1)
        expect(setDeliveryAsBillingFlag).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('@events', () => {
    describe('On "Same as delivery address" checkbox onChange', () => {
      it('should call onChangeDeliveryAsBilling', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        instance.onChangeDeliveryAsBilling = jest.fn()
        expect(instance.onChangeDeliveryAsBilling).not.toHaveBeenCalled()
        wrapper
          .find('.PaymentContainer-checkbox')
          .first()
          .simulate('change')
        expect(instance.onChangeDeliveryAsBilling).toHaveBeenCalledTimes(1)
      })
    })

    describe('onSetBillingDetailsFormField', () => {
      it('does not call setDeliveryAsBillingFlag when copying values from the yourDetails form', () => {
        const props = {
          ...initialProps,
          yourDetails: {
            fields: {
              firstName: { value: 'Johnny' },
            },
          },
        }
        const { instance } = renderComponent(props)
        instance.onSetBillingDetailsFormField(
          'billingDetails',
          'firstName',
          'Johnny',
          'k'
        )
        expect(initialProps.setDeliveryAsBillingFlag).not.toHaveBeenCalled()
        expect(initialProps.setFormField).toHaveBeenCalledWith(
          'billingDetails',
          'firstName',
          'Johnny',
          'k'
        )
      })
      it('calls setDeliveryAsBillingFlag when values are different from the yourDetails form', () => {
        const props = {
          ...initialProps,
          yourDetails: {
            fields: {
              firstName: { value: 'Andrea' },
            },
          },
        }
        const { instance } = renderComponent(props)
        instance.onSetBillingDetailsFormField(
          'billingDetails',
          'firstName',
          'Johnny',
          'k'
        )
        expect(initialProps.setDeliveryAsBillingFlag).toHaveBeenCalledWith(
          false
        )
        expect(initialProps.setFormField).toHaveBeenCalledWith(
          'billingDetails',
          'firstName',
          'Johnny',
          'k'
        )
      })
    })

    describe('onChangeBillingAddress', () => {
      it('should call `setDeliveryAsBillingFlag` with `true` on address preview change', () => {
        const setDeliveryAsBillingFlagMock = jest.fn()
        const props = {
          ...initialProps,
          homeDeliverySelected: true,
          useDeliveryAsBilling: true,
          setDeliveryAsBillingFlag: setDeliveryAsBillingFlagMock,
        }
        const { wrapper } = renderComponent(props)
        wrapper.find(AddressPreview).prop('onClickChangeButton')()
        expect(setDeliveryAsBillingFlagMock).toHaveBeenCalledWith(false)
      })
    })
  })
})
