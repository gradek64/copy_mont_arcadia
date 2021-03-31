import {
  buildComponentRender,
  shallowRender,
  withStore,
} from 'test/unit/helpers/test-component'
import { compose } from 'ramda'
import MyCheckoutDetails, {
  composeFindAdressValidationSchema,
  composeAdressValidationSchema,
  composeDetailsValidationSchema,
  composeSelectedPaymentMethodType,
} from '../MyCheckoutDetails'
import { mockStoreCreator } from '../../../../../../test/unit/helpers/get-redux-mock-store'
import myCheckoutDetailsMocks from '../../../../../../test/mocks/forms/myCheckoutDetailsFormsMocks'
import configMock from '../../../../../../test/mocks/config'
import { paymentMethodsList } from '../../../../../../test/mocks/paymentMethodsMocks'
import siteOptionsMock from '../../../../../../test/mocks/siteOptions'
import myAccountMock from '../../../../../../test/mocks/myAccount-response.json'
import { getMyCheckoutDetailsData } from '../../../../actions/common/accountActions'
import {
  scrollElementIntoView,
  scrollToTop,
} from '../../../../lib/scroll-helper'
import { browserHistory } from 'react-router'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
    goBack: jest.fn(),
  },
}))
jest.mock('../../../../actions/common/accountActions', () => ({
  getMyCheckoutDetailsData: jest.fn(),
  updateMyCheckoutDetails: jest.fn(),
  setDeliveryFormsFromBillingForms: jest.fn(),
  setMyCheckoutDetailsInitialFocus: jest.fn(),
}))
jest.mock('../../../../lib/scroll-helper')

