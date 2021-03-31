import { omit } from 'ramda'
import testComponentHelper from 'test/unit/helpers/test-component'
import { WrappedCardPaymentMethod, mapStateToProps } from '../CardPaymentMethod'

describe('<CardPaymentMethod/>', () => {
  const renderComponent = testComponentHelper(WrappedCardPaymentMethod)

  const showModalStub = jest.fn()
  const setFormFieldStub = jest.fn()
  const validateFormFieldStub = jest.fn()
  const setAndValidateFormFieldStub = jest.fn()
  const touchedFormFieldStub = jest.fn()
  const openPaymentMethodsStub = jest.fn()

  const baseProps = {
    showModal: showModalStub,
    setFormField: setFormFieldStub,
    setAndValidateFormField: setAndValidateFormFieldStub,
    validateFormField: validateFormFieldStub,
    touchFormField: touchedFormFieldStub,
    openPaymentMethods: openPaymentMethodsStub,
    validate: jest.fn(() => {}),
    clearErrors: jest.fn(),
    sendAnalyticsValidationState: () => {},
  }

  // Fri Aug 11 2017 11:51:51 GMT+0100 (BST)
  const fixedDate = new Date(1502448695606)

  let dateMock

  beforeEach(() => {
    dateMock = jest.spyOn(global, 'Date').mockImplementation(() => fixedDate)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('@connect', () => {
    describe('mapStateToProps', () => {
      const formsState = {
        forms: {
          checkout: {
            billingCardDetails: {
              fields: {
                paymentType: {
                  value: 'VISA',
                },
                cardNumber: {
                  value: '4444333322221111',
                },
                expiryMonth: {
                  value: '06',
                },
                expiryDate: {
                  value: '2123',
                },
                expiryYear: {
                  value: '2017',
                },
                cvv: {
                  value: '123',
                },
              },
            },
          },
        },
      }

      const paymentMethodsState = {
        paymentMethods: [
          { value: 'VISA', type: 'CARD', label: 'Visa' },
          { value: 'AMEX', type: 'CARD', label: 'American Express' },
          { value: 'ACCNT', type: 'OTHER_CARD' },
          { value: 'PYPAL', type: 'OTHER' },
        ],
      }

      const viewportState = {
        viewport: {
          media: 'desktop',
        },
      }

      const siteOptions = {
        siteOptions: {
          expiryYears: ['2017'],
          expiryMonths: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
          ],
        },
      }

      it('should create default props', () => {
        expect(
          mapStateToProps(
            {
              ...viewportState,
              paymentMethods: [],
              ...siteOptions,
            },
            {
              formCardPath: ['checkout', 'billingCardDetails', 'fields'],
              formCardErrorPath: [
                'forms',
                'checkout',
                'billingCardDetails',
                'errors',
              ],
            }
          )
        ).toEqual({
          isMobile: false,
          paymentType: null,
          cardNumberField: {},
          expiryMonthField: {},
          expiryDateField: {},
          cvvField: {},
          errors: {},
          cardTypes: [],
          validationSchema: {
            cardNumber: '',
            cvv: '',
            expiryDate: '',
            expiryMonth: '',
          },
          expiryYears: ['2017'],
          expiryMonths: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
          ],
        })
      })

      it('should return the fields', () => {
        const props = mapStateToProps(
          {
            ...formsState,
            ...viewportState,
            ...paymentMethodsState,
            ...siteOptions,
          },
          {
            formCardPath: ['checkout', 'billingCardDetails', 'fields'],
            formCardErrorPath: [
              'forms',
              'checkout',
              'billingCardDetails',
              'errors',
            ],
          }
        )
        expect(props.cardNumberField).toEqual({ value: '4444333322221111' })
        expect(props.expiryMonthField).toEqual({ value: '06' })
        expect(props.cvvField).toEqual({ value: '123' })
      })

      it('should return the payment type', () => {
        expect(
          mapStateToProps(
            {
              ...formsState,
              ...viewportState,
              ...paymentMethodsState,
              ...siteOptions,
            },
            {
              formCardPath: ['checkout', 'billingCardDetails', 'fields'],
              formCardErrorPath: [
                'forms',
                'checkout',
                'billingCardDetails',
                'errors',
              ],
            }
          ).paymentType
        ).toBe('VISA')
      })

      it('should return the errors', () => {
        dateMock.mockRestore()
        expect(
          mapStateToProps(
            {
              ...paymentMethodsState,
              ...viewportState,
              ...siteOptions,
              forms: {
                checkout: {
                  billingCardDetails: {
                    errors: {
                      cardNumber: 'A 16 digit card number is required',
                      expiryMonth: 'Please select a valid expiry date',
                      cvv: '3 digits required',
                    },
                  },
                },
              },
            },
            {
              formCardPath: ['checkout', 'billingCardDetails', 'fields'],
              formCardErrorPath: [
                'forms',
                'checkout',
                'billingCardDetails',
                'errors',
              ],
            }
          ).errors
        ).toEqual({
          cardNumber: 'A 16 digit card number is required',
          expiryMonth: 'Please select a valid expiry date',
          cvv: '3 digits required',
        })
      })

      it('should return the card types', () => {
        expect(
          mapStateToProps(
            {
              ...formsState,
              ...paymentMethodsState,
              ...viewportState,
              ...siteOptions,
            },
            {
              formCardPath: ['checkout', 'billingCardDetails', 'fields'],
              formCardErrorPath: [
                'forms',
                'checkout',
                'billingCardDetails',
                'errors',
              ],
            }
          ).cardTypes
        ).toEqual(['Visa', 'American Express'])
      })
    })
  })

  describe('@lifeCycles', () => {
    describe('componentDidMount', () => {
      it('should call validate form using validationSchema on mount ', () => {
        const { instance } = renderComponent(baseProps)
        instance.componentDidMount()
        expect(instance.props.validate).toHaveBeenCalledWith(
          instance.props.validationSchema
        )
      })
      it('should call validate form using validationSchema omitting CVV validation if noCVV prop is true ', () => {
        const { instance } = renderComponent({ ...baseProps, noCVV: true })
        const validationSchema = omit(['cvv'], instance.props.validationSchema)
        instance.componentDidMount()
        expect(instance.props.validate).toHaveBeenCalledWith(validationSchema)
      })
      it('should call the setFormField if paymentType value is empty', () => {
        const { instance } = renderComponent({
          ...baseProps,
          paymentType: '',
        })
        instance.componentDidMount()
        expect(instance.props.setFormField).toHaveBeenCalledWith(
          'billingCardDetails',
          'paymentType',
          'VISA'
        )
      })
      it('should not call the setFormField if paymentType value is not empty', () => {
        const { instance } = renderComponent({
          ...baseProps,
          paymentType: 'VISA',
        })
        instance.componentDidMount()
        expect(instance.props.setFormField).not.toHaveBeenCalled()
      })
    })
    describe('componentwillUnMount', () => {
      const form = 'billingCardDetails'
      const clearErrors = jest.fn()
      const resetFormPartial = jest.fn()
      const props = {
        ...baseProps,
        noCVV: false,
        clearErrors,
        resetFormPartial,
      }

      it('should clear errors', () => {
        const { wrapper } = renderComponent(props)
        wrapper.unmount()

        expect(clearErrors).toBeCalled()
      })

      describe('when payment card has CVV field', () => {
        const { wrapper } = renderComponent(props)
        const fieldsToReset = {
          cardNumber: '',
          cvv: '',
          expiryDate: '',
          expiryMonth: '',
          expiryYear: '',
        }
        it('should reset billing card details form', () => {
          wrapper.unmount()
          expect(resetFormPartial).toBeCalledWith(form, fieldsToReset)
        })
      })

      describe('when payment card doesnt have CVV field', () => {
        const { wrapper } = renderComponent({
          ...props,
          noCVV: true,
        })
        it('should reset billing card details form except CVV', () => {
          wrapper.unmount()
          expect(resetFormPartial).toBeCalledWith(form, {
            cardNumber: '',
            expiryDate: '',
            expiryMonth: '',
            expiryYear: '',
          })
        })
      })
    })
    describe('componentDidUpdate', () => {
      describe('calls validate method when payment type changes', () => {
        it('should call validate with checkout fields and CVV', () => {
          const validationSchema = {
            cardNumber: '',
            cvv: '',
            expiryMonth: '',
            expiryDate: '',
          }
          const prevProps = {
            ...baseProps,
            paymentType: 'ACCNT',
          }
          const nextProps = {
            ...baseProps,
            paymentType: 'VISA',
            validationSchema,
          }
          const { instance } = renderComponent(nextProps)
          instance.componentDidUpdate(prevProps)
          expect(instance.props.validate).toHaveBeenCalledWith(validationSchema)
        })
        it('should call validate with user account card fields with no CVV', () => {
          const validator = {
            cardNumber: '',
            expiryMonth: '',
            expiryDate: '',
          }
          const validationSchema = { validator }
          const billingCardFields = { cardNumber: '', cvv: '' }

          const prevProps = {
            ...baseProps,
            paymentType: 'ACCNT',
            billingCardFieldsToValidate: { ...billingCardFields },
          }
          const nextProps = {
            ...baseProps,
            paymentType: 'VISA',
            validationSchema,
            noCVV: true,
            billingCardFieldsToValidate: { ...billingCardFields },
          }
          const { instance } = renderComponent(nextProps)

          instance.componentDidUpdate(prevProps)
          expect(instance.props.validate).toHaveBeenCalledWith(validationSchema)
        })
      })
      it('should not validate CVV or Card Number if payment type has not changed', () => {
        const prevProps = {
          ...baseProps,
          paymentType: 'MCARD',
        }
        const { instance } = renderComponent(prevProps)
        instance.componentDidUpdate(prevProps)
        expect(instance.props.validateFormField).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('@renders', () => {
    it('should render default state correctly', () => {
      const component = renderComponent(baseProps)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('Should pass down expiryDate as undefined values', () => {
      const { wrapper } = renderComponent(baseProps)
      expect(wrapper.find('[name="expiryDate"]').prop('value')).toBe(undefined)
    })

    describe('Card Number Input', () => {
      it('should pass `cardNumberField` as `field` prop', () => {
        const component = renderComponent({
          ...baseProps,
          cardNumberField: {
            value: '4444333322221111',
            isTouched: true,
          },
        })
        expect(
          component.wrapper.find('.CardPaymentMethod-cardNumber').prop('field')
        ).toEqual({
          value: '4444333322221111',
          isTouched: true,
        })
      })

      it('should pass card number error as `errors` prop', () => {
        const component = renderComponent({
          ...baseProps,
          errors: {
            cardNumber: 'A 16 digit card number is required',
          },
        })
        expect(
          component.wrapper.find('.CardPaymentMethod-cardNumber').prop('errors')
        ).toEqual({
          cardNumber: 'A 16 digit card number is required',
        })
      })

      it('should set type to `tel` (needs to _not_ be `number` so iOS displays autofill option', () => {
        const { wrapper } = renderComponent(baseProps)
        expect(wrapper.find('.CardPaymentMethod-cardNumber').prop('type')).toBe(
          'tel'
        )
      })
    })

    describe('Expiry Date Input', () => {
      it('should pass `expiryDate` as `field` prop', () => {
        const component = renderComponent({
          ...baseProps,
          expiryDateField: {
            value: '2234',
            isTouched: true,
          },
        })

        expect(
          component.wrapper.find('.CardPaymentMethod-expiryDate').prop('field')
        ).toEqual({
          value: '2234',
          isTouched: true,
        })
      })
      it('should pass card number error as `errors` prop', () => {
        const component = renderComponent({
          ...baseProps,
          errors: {
            expiryDate: 'Please select a valid expiry date',
          },
        })
        expect(
          component.wrapper.find('.CardPaymentMethod-expiryDate').prop('errors')
        ).toEqual({
          expiryDate: 'Please select a valid expiry date',
        })
      })
    })

    describe('CVV Field', () => {
      it('should pass `cvvField` as `field` prop', () => {
        const component = renderComponent({
          ...baseProps,
          cvvField: {
            value: '123',
            isTouched: true,
          },
        })
        expect(component.wrapper.find('CVVField').prop('field')).toEqual({
          value: '123',
          isTouched: true,
        })
      })

      it('should pass cvv error as `errors` prop', () => {
        const component = renderComponent({
          ...baseProps,
          errors: {
            cvv: '3 digits required',
          },
        })
        expect(component.wrapper.find('CVVField').prop('error')).toEqual(
          '3 digits required'
        )
      })
    })
  })

  describe('@methods', () => {
    describe('removeWhiteSpaces', () => {
      it('should removes whitespaces for a given field', () => {
        const validator = 'card number validator'
        const fieldName = 'cardNumber'
        const validationSchema = { [fieldName]: validator }
        const { instance } = renderComponent({ ...baseProps, validationSchema })
        instance.removeWhiteSpaces(fieldName)({
          target: { value: '555 555555555 4444' },
        })
        expect(instance.props.setAndValidateFormField).toHaveBeenCalledWith(
          'billingCardDetails',
          fieldName,
          '5555555555554444',
          validator
        )
      })
    })
  })

  describe('@events', () => {
    describe('Card Number', () => {
      it('should be able to set the card number', () => {
        const component = renderComponent(baseProps)
        const setFieldHandler = component.wrapper
          .find('.CardPaymentMethod-cardNumber')
          .prop('setField')
        setFieldHandler()({ target: { value: '4444333322221111' } })
        expect(setAndValidateFormFieldStub).toHaveBeenCalledWith(
          'billingCardDetails',
          'cardNumber',
          '4444333322221111',
          []
        )
      })

      it('should set the `paymentType` if is a payment card and `paymentType` changes', () => {
        const component = renderComponent({
          ...baseProps,
          isPaymentCard: true,
        })
        const setFieldHandler = component.wrapper
          .find('.CardPaymentMethod-cardNumber')
          .prop('setField')
        setFieldHandler()({ target: { value: '4444333322221111' } })
        expect(setFormFieldStub).toHaveBeenCalledWith(
          'billingCardDetails',
          'paymentType',
          'VISA'
        )
      })

      it('should set non-Visa `paymentType` if applicable', () => {
        const component = renderComponent({
          ...baseProps,
          isPaymentCard: true,
          cardTypes: ['American Express'],
        })
        const setFieldHandler = component.wrapper
          .find('.CardPaymentMethod-cardNumber')
          .prop('setField')
        setFieldHandler()({ target: { value: '343434343434343' } })
        expect(setFormFieldStub).toHaveBeenCalledWith(
          'billingCardDetails',
          'paymentType',
          'AMEX'
        )
      })

      it('should not set the `paymentType` if not a payment card', () => {
        const component = renderComponent({
          ...baseProps,
        })
        const setFieldHandler = component.wrapper
          .find('.CardPaymentMethod-cardNumber')
          .prop('setField')
        setFieldHandler()({ target: { value: '4444333322221111' } })
        expect(setAndValidateFormFieldStub).not.toHaveBeenCalledWith(
          'billingCardDetails',
          'paymentType',
          'VISA'
        )
      })

      it('should not set the `paymentType` if `paymentType` hasn’t changed', () => {
        const props = {
          ...baseProps,
          isPaymentCard: true,
          paymentType: 'VISA',
        }
        const component = renderComponent(props)
        const setFieldHandler = component.wrapper
          .find('.CardPaymentMethod-cardNumber')
          .prop('setField')
        setFieldHandler()({ target: { value: '4444333322221111' } })
        expect(setAndValidateFormFieldStub).not.toHaveBeenCalledWith(
          'billingCardDetails',
          'paymentType',
          'VISA'
        )
      })

      it('should be able to touch the card number field', () => {
        const component = renderComponent(baseProps)
        const touchedFieldHandler = component.wrapper
          .find('.CardPaymentMethod-cardNumber')
          .prop('touchedField')
        touchedFieldHandler('cardNumber')()
        expect(touchedFormFieldStub).toHaveBeenCalledWith(
          'billingCardDetails',
          'cardNumber'
        )
      })
    })

    describe('Expiry Date', () => {
      describe('Expiry Date is not set', () => {
        it('if value exeeds maxLengthExpiryDate ', () => {
          const component = renderComponent(baseProps)
          component.instance.setAndValidateExpiryDate()({
            target: { value: '12799424' },
          })

          expect(setFormFieldStub).not.toHaveBeenCalled()
          expect(validateFormFieldStub).not.toHaveBeenCalled()
        })
        it('if value isCardExpiryYearInvalid is true ', () => {
          const component = renderComponent(baseProps)
          component.instance.setAndValidateExpiryDate()({
            target: { value: '2032' },
          })

          expect(setFormFieldStub).not.toHaveBeenCalled()
          expect(validateFormFieldStub).not.toHaveBeenCalled()
        })
      })
      describe('Expiry Date is set and formated', () => {
        it('should be able to set the expiry Date with 1 digit', () => {
          const component = renderComponent(baseProps)
          component.instance.setAndValidateExpiryDate()({
            target: { value: '1' },
          })

          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryDate',
            '1'
          )
          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryYear',
            '20undefined'
          )
          expect(validateFormFieldStub).toHaveBeenCalled()
          expect(validateFormFieldStub).toHaveBeenCalled()
        })
        it('should be able to set the expiry Date with 2 digit', () => {
          const component = renderComponent(baseProps)
          component.instance.setAndValidateExpiryDate()({
            target: { value: '02' },
          })

          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryDate',
            '02 / '
          )
          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryYear',
            '202'
          )
          expect(validateFormFieldStub).toHaveBeenCalled()
          expect(validateFormFieldStub).toHaveBeenCalled()
        })
        it('should be able to set the expiry Date with 3 digit', () => {
          const component = renderComponent(baseProps)
          component.instance.setAndValidateExpiryDate()({
            target: { value: '022' },
          })

          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryDate',
            '02 / 2'
          )
          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryYear',
            '202'
          )
          expect(validateFormFieldStub).toHaveBeenCalled()
          expect(validateFormFieldStub).toHaveBeenCalled()
        })
        it('should be able to set the expiry Date with 4 digit', () => {
          const component = renderComponent(baseProps)
          component.instance.setAndValidateExpiryDate()({
            target: { value: '0223' },
          })

          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryDate',
            '02 / 23'
          )
          expect(setFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryYear',
            '2023'
          )
          expect(validateFormFieldStub).toHaveBeenCalled()
          expect(validateFormFieldStub).toHaveBeenCalled()
        })
      })
      describe('Expiry Date events', () => {
        it('should call validateFormField on blur', () => {
          const component = renderComponent(baseProps)
          const onBlurHandler = component.wrapper
            .find('.CardPaymentMethod-expiryDate')
            .prop('onBlur')
          onBlurHandler()
          expect(validateFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryDate',
            []
          )
        })

        it('should set to touched on blur', () => {
          const component = renderComponent(baseProps)
          const onBlurHandler = component.wrapper
            .find('.CardPaymentMethod-expiryDate')
            .prop('onBlur')
          onBlurHandler()
          expect(touchedFormFieldStub).toHaveBeenCalledWith(
            'billingCardDetails',
            'expiryDate'
          )
        })

        it('should call `sendAnalyticsValidationState` on Blur', () => {
          const analyticsSpy = jest.fn()
          const { wrapper } = renderComponent({
            ...baseProps,
            sendAnalyticsValidationState: analyticsSpy,
          })
          const onBlurHandler = wrapper
            .find('.CardPaymentMethod-expiryDate')
            .prop('onBlur')
          onBlurHandler()
          expect(analyticsSpy).toHaveBeenCalledTimes(1)
        })

        it('should call `sendAnalyticsValidationState` with validation `failure` if expiryMonth error exists onBlur', () => {
          const analyticsSpy = jest.fn()
          const { wrapper } = renderComponent({
            ...baseProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: {
              expiryMonth: 'some error',
            },
            expiryMonthField: {
              isDirty: true,
            },
          })
          const onBlurHandler = wrapper
            .find('.CardPaymentMethod-expiryDate')
            .prop('onBlur')
          onBlurHandler()
          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          expect(analyticsSpy).toHaveBeenCalledWith({
            id: 'expiryDate',
            validationStatus: 'failure',
          })
        })

        it('should call `sendAnalyticsValidationState` with validation `success` if expiryMonth error doesnt exist', () => {
          const analyticsSpy = jest.fn()
          const { wrapper } = renderComponent({
            ...baseProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: {
              irrelevantField: 'some error',
            },
          })
          const onBlurHandler = wrapper
            .find('.CardPaymentMethod-expiryDate')
            .prop('onBlur')
          onBlurHandler()
          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          expect(analyticsSpy).toHaveBeenCalledWith({
            id: 'expiryDate',
            validationStatus: 'success',
          })
        })
      })
    })

    describe('CVV', () => {
      it('should be able to set the cvv', () => {
        const component = renderComponent(baseProps)
        const setFieldHandler = component.wrapper
          .find('CVVField')
          .prop('setField')
        setFieldHandler('cvv')({ target: { value: '123' } })
        expect(setAndValidateFormFieldStub).toHaveBeenCalledWith(
          'billingCardDetails',
          'cvv',
          '123',
          []
        )
      })

      it('should be able to touch the cvv field', () => {
        const component = renderComponent(baseProps)
        const touchedFieldHandler = component.wrapper
          .find('CVVField')
          .prop('touchedField')
        touchedFieldHandler('cvv')()
        expect(touchedFormFieldStub).toHaveBeenCalledWith(
          'billingCardDetails',
          'cvv'
        )
      })
    })

    describe('Reset errors', () => {
      it('clears the form errors when the payment type has changed', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          paymentType: 'VISA',
        })
        wrapper.setProps({ paymentType: 'AMEX' })
        expect(baseProps.clearErrors).toHaveBeenCalled()
      })
    })
  })
})

// TODO: Look into the proper way to do dateMock.mockRestore()
