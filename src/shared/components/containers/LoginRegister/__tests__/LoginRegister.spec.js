import testComponentHelper from 'test/unit/helpers/test-component'
import { mergeDeepRight } from 'ramda'
import LoginRegister from '../LoginRegister'
import LoginRegisterHeader from '../LoginRegisterHeader'

const invalidEmail = 'email'

const accountExistsResponse = { body: { exists: true } }
const accountNotExistResponse = { body: { exists: false } }

const emptyFormProp = {
  fields: {
    email: {
      value: '',
    },
    password: {
      value: '',
    },
  },
  message: {},
}
const loginFormProp = {
  fields: {
    email: {
      value: 'email@example.com',
    },
    password: {
      value: 'password',
    },
    subscribe: {
      value: 'true',
    },
    rememberme: {
      value: 'true',
    },
  },
  message: {},
}
const registerFormProp = {
  fields: {
    email: {
      value: 'email@example.com',
    },
    password: {
      value: 'password',
    },
    confirmPassword: {
      value: 'password',
    },
    subscribe: {
      value: 'true',
    },
    rememberme: {
      value: 'true',
    },
  },
  message: {},
}
const invalidFormProp = {
  fields: {
    email: {
      value: 'invalid.email@example',
    },
    password: {
      value: 'password',
    },
    confirmPassword: {
      value: 'password1',
    },
  },
  message: {},
}

beforeEach(() => jest.clearAllMocks())

