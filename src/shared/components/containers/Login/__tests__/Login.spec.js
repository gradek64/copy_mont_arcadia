import { clone, compose } from 'ramda'
import deepFreeze from 'deep-freeze'
import testComponentHelper, {
  withStore,
  mountRender,
  buildComponentRender,
} from 'test/unit/helpers/test-component'
import Login from '../Login'
import {
  GTM_CATEGORY,
  GTM_ACTION,
  ANALYTICS_ERROR,
} from '../../../../analytics/analytics-constants'

jest.mock('../../../../lib/user-agent', () => ({
  isIOS: jest.fn(() => false),
}))

const setPassword = (password) => ({
  loginForm: {
    fields: {
      password: {
        isFocused: password,
      },
    },
  },
})

describe('<Login />', () => {
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
  const mountComponent = buildComponentRender(render, Login.WrappedComponent)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const initialProps = deepFreeze({
    loginForm: {
      fields: {
        email: {
          value: 'elroy@arcadia.com',
        },
        password: {
          value: 'password1',
        },
        rememberMe: {
          value: false,
        },
      },
    },
    formName: 'customLogin',
    loginUser: jest.fn(),
    sendAnalyticsClickEvent: jest.fn(),
    sendAnalyticsErrorMessage: jest.fn(),
    setFormField: jest.fn(),
    touchedFormField: jest.fn(),
    resetForm: jest.fn(),
    setFormMessage: jest.fn(),
    touchedMultipleFormFields: jest.fn(),
    focusedFormField: jest.fn(),
    getNextRoute: jest.fn(),
    isFeatureRememberMeEnabled: true,
    isPartiallyAuthenticated: false,
  })
  const loginFormWithError = deepFreeze({
    ...initialProps,
    loginForm: {
      ...initialProps.loginForm,
      message: {
        message: 'this is a fake Message',
        type: 'normal',
      },
    },
  })
  const renderComponent = testComponentHelper(Login.WrappedComponent)

  const email = 'testuser@example.com'

  const emptyFields = deepFreeze({
    email: '',
    password: '',
  })

  const rememberMeFeatureEmptyFields = deepFreeze({
    email: '',
    password: '',
    rememberMe: false,
  })

  const rememberMeFeaturePrefilledFields = deepFreeze({
    email,
    password: '',
    rememberMe: true,
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('in error state', () => {
      expect(
        renderComponent({
          ...initialProps,
          loginForm: {
            fields: {
              email: {},
              password: {},
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('when password isfocused', () => {
      expect(
        renderComponent({
          ...initialProps,
          loginForm: {
            fields: {
              email: {},
              password: {
                isFocused: true,
              },
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with loginform having message', () => {
      expect(renderComponent(loginFormWithError).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      it('should call resetForm with empty values when Remember Me feature is disabled', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isFeatureRememberMeEnabled: false,
        })
        expect(instance.props.resetForm).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenLastCalledWith(
          'customLogin',
          emptyFields
        )
      })

      it('should call resetForm with empty values when Remember Me feature is enabled but user is not partially authenticated', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.resetForm).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenLastCalledWith(
          'customLogin',
          rememberMeFeatureEmptyFields
        )
      })

      it('should call resetForm with populated email and checkbox when Remember Me is enabled and user is partially authenticated', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isUserPartiallyAuthenticated: true,
          userEmail: email,
        })
        expect(instance.props.resetForm).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenLastCalledWith(
          'customLogin',
          rememberMeFeaturePrefilledFields
        )
      })
    })

    describe('componentDidUpdate', () => {
      beforeEach(() => jest.resetAllMocks())
      it('should call focusedFormField("customLogin", "password", false) when the password field is focused and was not focused', () => {
        const { instance } = renderComponent({
          ...initialProps,
          ...setPassword(true),
        })
        expect(instance.props.focusedFormField).not.toHaveBeenCalled()
        instance.componentDidUpdate(setPassword(false))
        expect(instance.props.focusedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.focusedFormField).toHaveBeenLastCalledWith(
          'customLogin',
          'password',
          false
        )
      })

      it('should not call focusedFormField() when the password field is not focused', () => {
        const { instance } = renderComponent({
          ...initialProps,
          ...setPassword(false),
        })
        instance.componentDidUpdate(setPassword(true))
        expect(instance.props.focusedFormField).not.toHaveBeenCalled()
      })

      it('should not call focusedFormField() when the password field is focused and was also focused', () => {
        const { instance } = renderComponent({
          ...initialProps,
          ...setPassword(true),
        })
        instance.componentDidUpdate(setPassword(true))
        expect(instance.props.focusedFormField).not.toHaveBeenCalled()
      })

      it('should reset the form if remember me feature flag value changes', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isFeatureRememberMeEnabled: true,
        })

        const resetForm = jest.spyOn(instance, 'resetForm')
        instance.componentDidUpdate({
          ...initialProps,
          isFeatureRememberMeEnabled: false,
        })

        expect(resetForm).toHaveBeenCalled()
      })
    })

    describe('@componentWillUnmount', () => {
      it('should call setFormMessage and resetForm', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.setFormMessage).not.toHaveBeenCalled()
        expect(instance.props.resetForm).not.toHaveBeenCalled()
        wrapper.unmount()
        expect(instance.props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormMessage).toHaveBeenLastCalledWith(
          'customLogin',
          {}
        )
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenLastCalledWith(
          'customLogin',
          rememberMeFeatureEmptyFields
        )
      })
    })
  })

  describe('@events', () => {
    let renderedComponent
    const event = {
      target: {
        value: 123,
      },
      preventDefault: jest.fn(),
    }
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
          'customLogin',
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
          'customLogin',
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
          'customLogin',
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
          'customLogin',
          field
        )
      })
    })

    describe('Remember me', () => {
      describe('Remember me checkbox', () => {
        const field = 'rememberMe'
        it('should not show if isFeatureRememberMeEnabled is false', () => {
          const { wrapper } = mountComponent({
            ...initialProps,
            isFeatureRememberMeEnabled: false,
          })
          expect(wrapper.find('input[name="rememberMe"]')).toHaveLength(0)
        })

        it('should show if isFeatureRememberMeEnabled is true', () => {
          const { wrapper } = mountComponent({
            ...initialProps,
            isFeatureRememberMeEnabled: true,
          })
          expect(wrapper.find('input[name="rememberMe"]')).toHaveLength(1)
        })

        it('should call setFormField when prop setField is called', () => {
          const { wrapper, instance } = renderedComponent
          expect(instance.props.setFormField).not.toHaveBeenCalled()
          const connectedCheckbox = wrapper.find('Connect(Checkbox)')
          connectedCheckbox.find(`[name="${field}"]`).simulate('change', event)
          expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenLastCalledWith(
            'customLogin',
            field,
            event.target.checked
          )
        })
        it('should call touchedFormField when prop touchedField is called', () => {
          const { wrapper, instance } = renderedComponent
          expect(instance.props.touchedFormField).not.toHaveBeenCalled()
          const connectedCheckbox = wrapper.find('Connect(Checkbox)')
          connectedCheckbox.find(`[name="${field}"]`).simulate('change', event)
          expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenLastCalledWith(
            'customLogin',
            field,
            event.target.checked
          )
        })
      })
      describe('Auto complete behaviour', () => {
        it('should set autocomplete props when not a partially authenticated user', () => {
          const { wrapper } = renderComponent(initialProps)

          const emailField = wrapper.find('#Login-email')
          const passwordField = wrapper.find('#Login-password')

          expect(emailField.prop('autocomplete')).toBe(undefined)
          expect(passwordField.prop('autocomplete')).toBe(undefined)
        })

        it('should set autocomplete props when user is partially authenticated', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isPartiallyAuthenticated: true,
          })

          const emailField = wrapper.find('#Login-email')

          const passwordField = wrapper.find('#Login-password')

          expect(emailField.prop('autocomplete')).toBe('off')
          expect(passwordField.prop('autocomplete')).toBe('on')
        })
      })
      describe('Form state', () => {
        it('should keep changing user email up to date', () => {
          const newEmail = 'next@email.com'
          const setFormField = jest.fn()
          const props = {
            ...initialProps,
            userEmail: newEmail,
            isFeatureRememberMeEnabled: true,
            setFormField,
          }

          const { instance } = renderComponent(props)
          const prevProps = {
            ...props,
            userEmail: 'someold@email.com',
          }

          instance.componentDidUpdate(prevProps)

          expect(setFormField).toHaveBeenCalledWith(
            'customLogin',
            'email',
            newEmail
          )
        })

        it("should keep not update email if it doesn't change", () => {
          const newEmail = 'next@email.com'
          const setFormField = jest.fn()
          const props = {
            ...initialProps,
            userEmail: newEmail,
            isFeatureRememberMeEnabled: true,
            setFormField,
          }

          const { instance } = renderComponent(props)
          const prevProps = props

          instance.componentDidUpdate(prevProps)

          expect(setFormField).not.toHaveBeenCalled()
        })
      })
    })

    describe('form submit', () => {
      it('should call e.preventDefault() ', () => {
        const { wrapper } = renderedComponent
        expect(event.preventDefault).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })

      it('should call touchedMultipleFormFields', () => {
        const { instance, wrapper } = renderedComponent
        expect(instance.props.touchedMultipleFormFields).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.touchedMultipleFormFields).toHaveBeenCalledTimes(
          1
        )
        expect(
          instance.props.touchedMultipleFormFields
        ).toHaveBeenLastCalledWith('customLogin', [
          'email',
          'password',
          'rememberMe',
        ])
      })

      it('call only sendAnalyticsErrorMessage() when there are no input values', () => {
        const props = clone(initialProps)
        props.loginForm.fields.email = ''
        props.loginForm.fields.password = ''
        const { wrapper, instance } = renderComponent(props)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledWith(
          ANALYTICS_ERROR.LOGIN_FAILED
        )
      })

      it('should call sendAnalayticsErrorMessage() when user submits form with incorrect validation', () => {
        const props = clone(initialProps)
        props.loginForm.fields.email = 'test@arcadiagroup.co.uk'
        props.loginForm.fields.password = ''
        const { wrapper, instance } = renderComponent(props)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalled()
        expect(instance.props.sendAnalyticsErrorMessage).toHaveBeenCalledWith(
          ANALYTICS_ERROR.LOGIN_FAILED
        )
      })

      it('should call analytics methods when there are input values', () => {
        const { wrapper, instance } = renderComponent(loginFormWithError)
        const prevProps = {
          loginForm: { fields: { password: { isFocused: true } } },
        }
        instance.componentDidUpdate(prevProps)
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: GTM_CATEGORY.SIGN_IN,
          action: GTM_ACTION.SUBMIT,
          label: 'sign-in-button',
          rememberMe: loginFormWithError.loginForm.fields.rememberMe.value,
        })
      })

      it('should call sendAnalyticsClickEvent() when user logs in', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
      })

      it('should call loginUser if no errors', () => {
        const { instance, wrapper } = renderedComponent
        instance.getErrors = jest.fn(() => ({}))
        expect(instance.props.loginUser).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.loginUser).toHaveBeenCalledTimes(1)
        expect(instance.props.loginUser).toHaveBeenLastCalledWith({
          credentials: {
            username: instance.props.loginForm.fields.email.value,
            password: instance.props.loginForm.fields.password.value,
            rememberMe: instance.props.loginForm.fields.rememberMe.value,
          },
          getNextRoute: instance.props.getNextRoute,
          successCallback: instance.props.successCallback,
          errorCallback: undefined,
          formName: 'customLogin',
        })
      })

      it('should not call loginUser if errors', () => {
        const { instance, wrapper } = renderedComponent
        instance.getErrors = jest.fn(() => ({
          email: 'has errors',
        }))
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.loginUser).not.toHaveBeenCalled()
      })
    })
  })
})
