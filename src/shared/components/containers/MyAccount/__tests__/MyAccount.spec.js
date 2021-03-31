import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'

jest.mock('../../../../actions/common/accountActions.js', () => ({
  getAccount: jest.fn(),
}))

import MyAccount from '../MyAccount'
import * as accountActions from '../../../../actions/common/accountActions'

describe('<MyAccount />', () => {
  const getAccountSpy = jest.spyOn(accountActions, 'getAccount')
  const renderComponent = testComponentHelper(
    MyAccount.WrappedComponent.WrappedComponent
  )
  const initialProps = {
    getAccount: getAccountSpy,
    getPreferenceLink: jest.fn(),
    user: { creditCard: { type: 'VISA' } },
    visited: ['/my-account'],
    isMobile: true,
    region: 'fake-region',
    getBag: jest.fn(),
    isFeatureMyPreferencesEnabled: false,
    exponeaLink: '',
    ddpProductName: 'DDP Subscription',
    ddpRenewalEnabled: false,
  }

  beforeEach(() => {
    jest.resetAllMocks()
    getAccountSpy.mockReset()
    getAccountSpy.mockRestore()
  })

  describe('@renders', () => {
    it('shows all options for user with checkout profile', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('is not mobile', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has checkOutProfile returns false', () => {
      const props = {
        ...initialProps,
        user: {},
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('should show e-receipts when region is uk', () => {
      expect(
        renderComponent({
          ...initialProps,
          region: 'uk',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should update My Delivery and Payment description when `ddpRenewalEnabled` is true', () => {
      const props = {
        ...initialProps,
        ddpRenewalEnabled: true,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle methods', () => {
    describe('@componentDidMount', () => {
      it('should NOT call getAccount method if visited length < 1', () => {
        const { instance } = renderComponent(initialProps)
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
        expect(initialProps.getBag).toHaveBeenCalledTimes(0)
      })

      it('should NOT call getAccount method if visited length > 1 BUT user already logged in', () => {
        const { instance } = renderComponent({
          ...initialProps,
          user: { exists: true },
          visited: ['/abc', 'cde'],
        })
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
        expect(initialProps.getBag).toHaveBeenCalledTimes(0)
      })

      it('should call getBag if resetPassword is true in query', () => {
        const { instance } = renderComponent({
          ...initialProps,
          user: { exists: true },
          visited: ['/abc', 'cde'],
          location: {
            query: {
              getBasket: 'true',
            },
          },
        })
        expect(initialProps.getBag).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(initialProps.getBag).toHaveBeenCalledTimes(1)
      })
      it('should NOT fetch the Exponena preference link if one already exists in the `Store`', () => {
        const { instance } = renderComponent({
          ...initialProps,
          exponeaLink: 'www.mockLink.com',
          isFeatureMyPreferencesEnabled: true,
        })
        expect(initialProps.getPreferenceLink).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(initialProps.getPreferenceLink).toHaveBeenCalledTimes(0)
      })
      it('should FETCH the Exponena prefrence link if one does not exists in the `Store`', () => {
        const { instance } = renderComponent({
          ...initialProps,
          exponeaLink: '',
          isFeatureMyPreferencesEnabled: true,
        })
        expect(initialProps.getPreferenceLink).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(initialProps.getPreferenceLink).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@Needs', () => {
    it('should call getPreferenceLink()', () => {
      expect(getAccountSpy).toHaveBeenCalledTimes(0)
      MyAccount.WrappedComponent.needs[0]()
      expect(getAccountSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('@instance methods', () => {
    describe('getMenuEntriesLeft', () => {
      it('should return 4 items if isCheckoutProfile returns true and isFeatureMyPreferencesEnabled is set to true', () => {
        const props = {
          ...initialProps,
          isFeatureMyPreferencesEnabled: true,
          exponeaLink: 'www.mocklink.com',
        }
        const { instance } = renderComponent(props)
        const result = instance.getMenuEntriesLeft(true)
        expect(result.length).toBe(4)
        expect(instance.getMenuEntriesRight(true).length).toBe(2)
      })

      it('should return 3 items if isCheckoutProfile returns true and isFeatureMyPreferencesEnabled is set to false', () => {
        const props = {
          ...initialProps,
          isFeatureMyPreferencesEnabled: false,
        }
        // problem in instance that the spy above does not work
        const { instance } = renderComponent(props)
        const result = instance.getMenuEntriesLeft(true)
        expect(result.length).toBe(3)
        expect(instance.getMenuEntriesRight(true).length).toBe(2)
      })

      it('should return 3 items if isCheckoutProfile returns false and isFeatureMyPreferencesEnabled is set to true', () => {
        const props = {
          ...initialProps,
          user: {},
          isFeatureMyPreferencesEnabled: true,
          exponeaLink: 'www.mocklink.com',
        }
        const { instance } = renderComponent(props)
        const result = instance.getMenuEntriesLeft(true)
        expect(result.length).toBe(3)
      })
      it('should set prefrence center block as an external link', () => {
        const props = {
          ...initialProps,
          user: {},
          isFeatureMyPreferencesEnabled: true,
          exponeaLink: 'www.mocklink.com',
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find({ isExternal: true }).length).toBe(1)
      })
      it('should set all blocks apart from preference center to relative links', () => {
        const props = {
          ...initialProps,
          region: 'uk',
          isFeatureMyPreferencesEnabled: true,
          exponeaLink: 'www.mocklink.com',
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find({ isExternal: false }).length).toBe(6)
      })
      it('should return 2 items if isCheckoutProfile returns false and isFeatureMyPreferencesEnabled is set to false', () => {
        const props = {
          ...initialProps,
          user: {},
          isFeatureMyPreferencesEnabled: false,
        }
        const { instance } = renderComponent(props)
        const result = instance.getMenuEntriesLeft(true)
        expect(result.length).toBe(2)
      })
    })
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(MyAccount, 'my-account', {
      componentName: 'MyAccount',
      isAsync: false,
      redux: true,
    })
  })
})
