import testComponentHelper from 'test/unit/helpers/test-component'
import AccountIcon from '../AccountIcon'

describe('<AccountIcon />', () => {
  const renderComponent = testComponentHelper(AccountIcon.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })
    it('with className', () => {
      expect(
        renderComponent({
          className: 'someClassName',
        }).getTree()
      ).toMatchSnapshot()
    })
    describe('user is not logged in (default)', () => {
      it('should display label if `signInText` prop supplied', () => {
        const { wrapper } = renderComponent({
          signInText: 'Sign in',
        })
        expect(wrapper.find('.AccountIcon-label')).toHaveLength(1)
        expect(wrapper.find('.AccountIcon-label').text()).toBe('Sign in')
      })
      it('should display icon with proper class by default', () => {
        const { wrapper } = renderComponent()
        expect(wrapper.find('.AccountIcon-icon').length).toBe(1)
      })
      it('should not display popover class to icon when user not logged in', () => {
        const { wrapper } = renderComponent({
          icon: 'onlyIcon',
          popoverMenu: true,
        })
        expect(
          wrapper
            .find('.AccountIcon-icon')
            .hasClass('AccountIcon-icon--popoverTrigger')
        ).toBe(false)
      })
    })
    describe('user is logged in', () => {
      const props = {
        isUserAuthenticated: true,
      }
      it('should display `My account` label if `signInText` prop supplied', () => {
        const { wrapper } = renderComponent({
          ...props,
          signInText: 'Sign in',
          myAccountText: 'My account',
        })
        expect(wrapper.find('.AccountIcon-label')).toHaveLength(1)
        expect(wrapper.find('.AccountIcon-label').text()).toBe('My account')
      })
      it('should display icon with proper class if user is logged in', () => {
        const { wrapper } = renderComponent(props)
        expect(
          wrapper
            .find('.AccountIcon-icon')
            .hasClass('AccountIcon-icon--loggedIn')
        ).toBe(true)
      })
      describe('popover menu', () => {
        it('should have menu is `popoverMenu`', () => {
          const { wrapper } = renderComponent({
            ...props,
            myAccountText: 'My account',
            signOutText: 'Sign out',
            popoverMenu: true,
          })
          expect(wrapper.find('.AccountIcon-popover').length).toBe(1)
          expect(
            wrapper.find('.AccountIcon-popoverButtonMyAccount').prop('children')
          ).toBe('My account')
          expect(
            wrapper.find('.AccountIcon-popoverButtonSignOut').prop('children')
          ).toBe('Sign out')
        })
        /* it('should display email', () => {
          const { wrapper } = renderComponent({
            ...props,
            myAccountText: 'My account',
            signOutText: 'Sign out',
            popoverMenu: true,
            email: 'johndoe@example.com'
          })
          expect(wrapper.find('.AccountIcon-popoverButtonEmail').text()).toBe(
            'johndoe@example.com'
          )
        }) */
      })
    })
    describe('partial authentication', () => {
      it('should show icon for an authenticated user', () => {
        const { wrapper } = renderComponent({
          isUserAuthenticated: false,
          isUserPartiallyAuthenticated: true,
        })

        expect(
          wrapper
            .find('.AccountIcon-icon')
            .hasClass('AccountIcon-icon--loggedIn')
        ).toBe(true)
      })

      it('should have a popover menu', () => {
        const { wrapper } = renderComponent({
          isUserAuthenticated: false,
          isUserPartiallyAuthenticated: true,
          myAccountText: 'My account',
          signOutText: 'Sign out',
          popoverMenu: true,
        })

        expect(wrapper.find('.AccountIcon-popover').length).toBe(1)
        expect(
          wrapper.find('.AccountIcon-popoverButtonMyAccount').prop('children')
        ).toBe('My account')
        expect(
          wrapper.find('.AccountIcon-popoverButtonSignOut').prop('children')
        ).toBe('Sign out')
      })

      it('should direct the user to login if they click my account CTA', () => {
        const { wrapper } = renderComponent({
          isUserAuthenticated: false,
          isUserPartiallyAuthenticated: true,
          myAccountText: 'My account',
          signOutText: 'Sign out',
          popoverMenu: true,
        })

        expect(
          wrapper
            .find('.AccountIcon-popover Link')
            .first()
            .prop('to')
        ).toBe('/login')
      })
    })
  })
})
