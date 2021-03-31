import testComponentHelper from 'test/unit/helpers/test-component'
import ManualAddress from '../ManualAddress'
import Select from '../../FormComponents/Select/Select'

// constants
import checkoutAddressFormRules from '../../../../../shared/constants/checkoutAddressFormRules'

describe('<ManualAddress />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const requiredProps = {
    addressForm: {
      fields: {},
      errors: {},
      message: {},
    },
    country: 'United Kingdom',
    canFindAddress: true,
    addressType: 'deliveryCheckout',
    formNames: {
      address: 'deliveryAddressMCD',
      details: 'deliveryDetailsAddressMCD',
      findAddress: 'deliveryFindAddressMCD',
    },
    isFindAddressVisible: false,
    isDesktopMultiColumnStyle: false,
    postCodeRules: checkoutAddressFormRules['United Kingdom'],
    usStates: ['AL', 'CA'],
    shouldResetFormOnUnmount: false,
    // functions
    setAndValidateAddressField: () => {},
    touchField: () => {},
    handleClearForm: () => {},
    handleSwitchToFindAddress: () => {},
    setCountry: () => {},
  }
  const renderComponent = testComponentHelper(ManualAddress)

  describe('@renders', () => {
    it('should render default state', () => {
      expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
    })

    it('should render multiColumn when isDesktopMultiColumnStyle is true', () => {
      expect(
        renderComponent({
          ...requiredProps,
          isDesktopMultiColumnStyle: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      it('it will validate ManualAddress form', () => {
        const validateFormMock = jest.fn()
        const addressValidationSchema = {}
        const { instance } = renderComponent({
          ...requiredProps,
          addressValidationSchema: {},
          validateForm: validateFormMock,
        })
        instance.componentDidMount()

        expect(validateFormMock).toHaveBeenCalledWith(
          requiredProps.formNames.address,
          addressValidationSchema
        )
      })
    })

    describe('@componentWillUnmount', () => {
      const resetFormPartialMock = jest.fn()
      const clearFormErrorsMock = jest.fn()

      it('should call resetFormPartial if `shouldResetFormOnUnmount` is set to true', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          shouldResetFormOnUnmount: true,
          resetFormPartial: resetFormPartialMock,
          clearFormErrors: clearFormErrorsMock,
        })
        instance.componentWillUnmount()

        expect(resetFormPartialMock).toHaveBeenCalledWith(
          requiredProps.formNames.address,
          {
            address1: '',
            address2: '',
            postcode: '',
            city: '',
            county: '',
            state: '',
            isManual: false,
          }
        )
      })
      it('it will clear Errors for ManualAddress form', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          resetFormPartial: resetFormPartialMock,
          clearFormErrors: clearFormErrorsMock,
        })
        instance.componentWillUnmount()

        expect(clearFormErrorsMock).toHaveBeenCalledWith(
          requiredProps.formNames.address
        )
      })
    })
  })

  describe('@events and functions', () => {
    it('should trigger setAndValidateAddressField', () => {
      const setAndValidateAddressFieldMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        setAndValidateAddressField: setAndValidateAddressFieldMock,
      })
      wrapper.find('.ManualAddress-address1').prop('setField')()
      expect(setAndValidateAddressFieldMock).toHaveBeenCalledTimes(1)
      wrapper.find('.ManualAddress-address2').prop('setField')()
      expect(setAndValidateAddressFieldMock).toHaveBeenCalledTimes(2)
      wrapper.find('.ManualAddress-postcode').prop('setField')()
      expect(setAndValidateAddressFieldMock).toHaveBeenCalledTimes(3)
      wrapper.find('.ManualAddress-city').prop('setField')()
      expect(setAndValidateAddressFieldMock).toHaveBeenCalledTimes(4)
    })

    it('should trigger setAndValidateAddressField on state field type = select', () => {
      const selectOnChangeMock = jest.fn()
      const setAndValidateAddressFieldMock = () => selectOnChangeMock
      const { wrapper } = renderComponent({
        ...requiredProps,
        country: 'United States',
        postCodeRules: checkoutAddressFormRules['United States'],
        addressForm: {
          fields: {
            state: {
              value: 'CA',
            },
          },
        },
        setAndValidateAddressField: setAndValidateAddressFieldMock,
      })
      const selectComponent = wrapper.find(Select).find({ name: 'state' })
      selectComponent.prop('onChange')()
      expect(selectOnChangeMock).toHaveBeenCalledTimes(1)
    })

    it('should trigger setAndValidateAddressField on state field type = input', () => {
      const setAndValidateAddressFieldMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        country: 'Spain',
        postCodeRules: checkoutAddressFormRules.Spain,
        setAndValidateAddressField: setAndValidateAddressFieldMock,
      })
      const connectedInput = wrapper.find('Connect(Input)')
      const selectComponent = connectedInput.find('[name="state"]')
      selectComponent.prop('setField')()
      expect(setAndValidateAddressFieldMock).toHaveBeenCalledTimes(1)
    })

    it('should trigger touchField (address1, postCode)', () => {
      const addressFormTouchFieldMock = jest.fn()
      const touchFieldMock = () => addressFormTouchFieldMock
      const { wrapper } = renderComponent({
        ...requiredProps,
        country: 'Spain',
        postCodeRules: checkoutAddressFormRules.Spain,
        touchField: touchFieldMock,
      })
      wrapper.find('.ManualAddress-address1').prop('touchedField')(
        requiredProps.formNames.address
      )
      expect(addressFormTouchFieldMock).toHaveBeenCalledTimes(1)
      expect(addressFormTouchFieldMock).toHaveBeenCalledWith(
        requiredProps.formNames.address
      )
      wrapper.find('.ManualAddress-postcode').prop('touchedField')(
        requiredProps.formNames.address
      )
      expect(addressFormTouchFieldMock).toHaveBeenCalledTimes(2)
      expect(addressFormTouchFieldMock).toHaveBeenCalledWith(
        requiredProps.formNames.address
      )
      const connectedInput = wrapper.find('Connect(Input)')
      connectedInput.find('[name="state"]').prop('touchedField')(
        requiredProps.formNames.address
      )
      expect(addressFormTouchFieldMock).toHaveBeenCalledTimes(3)
    })

    it('should clear the form when Clear Form button is clicked', () => {
      const validateForm = jest.fn()
      const resetForm = jest.fn()
      const addressValidationSchema = {}
      const { wrapper } = renderComponent({
        ...requiredProps,
        resetForm,
        validateForm,
        addressValidationSchema,
      })

      const handleClearFormSpy = jest.spyOn(
        wrapper.instance(),
        'handleClearForm'
      )

      wrapper
        .find('button[data-jest-button-id="clear-form"]')
        .simulate('click', {
          preventDefault: () => {},
        })

      expect(handleClearFormSpy).toHaveBeenCalledTimes(1)
      expect(validateForm).toHaveBeenCalledTimes(1)
      expect(validateForm).toHaveBeenCalledWith(
        requiredProps.formNames.address,
        addressValidationSchema
      )

      expect(resetForm).toHaveBeenCalledTimes(1)
      expect(resetForm).toHaveBeenCalledWith(requiredProps.formNames.address, {
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        county: '',
        state: '',
        country: 'United Kingdom',
        isManual: true,
      })
    })

    it('should trigger handleSwitchToFindAddress', () => {
      const handleSwitchToFindAddressMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        canFindAddress: true,
        handleSwitchToFindAddress: handleSwitchToFindAddressMock,
      })
      wrapper.find('.ManualAddress-link--right').prop('onClick')()
      expect(handleSwitchToFindAddressMock).toHaveBeenCalledTimes(1)
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
        wrapper.find('.ManualAddress-postcode').simulate('blur')
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
          wrapper.find('.ManualAddress-postcode').simulate('blur', event)
          expect(setCountryMock).toHaveBeenCalledWith(
            'deliveryCheckout',
            'Guernsey'
          )
        })
      })
    })
  })
})
