import testComponentHelper from 'test/unit/helpers/test-component'
import FooterNewsletter from '../FooterNewsletter'

const initialProps = {
  footerNewsletterForm: {
    fields: {
      email: {
        value: 'danny.pule@arcadiagroup.co.uk',
      },
    },
  },
  newsletter: {
    label: 'Sign up and get 20% off',
    placeholder: 'Enter your email address',
    button: 'Sign Up',
    signUpUrl:
      '/en/tsuk/category/help-information-5634539/sign-up-to-style-notes-5651318',
    openNewWindow: false,
  },
  setFormField: jest.fn(),
  touchedFormField: jest.fn(),
  inputPlaceholder: 'Enter your email address',
  buttonText: 'Sign Up',
  redirectUrl: 'www.topshop.com?',
  className: 'some-class',
}

describe('<FooterNewsletter />', () => {
  const renderComponent = testComponentHelper(FooterNewsletter.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
    it('label should be bound to input field', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.FooterNewsletter-label').prop('htmlFor')).toBe(
        'email'
      )
      expect(wrapper.find('.FooterNewsletter-input').prop('name')).toBe('email')
    })
    it('button length should not be > 17 chars', () => {
      const testProps = Object.assign({}, initialProps, {})
      expect(testProps.newsletter.button).toHaveLength(7)
      testProps.newsletter.button = 'Sign up and get 20% off'
      const { wrapper } = renderComponent(testProps)
      expect(
        wrapper.find('.FooterNewsletter-button').prop('children')
      ).toHaveLength(17)
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
      renderedComponent = renderComponent({
        ...initialProps,
        newsletter: {
          signUpUrl: 'http://www.google.com',
        },
      })
      jest.resetAllMocks()
    })
    describe('email Input', () => {
      const field = 'email'
      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="email"]`).prop('setField')(field)(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'footerNewsletter',
          field,
          event.target.value
        )
      })
      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.touchedFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="email"]`).prop('touchedField')(field)(event)
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'footerNewsletter',
          field
        )
      })
    })
    describe('form submit', () => {
      it('should call e.preventDefault() ', () => {
        const { wrapper } = renderedComponent
        expect(event.preventDefault).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })
      it('should call redirectUser if no errors', () => {
        const { instance, wrapper } = renderedComponent
        instance.getErrors = jest.fn(() => ({}))
        instance.redirectUser = jest.fn()
        expect(instance.redirectUser).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.redirectUser).toHaveBeenCalledTimes(1)
      })
      it('should not call redirectUser if errors', () => {
        const { instance, wrapper } = renderedComponent
        instance.redirectUser = jest.fn()
        instance.getErrors = jest.fn(() => ({
          email: 'has errors',
        }))
        wrapper.find('Form').simulate('submit', event)
        expect(instance.redirectUser).not.toHaveBeenCalled()
      })
    })

    describe('Redirection', () => {
      it('should call window.open with the correct parameters if `openNewWindow` is `true`', () => {
        const windowOpen = window.open
        window.open = jest.fn()

        const signUpUrl = '/en/tsuk/category/style-notes-16/home?test=true'

        const { instance } = renderComponent({
          ...initialProps,
          newsletter: {
            signUpUrl,
            openNewWindow: true,
          },
        })

        instance.redirectUser()

        expect(window.open).toHaveBeenCalledWith(signUpUrl)

        window.open = windowOpen
      })

      it('should call window.location with the correct parameters if `openNewWindow` is `false`', () => {
        const window = global.window
        delete global.window.location
        window.location = { assign: jest.fn() }

        const signUpUrl = '/en/tsuk/category/style-notes-16/home'

        const { instance } = renderComponent({
          ...initialProps,
          newsletter: {
            signUpUrl,
          },
        })

        instance.redirectUser()

        expect(window.location).toBe(signUpUrl)

        global.window = window
      })
    })
  })
})