describe('<MyCheckoutDetails />', () => {
  const renderComponent = buildComponentRender(
    shallowRender,
    MyCheckoutDetails.WrappedComponent.WrappedComponent
  )
  const initialProps = {
    user: myAccountMock,
    myCheckoutDetailsForm: {
      fields: {
        isDeliveryAndBillingAddressEqual: {},
      },
    },
    isEnabledEditing: false,
    visited: [],
    getAllPaymentMethods: () => {},
    getMyCheckoutDetailsData: () => {},
    setFormField: () => {},
    updateMyCheckoutDetails: () => {},
    setDeliveryFormsFromBillingForms: () => {},
    touchedFormField: () => {},
    setMyCheckoutDetailsInitialFocus: () => {},
    setFormMessage: () => {},
  }

  describe('@renders', () => {
    const renderedComponent = renderComponent({
      ...initialProps,
    })
    const { wrapper } = renderedComponent

    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('should have My Checkout Details header', () => {
      const node = wrapper.find('AccountHeader')
      expect(renderedComponent.getTreeFor(node)).toMatchSnapshot()
      expect(node).toHaveLength(1)
    })
    it('should have Back to My Account button', () => {
      const node = wrapper.find('AccountHeader').prop('label')
      expect(node).toBe('Back to My Account')
    })
    it('should render Delivery Details, Billing Details and Payment Details', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('should show error Message when myCheckoutDetailsForm has error message', () => {
      expect(
        renderComponent({
          ...initialProps,
          myCheckoutDetailsForm: {
            fields: {
              isDeliveryAndBillingAddressEqual: {},
            },
            message: {
              message: 'unexpected error',
              type: 'error',
            },
          },
          isEnabledEditing: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('should show confirm Message when myCheckoutDetailsForm has confirm message', () => {
      expect(
        renderComponent({
          ...initialProps,
          myCheckoutDetailsForm: {
            fields: {
              isDeliveryAndBillingAddressEqual: {},
            },
            message: {
              message: 'Changes Saved!',
              type: 'confirm',
            },
          },
          isEnabledEditing: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the DDP component if DDP feature flag is set to true, the user DDP subscription set to true and isFeatureDDPRenewable is set to false', () => {
      const renderedComponent = renderComponent({
        ...initialProps,
        isFeatureDDPEnabled: true,
        isCurrentOrRecentDDPSubscriber: true,
        isFeatureDDPRenewable: false,
      })
      const { wrapper } = renderedComponent
      expect(wrapper.find('DDPSubscription').exists()).toEqual(true)
      expect(wrapper.find('DDPSubscription').prop('user')).toEqual(
        initialProps.user
      )
    })
    it('should not render the DDP component if DDP feature flag is set to true and the user DDP subscription set to false', () => {
      const renderedComponent = renderComponent({
        ...initialProps,
        isFeatureDDPEnabled: true,
        isCurrentOrRecentDDPSubscriber: false,
      })
      const { wrapper } = renderedComponent
      expect(wrapper.find('DDPSubscription').exists()).toEqual(false)
    })
    it('should not render the DDP component if DDP feature flag is set to false and the user DDP subscription set to true', () => {
      const renderedComponent = renderComponent({
        ...initialProps,
        isFeatureDDPEnabled: false,
        isCurrentOrRecentDDPSubscriber: true,
      })
      const { wrapper } = renderedComponent
      expect(wrapper.find('DDPSubscription').exists()).toEqual(false)
    })

    it('should not mount the DDPRenewal component when `isEnabledEditing` is equal to true', () => {
      expect(
        renderComponent({ ...initialProps, isEnabledEditing: true }).getTree()
      ).toMatchSnapshot()
    })

    it('should mount the DDPRenewal component when `isEnabledEditing` is equal to false', () => {
      expect(
        renderComponent({ ...initialProps, isEnabledEditing: false }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@needs', () => {
    it('should call getMyCheckoutDetailsData()', () => {
      expect(getMyCheckoutDetailsData).not.toHaveBeenCalled()
      MyCheckoutDetails.WrappedComponent.WrappedComponent.needs[0]()
      expect(getMyCheckoutDetailsData).toHaveBeenCalledTimes(1)
    })
  })

  describe('@lifeCycle', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
        return selector === `#initial-focus-test-selector`
          ? 'initial-focus-element'
          : 'select'
      })
    })
    global.process.browser = true
    const allStates = {
      ...initialProps,
      visited: ['somepath', 'otherpath'],
      getAllPaymentMethods: jest.fn(),
      getMyCheckoutDetailsData: jest.fn(),
      setFormMessage: jest.fn(),
      scrollElementIntoView: jest.fn(),
      isEnabledEditing: true,
      initialFocus: '#initial-focus-test-selector',
      billingAddressForm: {
        fields: {
          address1: {
            value: 'A',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          address2: {
            value: 'B',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          postcode: {
            value: 'C',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          city: {
            value: 'D',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          country: {
            value: 'E',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          county: {
            value: 'F',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          state: {
            value: 'G',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          isManual: {
            value: 'H',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        },
        isLoading: false,
        errors: {},
        message: {},
      },
      billingDetailsForm: {
        fields: {
          title: {
            value: 'A',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          firstName: {
            value: 'B',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          lastName: {
            value: 'C',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          telephone: {
            value: 'D',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        },
        isLoading: false,
        errors: {},
        message: {},
      },
      deliveryAddressForm: {
        fields: {
          address1: {
            value: 'A',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          address2: {
            value: 'B',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          postcode: {
            value: 'C',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          city: {
            value: 'D',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          country: {
            value: 'E',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          county: {
            value: 'F',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          state: {
            value: 'G',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          isManual: {
            value: 'H',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        },
        isLoading: false,
        errors: {},
        message: {},
      },
      deliveryDetailsForm: {
        fields: {
          title: {
            value: 'A',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          firstName: {
            value: 'B',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          lastName: {
            value: 'C',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
          telephone: {
            value: 'D',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        },
        isLoading: false,
        errors: {},
        message: {},
      },
      myCheckoutDetailsForm: {
        fields: {
          isDeliveryAndBillingAddressEqual: {
            value: '',
            isDirty: false,
            isTouched: false,
            isFocused: false,
          },
        },
        isLoading: false,
        errors: {},
        message: '',
      },
      paymentMethods: [],
      setMyCheckoutDetailsInitialFocus: jest.fn(),
      setFormField: jest.fn(),
      resetForm: jest.fn(),
    }
    const renderedComponent = renderComponent(allStates)
    const { instance } = renderedComponent

    const checkFieldNotTrue = (form, field) => {
      const updated = JSON.parse(JSON.stringify(allStates))
      const oldValue = updated[form].fields[field].value
      updated[form].fields[field].isDirty = true
      updated[form].fields[field].value = `${oldValue}TEST`
      instance.UNSAFE_componentWillReceiveProps(updated)
      expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
      expect(instance.props.setFormField).toHaveBeenCalledWith(
        'myCheckoutDetailsForm',
        'isDeliveryAndBillingAddressEqual',
        false
      )

      updated[form].fields[field].value = oldValue
      updated[form].fields[field].isDirty = true
      instance.UNSAFE_componentWillReceiveProps(updated)
      expect(instance.props.setFormField).toHaveBeenCalledTimes(2)
      expect(instance.props.setFormField).toHaveBeenCalledWith(
        'myCheckoutDetailsForm',
        'isDeliveryAndBillingAddressEqual',
        true
      )
    }

    describe('UNSAFE_componentWillReceiveProps', () => {
      it('will call resetForm if the delivery/billing address1 is empty', () => {
        instance.UNSAFE_componentWillReceiveProps({
          ...allStates,
          deliveryAddressForm: {
            ...allStates.deliveryAddressForm,
            fields: {
              ...allStates.deliveryAddressForm.fields,
              address1: {
                value: '',
                isDirty: true,
                isTouched: false,
                isFocused: false,
              },
            },
          },
        })

        expect(instance.props.resetForm).toHaveBeenCalled()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)

        instance.UNSAFE_componentWillReceiveProps({
          ...allStates,
          billingAddressForm: {
            ...allStates.billingAddressForm,
            fields: {
              ...allStates.billingAddressForm.fields,
              address1: {
                value: '',
                isDirty: true,
                isTouched: false,
                isFocused: false,
              },
            },
          },
        })

        expect(instance.props.resetForm).toHaveBeenCalled()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(2)
      })

      it('will not call resetForm if the delivery/billing address1 is not empty', () => {
        instance.UNSAFE_componentWillReceiveProps({
          ...allStates,
          deliveryAddressForm: {
            ...allStates.deliveryAddressForm,
            fields: {
              ...allStates.deliveryAddressForm.fields,
              address1: {
                value: 'mock delivery address',
                isDirty: true,
                isTouched: false,
                isFocused: false,
              },
            },
          },
        })

        expect(instance.props.resetForm).toHaveBeenCalledTimes(0)

        instance.UNSAFE_componentWillReceiveProps({
          ...allStates,
          billingAddressForm: {
            ...allStates.billingAddressForm,
            fields: {
              ...allStates.billingAddressForm.fields,
              address1: {
                value: 'mock billing address',
                isDirty: true,
                isTouched: false,
                isFocused: false,
              },
            },
          },
        })

        expect(instance.props.resetForm).toHaveBeenCalledTimes(0)
      })

      it('will call setFieldToUpdate to false when first name has been updated', () => {
        checkFieldNotTrue('billingDetailsForm', 'firstName')
      })
      it('will call setFieldToUpdate to false when last name has been updated', () => {
        checkFieldNotTrue('billingDetailsForm', 'lastName')
      })
      it('will call setFieldToUpdate to false when title has been updated', () => {
        checkFieldNotTrue('billingDetailsForm', 'title')
      })
      it('will call setFieldToUpdate to false when telephone has been updated', () => {
        checkFieldNotTrue('billingDetailsForm', 'telephone')
      })
      it('will call setFieldToUpdate to false when first name has been updated', () => {
        checkFieldNotTrue('deliveryDetailsForm', 'firstName')
      })
      it('will call setFieldToUpdate to false when last name has been updated', () => {
        checkFieldNotTrue('deliveryDetailsForm', 'lastName')
      })
      it('will call setFieldToUpdate to false when title has been updated', () => {
        checkFieldNotTrue('deliveryDetailsForm', 'title')
      })
      it('will call setFieldToUpdate to false when telephone has been updated', () => {
        checkFieldNotTrue('deliveryDetailsForm', 'telephone')
      })
      it('will call setFieldToUpdate to false when address1 has been updated', () => {
        checkFieldNotTrue('deliveryAddressForm', 'address1')
      })
      it('will call setFieldToUpdate to false when address2 has been updated', () => {
        checkFieldNotTrue('deliveryAddressForm', 'address2')
      })
      it('will call setFieldToUpdate to false when city has been updated', () => {
        checkFieldNotTrue('deliveryAddressForm', 'city')
      })
      it('will call setFieldToUpdate to false when country has been updated', () => {
        checkFieldNotTrue('deliveryAddressForm', 'country')
      })
      it('will call setFieldToUpdate to false when state has been updated', () => {
        checkFieldNotTrue('deliveryAddressForm', 'state')
      })
      it('will call setFieldToUpdate to false when address1 has been updated', () => {
        checkFieldNotTrue('billingAddressForm', 'address1')
      })
      it('will call setFieldToUpdate to false when address2 has been updated', () => {
        checkFieldNotTrue('billingAddressForm', 'address2')
      })
      it('will call setFieldToUpdate to false when city has been updated', () => {
        checkFieldNotTrue('billingAddressForm', 'city')
      })
      it('will call setFieldToUpdate to false when country has been updated', () => {
        checkFieldNotTrue('billingAddressForm', 'country')
      })
      it('will call setFieldToUpdate to false when state has been updated', () => {
        checkFieldNotTrue('billingAddressForm', 'state')
      })
    })
    describe('componentDidMount', () => {
      it('should call getAllPaymentMethods and getMyCheckoutDetailsData', () => {
        instance.componentDidMount()
        expect(instance.props.getAllPaymentMethods).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenCalledWith(
          'myCheckoutDetailsForm',
          'isDeliveryAndBillingAddressEqual',
          true
        )
      })
    })
    it('componentDidUpdate', () => {
      instance.componentDidUpdate()
      expect(instance.props.scrollElementIntoView).toHaveBeenCalledWith(
        'initial-focus-element',
        0,
        10
      )
      expect(
        instance.props.setMyCheckoutDetailsInitialFocus
      ).toHaveBeenCalledWith(undefined)
    })
  })

  describe('@functions', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const state = {
      config: configMock,
      siteOptions: siteOptionsMock,
      forms: {
        account: {
          myCheckoutDetails: {
            billingAddressMCD: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
          },
        },
      },
    }
    const renderedComponent = renderComponent({
      ...initialProps,
      billingAddressForm: myCheckoutDetailsMocks.billingAddressMCD,
      billingDetailsForm: myCheckoutDetailsMocks.billingDetailsAddressMCD,
      billingFindAddressForm: myCheckoutDetailsMocks.billingFindAddressMCD,
      deliveryAddressForm: myCheckoutDetailsMocks.deliveryAddressMCD,
      deliveryDetailsForm: myCheckoutDetailsMocks.deliveryDetailsAddressMCD,
      deliveryFindAddressForm: myCheckoutDetailsMocks.deliveryFindAddressMCD,
      paymentCardDetailsMCD: myCheckoutDetailsMocks.paymentCardDetailsMCD,
      paymentMethodForm: {
        fields: {
          paymentType: {
            value: 'VISA',
          },
        },
      },
      touchedFormField: jest.fn(),
      updateMyCheckoutDetails: jest.fn(),
      setMyCheckoutDetailsInitialFocus: jest.fn(),
      setFormMessage: jest.fn(),
    })
    const { instance } = renderedComponent

    describe('saveAssemble', () => {
      it('should return assembled object', () => {
        expect(instance.saveAssemble()).toEqual({
          billingDetails: {
            nameAndPhone: {
              title: 'Mrs',
              firstName: 'Jose Billing',
              lastName: 'Quinto',
              telephone: '0980090980',
            },
            address: {
              address1: '35 Britten Close',
              address2: '',
              city: 'LONDON',
              state: '',
              country: 'Samoa',
              postcode: 'NW11 7HQ',
            },
          },
          deliveryDetails: {
            nameAndPhone: {
              title: 'Mr',
              firstName: 'Jose',
              lastName: 'Quinto',
              telephone: '0980090980',
            },
            address: {
              address1: '2 Britten Close',
              address2: null,
              city: 'LONDON',
              state: 'CO',
              country: 'United Kingdom',
              postcode: 'NW11 7HQ',
            },
          },
          creditCard: {
            expiryYear: '2017',
            expiryMonth: '11',
            type: 'VISA',
            cardNumber: '1111222233334444',
          },
        })
      })
      it('should return with hack when selectedPaymentMethodType === OTHER', () => {
        const renderedComponent = renderComponent({
          ...initialProps,
          billingAddressForm: myCheckoutDetailsMocks.billingAddressMCD,
          billingDetailsForm: myCheckoutDetailsMocks.billingDetailsAddressMCD,
          billingFindAddressForm: myCheckoutDetailsMocks.billingFindAddressMCD,
          deliveryAddressForm: myCheckoutDetailsMocks.deliveryAddressMCD,
          deliveryDetailsForm: myCheckoutDetailsMocks.deliveryDetailsAddressMCD,
          deliveryFindAddressForm:
            myCheckoutDetailsMocks.deliveryFindAddressMCD,
          paymentCardDetailsMCD: myCheckoutDetailsMocks.paymentCardDetailsMCD,
          paymentMethodForm: {
            fields: {
              paymentType: {
                value: 'PYPAL',
              },
            },
          },
          selectedPaymentMethodType: 'OTHER',
        })
        const { instance } = renderedComponent
        expect(instance.saveAssemble()).toEqual(
          expect.objectContaining({
            creditCard: {
              expiryYear: expect.any(Number),
              expiryMonth: expect.any(Number),
              type: 'PYPAL',
              cardNumber: '0',
            },
          })
        )
      })
    })

    describe('validateForm', () => {
      const schema = composeAdressValidationSchema(state, 'billingMCD')
      const formName = 'billingAddressMCD'
      it('validateForm is true', () => {
        const formData = instance.saveAssemble().billingDetails.address
        const validation = instance.validateForm(schema, formData, formName)
        expect(validation).toBe(true)
      })
      it('validateForm is false', () => {
        const validation = instance.validateForm(schema, {}, formName)
        expect(validation).toBe(false)
        expect(instance.props.touchedFormField).toHaveBeenCalledWith(
          'billingAddressMCD',
          'address1'
        )
      })
    })

    describe('handleLinkClick', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      it('should not call browserHistory.push when isEnableEditing === false', () => {
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
        instance.handleLinkClick({ preventDefault: () => {} })
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
      })
      it('should call browserHistory.push when isEnableEditing === true', () => {
        const renderedComponent = renderComponent({
          ...initialProps,
          isEnabledEditing: true,
        })
        const { instance } = renderedComponent
        expect(browserHistory.push).toHaveBeenCalledTimes(0)
        instance.handleLinkClick({ preventDefault: () => {} })
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith('/my-account/details')
      })
      it('should call browserHistory.goBack when isEnableEditing === true and listVisited `/my-account/details`', () => {
        const renderedComponent = renderComponent({
          ...initialProps,
          isEnabledEditing: true,
          visited: [
            '/my-account',
            '/my-account/details',
            '/my-account/details/edit',
          ],
        })
        const { instance } = renderedComponent
        expect(browserHistory.goBack).toHaveBeenCalledTimes(0)
        instance.handleLinkClick({ preventDefault: () => {} })
        expect(browserHistory.goBack).toHaveBeenCalledTimes(1)
      })
    })

    describe('scrollToFirstError', () => {
      global.process.browser = true
      beforeEach(() => {
        jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
          return selector === `.MyCheckoutDetails .Input-address1`
            ? 'address1'
            : 'select'
        })
      })
      it('should call scrollElementInView for input', () => {
        instance.scrollToFirstError('address1')
        expect(scrollElementIntoView).toHaveBeenCalledWith('address1', 400, 20)
      })
      it('should call scrollElementInView for select', () => {
        instance.scrollToFirstError('select')
        expect(scrollElementIntoView).toHaveBeenCalledWith('select', 400, 20)
      })
    })

    describe('validateForms', () => {
      it('should call saveAssemble', () => {
        const saveAssembleSpy = jest.spyOn(instance, 'saveAssemble')
        expect(saveAssembleSpy).toHaveBeenCalledTimes(0)
        instance.validateForms()
        expect(saveAssembleSpy).toHaveBeenCalledTimes(1)
      })
      it('should call validateForm 7 times', () => {
        const validateFormSpy = jest.spyOn(instance, 'validateForm')
        expect(validateFormSpy).toHaveBeenCalledTimes(0)
        instance.validateForms()
        expect(validateFormSpy).toHaveBeenCalledTimes(7)
      })
      it('should return true', () => {
        expect(instance.validateForms()).toBe(true)
      })
    })

    describe('handleSaveMyCheckoutDetails', () => {
      it('should call updateMyCheckoutDetails', () => {
        instance.handleSaveMyCheckoutDetails()
        const assemble = instance.saveAssemble()
        expect(instance.props.updateMyCheckoutDetails).toHaveBeenCalledWith(
          assemble,
          'myCheckoutDetailsForm'
        )
      })

      it('should scroll to top on success', async () => {
        jest.spyOn(instance, 'validateForms').mockReturnValueOnce(true)

        instance.props.updateMyCheckoutDetails.mockReturnValueOnce(
          Promise.resolve()
        )

        await instance.handleSaveMyCheckoutDetails()

        expect(scrollToTop).toHaveBeenCalled()
      })

      it('should not scroll to top if the form has invalid values', async () => {
        jest.spyOn(instance, 'validateForms').mockReturnValueOnce(false)
        await instance.handleSaveMyCheckoutDetails()

        expect(scrollToTop).not.toHaveBeenCalled()
      })

      it('should not scroll to top on failure to update', async () => {
        jest.spyOn(instance, 'validateForms').mockReturnValueOnce(true)

        instance.props.updateMyCheckoutDetails.mockReturnValueOnce(
          Promise.reject('boom')
        )

        try {
          await instance.handleSaveMyCheckoutDetails()

          global.fail('Expected error to have been thrown')
        } catch (e) {
          // expected
          expect(scrollToTop).not.toHaveBeenCalled()
        }
      })
    })
  })

  describe('@component helpers', () => {
    const initialState = {
      // that's required for getFindAddressIsVisible
      config: configMock,
      siteOptions: siteOptionsMock,
      forms: {
        account: {
          myCheckoutDetails: {
            billingAddressMCD: {
              fields: {
                // that's required for getPostCodeRules and getFindAddressIsVisible
                country: {
                  value: 'United States',
                },
              },
            },
          },
        },
      },
      account: {
        user: {
          billingDetails: {
            addressDetailsId: 1,
          },
        },
      },
    }
    const store = mockStoreCreator(initialState)
    const state = store.getState()
    describe('composeFindAdressValidationSchema', () => {
      it('should return {} as find address validation schema by default', () => {
        const schema = composeFindAdressValidationSchema({}, 'billingMCD')
        expect(schema).toEqual({})
      })
      describe('isFindAddressVisible is true', () => {
        it('should return valid find address validation schema when isFindAddressVisible', () => {
          const schema = composeFindAdressValidationSchema(state, 'billingMCD')
          expect(schema).toEqual({
            postcode: ['required', expect.any(Function), 'noEmoji'],
            houseNumber: 'noEmoji',
            findAddress: expect.any(Function),
            selectAddress: expect.any(Function),
          })
        })
      })
    })
    describe('composeAdressValidationSchema', () => {
      it('should return this schema when country is set to United States', () => {
        const schema = composeAdressValidationSchema(state, 'billingMCD')
        expect(schema).toEqual({
          address1: ['required', 'noEmoji', expect.any(Function)],
          address2: ['noEmoji', expect.any(Function)],
          postcode: ['required', expect.any(Function), 'noEmoji'],
          city: ['required', 'noEmoji', expect.any(Function)],
          country: ['required', expect.any(Function)],
        })
      })
      it('should return this schema when country is NOT set', () => {
        const schema = composeAdressValidationSchema({}, 'billingMCD')
        expect(schema).toEqual({
          address1: ['required', 'noEmoji', expect.any(Function)],
          address2: ['noEmoji', expect.any(Function)],
          postcode: ['noEmoji'],
          city: ['required', 'noEmoji', expect.any(Function)],
          country: ['required', expect.any(Function)],
        })
      })
    })
    describe('composeDetailsValidationSchema', () => {
      it('should return this schema when country is set to United States', () => {
        const schema = composeDetailsValidationSchema(state, 'billingMCD')
        expect(schema).toEqual({
          firstName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          lastName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          telephone: ['required', 'usPhoneNumber', 'noEmoji'],
        })
      })
    })
    describe('composeSelectedPaymentMethodType', () => {
      it('should return CARD when user data is CARD', () => {
        const paymentMethodType = composeSelectedPaymentMethodType(state)
        expect(paymentMethodType).toEqual('CARD')
      })
    })
  })

  describe('@connected component', () => {
    const initialState = {
      config: configMock,
      paymentMethods: paymentMethodsList,
      forms: {
        account: {
          myCheckoutDetails: {
            billingDetailsAddressMCD: {
              fields: {
                telephone: {
                  value: '1234567890',
                },
              },
            },
            billingAddressMCD: {
              fields: {
                country: {
                  value: 'United States',
                },
              },
            },
            billingFindAddressMCD: {
              fields: {
                houseNumber: {
                  value: '1',
                },
              },
            },
            deliveryDetailsAddressMCD: {
              fields: {
                firstName: {
                  value: 'Jose',
                },
              },
            },
            deliveryAddressMCD: {
              fields: {
                country: {
                  value: 'United Kingdom',
                },
              },
            },
            deliveryFindAddressMCD: {
              fields: {
                selectAddress: {
                  value: '35 Britten',
                },
              },
            },
            myCheckoutDetailsForm: {
              fields: {
                isDeliveryAndBillingAddressEqual: {},
              },
            },
            paymentCardDetailsMCD: {
              fields: {
                paymentType: {
                  value: 'VISA',
                },
              },
            },
          },
        },
      },
      account: {
        user: {
          billingDetails: {
            addressDetailsId: 1,
          },
        },
      },
    }
    const store = mockStoreCreator(initialState)
    const state = store.getState()
    const render = compose(
      shallowRender,
      withStore(state)
    )
    const renderComponent = buildComponentRender(
      render,
      MyCheckoutDetails.WrappedComponent
    )
    const { instance } = renderComponent()

    it('should wrap `MyCheckoutDetails` component', () => {
      expect(MyCheckoutDetails.WrappedComponent.WrappedComponent.name).toBe(
        'MyCheckoutDetails'
      )
    })

    describe('mapStateToProps', () => {
      it('should get myCheckoutDetailsForm from state', () => {
        const prop = instance.stateProps.myCheckoutDetailsForm
        expect(prop).toEqual({
          fields: { isDeliveryAndBillingAddressEqual: {} },
        })
      })
      it('should get isEnabledEditing from state', () => {
        const prop = instance.stateProps.isEnabledEditing
        expect(prop).toBe(false)
      })
      it('should get visited from state', () => {
        const prop = instance.stateProps.visited
        expect(prop).toEqual([])
      })
      it('should get billingAddressForm from state', () => {
        const prop = instance.stateProps.billingAddressForm
        expect(prop).toEqual({
          fields: { country: { value: 'United States' } },
        })
      })
      it('should get billingAddressFormValidationSchema from state', () => {
        const prop = instance.stateProps.billingAddressFormValidationSchema
        expect(prop).toEqual({
          address1: ['required', 'noEmoji', expect.any(Function)],
          address2: ['noEmoji', expect.any(Function)],
          postcode: ['required', expect.any(Function), 'noEmoji'],
          city: ['required', 'noEmoji', expect.any(Function)],
          country: ['required', expect.any(Function)],
        })
      })
      it('should get deliveryAddressForm from state', () => {
        const prop = instance.stateProps.deliveryAddressForm
        expect(prop).toEqual({
          fields: { country: { value: 'United Kingdom' } },
        })
      })
      it('should get deliveryAddressFormValidationSchema from state', () => {
        const prop = instance.stateProps.deliveryAddressFormValidationSchema
        expect(prop).toEqual({
          address1: ['required', 'noEmoji', expect.any(Function)],
          address2: ['noEmoji', expect.any(Function)],
          postcode: ['required', expect.any(Function), 'noEmoji'],
          city: ['required', 'noEmoji', expect.any(Function)],
          country: ['required', expect.any(Function)],
        })
      })
      it('should get billingDetailsForm from state', () => {
        const prop = instance.stateProps.billingDetailsForm
        expect(prop).toEqual({ fields: { telephone: { value: '1234567890' } } })
      })
      it('should get billingDetailsFormValidationSchema from state', () => {
        const prop = instance.stateProps.billingDetailsFormValidationSchema
        expect(prop).toEqual({
          firstName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          lastName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          telephone: ['required', 'usPhoneNumber', 'noEmoji'],
        })
      })
      it('should get deliveryDetailsForm from state', () => {
        const prop = instance.stateProps.deliveryDetailsForm
        expect(prop).toEqual({ fields: { firstName: { value: 'Jose' } } })
      })
      it('should get deliveryDetailsFormValidationSchema from state', () => {
        const prop = instance.stateProps.deliveryDetailsFormValidationSchema
        expect(prop).toEqual({
          firstName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          lastName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          telephone: ['required', 'ukPhoneNumber', 'noEmoji'],
        })
      })
      it('should get billingFindAddressForm from state', () => {
        const prop = instance.stateProps.billingFindAddressForm
        expect(prop).toEqual({ fields: { houseNumber: { value: '1' } } })
      })
      it('should get billingFindAddressFormValidationSchema from state', () => {
        const prop = instance.stateProps.billingFindAddressFormValidationSchema
        expect(prop).toEqual({
          postcode: ['required', expect.any(Function), 'noEmoji'],
          houseNumber: 'noEmoji',
          findAddress: expect.any(Function),
          selectAddress: expect.any(Function),
        })
      })
      it('should get deliveryFindAddressForm from state', () => {
        const prop = instance.stateProps.deliveryFindAddressForm
        expect(prop).toEqual({
          fields: { selectAddress: { value: '35 Britten' } },
        })
      })
      it('should get deliveryFindAddressFormValidationSchema from state', () => {
        const prop = instance.stateProps.deliveryFindAddressFormValidationSchema
        expect(prop).toEqual({
          postcode: ['required', expect.any(Function), 'noEmoji'],
          houseNumber: 'noEmoji',
          findAddress: expect.any(Function),
          selectAddress: expect.any(Function),
        })
      })
      it('should get paymentMethodForm from state', () => {
        const prop = instance.stateProps.paymentMethodForm
        expect(prop).toEqual({ fields: { paymentType: { value: 'VISA' } } })
      })
      it('should get paymentMethodFormValidationSchema from state', () => {
        const prop = instance.stateProps.paymentMethodFormValidationSchema
        expect(prop).toEqual({
          cardNumber: expect.any(Function),
          expiryDate: expect.any(Function),
          expiryMonth: expect.any(Function),
        })
      })
    })
    describe('mapDispatchToProps', () => {
      it('should return `setFormField` action', () => {
        expect(instance.dispatchProps.setFormField).toBeInstanceOf(Function)
      })
      it('should return `touchedFormField` action', () => {
        expect(instance.dispatchProps.touchedFormField).toBeInstanceOf(Function)
      })
      it('should return `setMyCheckoutDetailsInitialFocus` action', () => {
        expect(
          instance.dispatchProps.setMyCheckoutDetailsInitialFocus
        ).toBeInstanceOf(Function)
      })
    })
  })
})