describe('<LoginRegister />', () => {
  const initialProps = {
    registerLoginForm: emptyFormProp,
    loginUser: jest.fn(),
    setFormField: jest.fn(),
    touchedFormField: jest.fn(),
    resetForm: jest.fn(),
    setFormMessage: jest.fn(),
    touchedMultipleFormFields: jest.fn(),
    checkAccountExists: jest.fn(),
  }
  const context = {
    l: jest.fn((m) => {
      return m[0]
    }),
  }
  const renderComponent = testComponentHelper(LoginRegister.WrappedComponent, {
    context,
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('in login state (snapshot)', () => {
      const { instance, wrapper, getTree } = renderComponent(
        mergeDeepRight(initialProps, { registerLoginForm: loginFormProp })
      )
      instance.setState({ formMode: 'login' })
      wrapper.update()
      expect(getTree()).toMatchSnapshot()
    })

    it('in register state (snapshot)', () => {
      const { instance, wrapper, getTree } = renderComponent(
        mergeDeepRight(initialProps, { registerLoginForm: registerFormProp })
      )
      instance.setState({ formMode: 'register' })
      wrapper.update()
      expect(getTree()).toMatchSnapshot()
    })

    it('in login state', () => {
      const { wrapper, instance } = renderComponent(
        mergeDeepRight(initialProps, { registerLoginForm: loginFormProp })
      )
      instance.setState({ formMode: 'login' })
      wrapper.update()
      expect(wrapper.find('#Login-password').exists()).toBe(true)
      expect(wrapper.find('#Register-password').exists()).toBe(false)
      expect(wrapper.find('#Register-confirmPassword').exists()).toBe(false)
      const header = wrapper.find(LoginRegisterHeader)
      expect(header).toHaveLength(1)
      expect(header.prop('children')[0]).toEqual('Good to see you again')
      expect(header.prop('children')[2]).toEqual('Please sign in')
    })

    it('in register state', () => {
      const { wrapper, instance } = renderComponent(
        mergeDeepRight(initialProps, { registerLoginForm: registerFormProp })
      )
      instance.setState({ formMode: 'register' })
      wrapper.update()
      expect(wrapper.find('#Login-password').exists()).toBe(false)
      expect(wrapper.find('#Register-password').exists()).toBe(true)
      expect(wrapper.find('#Register-confirmPassword').exists()).toBe(true)
      const header = wrapper.find(LoginRegisterHeader)
      expect(header).toHaveLength(1)
      expect(header.prop('children')[0]).toEqual("Looks like you're new")
      expect(header.prop('children')[2]).toEqual('Please sign up')
    })
  })
  describe('@lifecycle', () => {
    describe('@constructor', () => {
      it('should set initial state', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.state).toEqual({ formMode: 'default', errors: {} })
      })
    })

    describe('@componentWillUnmount', () => {
      it('should call setFormMessage and resetForm', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        wrapper.unmount()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
      })
    })

    describe('@UNSAFE_componentWillReceivePropss', () => {
      it('should update errors', () => {
        const { instance } = renderComponent({
          ...initialProps,
          registerLoginForm: {
            fields: {
              email: {
                value: 'valid.email@domain.com',
              },
              password: {
                value: 'validpassword1',
              },
              confirmPassword: {
                value: 'validpassword1',
              },
            },
            message: {},
          },
        })
        const newProps = {
          registerLoginForm: {
            fields: {
              email: {
                value: 'invalid.email@',
              },
              password: {
                value: 'invalidpassword',
              },
            },
          },
        }
        expect(instance.state.errors).toEqual({})
        instance.UNSAFE_componentWillReceiveProps(
          mergeDeepRight(initialProps, newProps)
        )
        expect(instance.state.errors).toEqual({
          confirmPassword: 'A password is required.',
          email: 'Please enter a valid email address.',
          password:
            'Please enter a password that is at least 6 characters long and includes a number',
        })
      })

      it('should not lookup account if it receives unchanged email', () => {
        const { instance } = renderComponent(initialProps)
        const newProps = {
          registerLoginForm: {
            fields: {},
            message: {},
          },
        }
        instance.UNSAFE_componentWillReceiveProps(
          mergeDeepRight(initialProps, newProps)
        )
        expect(instance.props.checkAccountExists).not.toHaveBeenCalled()
      })

      it('should not lookup account if it receives new, empty email', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        const newEmail = ''
        const newProps = {
          registerLoginForm: {
            fields: {
              email: {
                value: newEmail,
              },
            },
          },
        }
        instance.UNSAFE_componentWillReceiveProps(
          mergeDeepRight(initialProps, newProps)
        )
        wrapper.update()
        expect(instance.props.checkAccountExists).not.toHaveBeenCalled()
        expect(instance.state.formMode).toBe('default')
      })

      it('should not lookup account if it receives new, invalid email', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        const newProps = {
          registerLoginForm: {
            fields: {
              email: {
                value: invalidEmail,
              },
            },
          },
        }
        instance.UNSAFE_componentWillReceiveProps(
          mergeDeepRight(initialProps, newProps)
        )
        wrapper.update()
        expect(instance.props.checkAccountExists).not.toHaveBeenCalled()
        expect(instance.state.errors).toHaveProperty('email')
      })

      it('should lookup account if it receives new, valid email', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        instance.props.checkAccountExists.mockReturnValueOnce(
          accountExistsResponse
        )
        const newEmail = 'email@example.com'
        const newProps = {
          registerLoginForm: {
            fields: {
              email: {
                value: newEmail,
              },
            },
          },
        }
        expect(instance.props.checkAccountExists).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(
          mergeDeepRight(initialProps, newProps)
        )
        wrapper.update()
        expect(instance.props.checkAccountExists).toHaveBeenCalledWith({
          email: newEmail,
          successCallback: instance.setAccountState,
        })
      })
    })
  })
  describe('@instance methods', () => {
    describe('setAccountState', () => {
      it('should reset existing login message', () => {
        const { wrapper, instance } = renderComponent(
          mergeDeepRight(initialProps, {
            registerLoginForm: {
              message: {
                message: 'Error',
                type: 'error',
              },
            },
          })
        )
        expect(instance.state.formMode).toBe('default')
        instance.setAccountState(accountExistsResponse)
        wrapper.update()
        expect(instance.state.formMode).toBe('login')
        expect(instance.props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormMessage).toHaveBeenCalledWith(
          'registerLogin',
          {}
        )
      })

      it("should set to 'login' mode if account exists", () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.state.formMode).toBe('default')
        instance.setAccountState(accountExistsResponse)
        wrapper.update()
        expect(instance.state.formMode).toBe('login')
      })

      it("should change to 'register' mode if account does not exist", () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.state.formMode).toBe('default')
        instance.setAccountState(accountNotExistResponse)
        wrapper.update()
        expect(instance.state.formMode).toBe('register')
      })
    })

    describe('getFormErrors', () => {
      let instance

      beforeEach(() => {
        const component = renderComponent(initialProps)
        instance = component.instance
        instance.UNSAFE_componentWillReceiveProps(
          mergeDeepRight(initialProps, { registerLoginForm: invalidFormProp })
        )
      })

      it('default mode', () => {
        expect(instance.formErrors).toEqual({
          email: 'Please enter a valid email address.',
        })
      })
      it('login mode', () => {
        instance.setState({ formMode: 'login' })
        expect(instance.formErrors).toEqual({
          email: 'Please enter a valid email address.',
          // do not display password validation - this is deliberate
        })
      })
      it('register mode', () => {
        instance.setState({ formMode: 'register' })
        expect(instance.formErrors).toEqual({
          email: 'Please enter a valid email address.',
          password:
            'Please enter a password that is at least 6 characters long and includes a number',
          confirmPassword: 'Please ensure that both passwords match',
        })
      })
    })

    describe('getFieldErrors', () => {
      let instance

      beforeEach(() => {
        const component = renderComponent(initialProps)
        instance = component.instance
        instance.UNSAFE_componentWillReceiveProps(
          mergeDeepRight(initialProps, { registerLoginForm: invalidFormProp })
        )
      })

      it('uses instance state by default', () => {
        expect(instance.getFieldErrors('email')).toEqual({
          email: 'Please enter a valid email address.',
        })
      })

      it('uses provided errors - single', () => {
        const expectedErrors = {
          email: 'email error',
        }
        const errors = {
          ...expectedErrors,
          password: 'password error',
          confirmPassword: 'confirm password error',
        }
        expect(instance.getFieldErrors('email', errors)).toEqual(expectedErrors)
      })

      it('uses provided errors - multiple', () => {
        const expectedErrors = {
          email: 'email error',
          password: 'password error',
        }
        const errors = {
          ...expectedErrors,
          confirmPassword: 'confirm password error',
        }
        expect(instance.getFieldErrors(['email', 'password'], errors)).toEqual(
          expectedErrors
        )
      })
    })

    describe('getValidationErrors', () => {
      describe('without providing props', () => {
        it('missing email validation error', () => {
          const { instance } = renderComponent(initialProps)
          const errors = instance.getValidationErrors()
          expect(errors).toHaveProperty(
            'email',
            'An email address is required.'
          )
        })
      })

      describe('providing props', () => {
        it('using invalid email and password', () => {
          const { instance } = renderComponent(initialProps)
          const newProps = mergeDeepRight(initialProps, {
            registerLoginForm: {
              fields: {
                email: {
                  value: invalidEmail,
                },
                password: {
                  value: 'x',
                },
              },
            },
          })
          const errors = instance.getValidationErrors(newProps)

          expect(errors).toHaveProperty(
            'email',
            'Please enter a valid email address.'
          )
          expect(errors).toHaveProperty(
            'password',
            'Please enter a password of at least 6 characters'
          )
        })
      })
    })

    describe('setFormField', () => {
      it('creates a function that calls setFormField action when invoked', () => {
        const { instance } = renderComponent(initialProps)
        const event = { target: { value: 'email value' } }

        const setEmail = instance.setFormField('email')

        expect(setEmail).toBeInstanceOf(Function)
        setEmail(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenCalledWith(
          'registerLogin',
          'email',
          'email value'
        )
      })
    })

    describe('touchedFormField', () => {
      it('creates a function that calls touchedFormField action when invoked', () => {
        const { instance } = renderComponent(initialProps)
        const event = { target: { value: 'email value' } }

        const touchedEmail = instance.touchedFormField('email')

        expect(touchedEmail).toBeInstanceOf(Function)
        touchedEmail(event)
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenCalledWith(
          'registerLogin',
          'email'
        )
      })
    })

    describe('setChecked', () => {
      it('creates a function that calls setFormField action when invoked', () => {
        const { instance } = renderComponent(initialProps)
        const event = { target: { checked: true } }

        const setSubscribedChecked = instance.setChecked('subscribe')

        expect(setSubscribedChecked).toBeInstanceOf(Function)
        setSubscribedChecked(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenCalledWith(
          'registerLogin',
          'subscribe',
          true
        )
      })
    })

    describe('resetForm', () => {
      it('clears form', () => {
        const { instance } = renderComponent(initialProps)

        instance.resetForm()
        expect(instance.props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormMessage).toHaveBeenCalledWith(
          'registerLogin',
          {}
        )
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenCalledWith('registerLogin', {
          email: '',
          password: '',
          confirmPassword: '',
          subscribe: false,
          rememberme: false,
        })
      })
    })
  })
})
