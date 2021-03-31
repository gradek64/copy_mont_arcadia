import testComponentHelper from 'test/unit/helpers/test-component'
import FindAddress from '../FindAddress'

// constants
import checkoutAddressFormRules from '../../../../../shared/constants/checkoutAddressFormRules'

describe('<FindAddress />', () => {
  const requiredProps = {
    addressForm: {
      fields: {},
      errors: {},
      message: {},
    },
    addressType: 'deliveryCheckout',
    country: 'United Kingdom',
    countries: [],
    detailsForm: {
      fields: {},
      errors: {},
      message: {},
    },
    findAddressForm: {
      fields: {},
      errors: {},
      message: {},
    },
    formNames: {
      address: 'billingAddressMCD',
      details: 'billingDetailsAddressMCD',
      findAddress: 'billingFindAddressMCD',
    },
    // non req
    isFindAddressVisible: true,
    isDesktopMultiColumnStyle: true,
    monikers: [],
    postCodeRules: checkoutAddressFormRules['United Kingdom'],
    titleHidden: true,
    // functions
    setAndValidateFindAddressField: () => {},
    setAndValidateAddressField: () => {},
    touchField: () => {},
    setCountry: () => {},
    handleClearForm: () => {},
    handleFindAddressRequest: () => {},
    handleAddressChange: () => {},
    handleSwitchToManualAddress: () => {},
  }
  const renderComponent = testComponentHelper(FindAddress)

  describe('@renders', () => {
    it('should render default state', () => {
      expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
    })

    it('should render with isDesktopMultiColumnStyle', () => {
      expect(
        renderComponent({
          ...requiredProps,
          isDesktopMultiColumnStyle: true,
        }).getTree()
      )
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      const validateFormMock = jest.fn()
      const { instance } = renderComponent({
        ...requiredProps,
        findAddressValidationSchema: {},
        validateForm: validateFormMock,
      })
      instance.componentDidMount()
      it('it will validate FindAddress form', () => {
        const findAddressValidationSchema = {}
        expect(validateFormMock).toHaveBeenCalledWith(
          requiredProps.formNames.findAddress,
          findAddressValidationSchema
        )
      })
    })
    describe('@componentWillUnmount', () => {
      const resetFormMock = jest.fn()
      const clearFormErrorsMock = jest.fn()
      const { instance } = renderComponent({
        ...requiredProps,
        resetForm: resetFormMock,
        clearFormErrors: clearFormErrorsMock,
      })
      instance.componentWillUnmount()
      it('it will reset FindAddress form', () => {
        expect(resetFormMock).toHaveBeenCalledWith(
          requiredProps.formNames.findAddress,
          {
            houseNumber: '',
            message: '',
            findAddress: '',
            selectAddress: '',
            postcode: '',
          }
        )
      })
      it('it will clear Errors for FindAdress form', () => {
        expect(clearFormErrorsMock).toHaveBeenCalledWith(
          requiredProps.formNames.findAddress
        )
      })
    })
  })

  describe('@events and functions', () => {
    it('should trigger handleAddressChange', () => {
      const handleAddressChangeMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        monikers: [
          {
            moniker: '111 Something Close',
          },
        ],
        handleAddressChange: handleAddressChangeMock,
      })
      wrapper.find('.FindAddressV1-selectAddress').prop('onChange')({
        target: { selectedIndex: 1 },
      })
      expect(handleAddressChangeMock).toHaveBeenCalledTimes(1)
    })

    it('should trigger setAndValidateFindAddressField', () => {
      const setAndValidateFindAddressFieldMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        setAndValidateFindAddressField: setAndValidateFindAddressFieldMock,
      })
      wrapper.find('.FindAddressV1-houseNumber').prop('setField')()
      expect(setAndValidateFindAddressFieldMock).toHaveBeenCalledTimes(1)
    })

    it('should trigger setAndValidateAddressField', () => {
      const setAndValidateFindAddressFieldMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        setAndValidateFindAddressField: setAndValidateFindAddressFieldMock,
      })
      wrapper.find('.FindAddressV1-postcode').prop('setField')()
      expect(setAndValidateFindAddressFieldMock).toHaveBeenCalledTimes(1)
    })

    it('should trigger touchField (postcode)', () => {
      const formTouchFieldMock = jest.fn()
      const touchFieldMock = () => formTouchFieldMock
      const { wrapper } = renderComponent({
        ...requiredProps,
        isDesktopMultiColumnStyle: true,
        touchField: touchFieldMock,
      })
      wrapper.find('.FindAddressV1-postcode').prop('touchedField')(
        requiredProps.formNames.findAddress
      )
      expect(formTouchFieldMock).toHaveBeenCalledTimes(1)
      expect(formTouchFieldMock).toHaveBeenCalledWith(
        requiredProps.formNames.findAddress
      )
    })

    it('should trigger touchField (houseNumber)', () => {
      const findAddressFormTouchFieldMock = jest.fn()
      const touchFieldMock = () => findAddressFormTouchFieldMock
      const { wrapper } = renderComponent({
        ...requiredProps,
        touchField: touchFieldMock,
      })
      wrapper.find('.FindAddressV1-houseNumber').prop('touchedField')(
        requiredProps.formNames.findAddress
      )
      expect(findAddressFormTouchFieldMock).toHaveBeenCalledTimes(1)
      expect(findAddressFormTouchFieldMock).toHaveBeenCalledWith(
        requiredProps.formNames.findAddress
      )
    })

    it('should trigger handleFindAddressRequest', () => {
      const handleFindAddressRequestMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        handleFindAddressRequest: handleFindAddressRequestMock,
      })
      wrapper.find('.FindAddressV1-button').prop('onClick')()
      expect(handleFindAddressRequestMock).toHaveBeenCalledTimes(1)
    })

    it('should trigger handleSwitchToManualAddress', () => {
      const handleSwitchToManualAddressMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        handleSwitchToManualAddress: handleSwitchToManualAddressMock,
      })
      wrapper.find('.FindAddressV1-link').prop('onClick')()
      expect(handleSwitchToManualAddressMock).toHaveBeenCalledTimes(1)
    })

    describe('@onBlur', () => {
      it('should trigger postcodeBlurHandler', () => {
        const onBlurField = jest.fn()
        const onBlur = jest.fn(() => onBlurField)
        const { wrapper } = renderComponent({
          ...requiredProps,
          onBlur,
        })
        expect(onBlur).not.toHaveBeenCalled()
        expect(onBlurField).not.toHaveBeenCalled()
        wrapper.find('.FindAddressV1-postcode').simulate('blur')
        expect(onBlur).toHaveBeenCalledWith('postcode')
        expect(onBlurField).toHaveBeenCalledTimes(1)
      })

      describe('selected country is United Kingdom', () => {
        it('should update country when postcode is either Jersey or Guernsey', () => {
          const selectedCountry = 'United Kingdom'
          const onBlurField = jest.fn()
          const onBlur = jest.fn(() => onBlurField)
          const setCountryMock = jest.fn()
          const { wrapper } = renderComponent({
            ...requiredProps,
            country: selectedCountry,
            setCountry: setCountryMock,
            onBlur,
          })
          const event = {
            target: {
              value: 'GY1 6JN',
            },
          }
          wrapper.find('.FindAddressV1-postcode').simulate('blur', event)
          expect(setCountryMock).toHaveBeenCalledWith(
            'deliveryCheckout',
            'Guernsey'
          )
        })
      })
    })
  })
})
