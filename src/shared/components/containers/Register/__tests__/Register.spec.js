import { mapObjIndexed, prop, clone, compose } from 'ramda'
import deepFreeze from 'deep-freeze'
import testComponentHelper, {
  withStore,
  mountRender,
  buildComponentRender,
} from 'test/unit/helpers/test-component'

import Register from '../Register'
import {
  GTM_CATEGORY,
  GTM_ACTION,
  ANALYTICS_ERROR,
} from '../../../../analytics/analytics-constants'

jest.mock('../../../../lib/user-agent', () => ({
  isIOS: jest.fn(() => false),
}))

const defaultValues = {
  email: '',
  password: '',
  subscribe: false,
  rememberMeRegister: false,
}

describe('<Register />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const initialProps = deepFreeze({
    registrationForm: {
      fields: {
        email: {
          value: 'elroy@arcadia.com',
        },
        password: {
          value: 'Password1',
        },
        subscribe: {
          value: true,
        },
        rememberMeRegister: {
          value: true,
        },
      },
    },
    setFormField: jest.fn(),
    sendAnalyticsClickEvent: jest.fn(),
    sendAnalyticsErrorMessage: jest.fn(),
    touchedFormField: jest.fn(),
    resetForm: jest.fn(),
    registerUser: jest.fn(),
    brandName: 'missselfridge',
    region: 'uk',
    source: 'MYACCOUNT',
    getNextRoute: jest.fn(),
    isFeatureRememberMeEnabled: true,
  })

  const registerFormWithError = deepFreeze({
    ...initialProps,
    registrationForm: {
      ...initialProps.registrationForm,
      message: {
        message: 'this is a fake Message',
        type: 'error',
      },
    },
  })

  const renderComponent = testComponentHelper(Register.WrappedComponent)

  const render = compose(
    mountRender,
    withStore({
      config: {
        brandName: 'XXXXX',
        brandCode: 'XXXXX',
      },
      forms: {
        login: {
          fields: {},
        },
      },
    })
  )
  const mountComponent = buildComponentRender(render, Register.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('in error state', () => {
      expect(
        renderComponent(
          deepFreeze({
            ...initialProps,
            registrationForm: {
              fields: {
                email: {},
                password: {},
                subscribe: {},
                rememberMe: {},
              },
            },
          })
        ).getTree()
      ).toMatchSnapshot()
    })

    it('with registrationForm having message', () => {
      expect(
        renderComponent(deepFreeze(registerFormWithError)).getTree()
      ).toMatchSnapshot()
    })

    describe('Guest Checkout', () => {
      const state = {
        ...initialProps,
        isGuestCheckoutForm: true,
      }
      it('should not display the email field if rendered in the Thank you page', () => {
        expect(renderComponent(state).getTree()).toMatchSnapshot()
      })
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      it('should call resetForm', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.resetForm).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenLastCalledWith(
          'register',
          defaultValues
        )
      })
    })
  })

  describe('@events', () => {
    let renderedComponent
    const event = deepFreeze({
      target: {
        value: 123,
        checked: true,
      },
      preventDefault: jest.fn(),
    })

    beforeEach(() => {
      renderedComponent = renderComponent(initialProps)
      jest.resetAllMocks()
    })

    describe('email Input', () => {
      const field = 'email'

      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('setField')(field)(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'register',
          field,
          event.target.value
        )
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.touchedFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('touchedField')(field)(
          event
        )
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'register',
          field
        )
      })
    })

    describe('password Input', () => {
      const field = 'password'

      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('setField')(field)(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'register',
          field,
          event.target.value
        )
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.touchedFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('touchedField')(field)(
          event
        )
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'register',
          field
        )
      })
    })

    describe('subscribe Checkbox', () => {
      const field = 'subscribe'

      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedCheckbox = wrapper.find('Connect(Checkbox)')
        connectedCheckbox.find(`[name="${field}"]`).simulate('change', event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'register',
          field,
          event.target.checked
        )
      })
    })

    describe('rememberMeRegister Checkbox', () => {
      const field = 'rememberMeRegister'
      it('should not show if isFeatureRememberMeEnabled is false', () => {
        const { wrapper } = mountComponent({
          ...initialProps,
          isFeatureRememberMeEnabled: false,
        })
        expect(wrapper.find('input[name="rememberMeRegister"]')).toHaveLength(0)
      })

      it('should show if isFeatureRememberMeEnabled is true', () => {
        const { wrapper } = mountComponent({
          ...initialProps,
          isFeatureRememberMeEnabled: true,
        })
        expect(wrapper.find('input[name="rememberMeRegister"]')).toHaveLength(1)
      })

      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedCheckbox = wrapper.find('Connect(Checkbox)')
        connectedCheckbox.find(`[name="${field}"]`).simulate('change', event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'register',
          field,
          event.target.checked
        )
      })
    })

    describe('submit form', () => {
      it('should call e.preventDefault() ', () => {
        const { wrapper } = renderedComponent
        expect(event.preventDefault).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })

      it('should not call analytics methods when there are no input values and no error message', () => {
        const props = clone(initialProps)
        props.registrationForm.fields.email = ''
        props.registrationForm.fields.password = ''
        const { wrapper, instance } = renderComponent(props)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledWith(
          ANALYTICS_ERROR.REGISTRATION_FAILED
        )
      })

      it('should call sendAnalyticsErrorMessage() when user submits form with incorrect validation', () => {
        const props = clone(initialProps)
        props.registrationForm.fields.email = ''
        props.registrationForm.fields.password = 'testpassword12345'
        const { wrapper, instance } = renderComponent(props)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledWith(
          ANALYTICS_ERROR.REGISTRATION_FAILED
        )
      })

      it('should call analytics methods when there are input values', () => {
        const { instance, wrapper } = renderComponent(registerFormWithError)
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.REGISTER,
          action: GTM_ACTION.SUBMIT,
          label: 'register-in-button',
          rememberMe:
            registerFormWithError.registrationForm.fields.rememberMeRegister
              .value,
        })
      })

      it('should call registerUser if no errors', () => {
        const { instance, wrapper } = renderedComponent
        const {
          getNextRoute,
          successCallback,
          errorCallback,
          registerUser,
          registrationForm,
        } = instance.props
        let formData = mapObjIndexed(prop('value'), registrationForm.fields)
        formData = {
          ...formData,
          source: 'MYACCOUNT',
          passwordConfirm: formData.password,
          // rename rememberMeRegister -> rememberMe
          rememberMe: formData.rememberMeRegister,
          rememberMeRegister: undefined,
          mergeGuestOrder: false,
        }
        instance.getErrors = jest.fn(() => ({}))
        expect(registerUser).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(registerUser).toHaveBeenCalledTimes(1)
        expect(registerUser).toHaveBeenLastCalledWith({
          formData,
          getNextRoute,
          successCallback,
          errorCallback,
        })
      })

      it('should not call registerUser if errors', () => {
        const { instance, wrapper } = renderedComponent
        instance.getErrors = jest.fn(() => ({
          email: 'has errors',
        }))
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.registerUser).not.toHaveBeenCalled()
      })
    })
  })
})
