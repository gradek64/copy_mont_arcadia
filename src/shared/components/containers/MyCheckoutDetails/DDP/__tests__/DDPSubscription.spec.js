import testComponentHelper from 'test/unit/helpers/test-component'
import DDPSubscription from '../DDPSubscription'
import { browserHistory } from 'react-router'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

const renderComponent = testComponentHelper(DDPSubscription)

describe('<DDPSubscription/>', () => {
  let initialProps

  beforeAll(() => {
    initialProps = {
      brandCode: 'ts',
      ddpProduct: {
        name: 'DDP Subscription',
      },
      user: {
        ddpEndDate: '30 September 2018',
        isDDPUser: true,
        isDDPRenewable: false,
      },
      isDDPRenewablePostWindow: false,
    }

    jest.clearAllMocks()
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('should render the DDPSubscription component without the Renew button if isDDPRenewable is set to false and isDDPUser is set to true', () => {
      const renderedComponent = renderComponent(initialProps)
      const { wrapper } = renderedComponent

      expect(wrapper.find('Button.DDPSubscription-renewButton').exists()).toBe(
        false
      )
    })

    it('should render the DDPSubscription title fallback if DDPProduct object is undefined', () => {
      const props = {
        ...initialProps,
        ddpProduct: undefined,
      }
      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent
      expect(wrapper.find('h3').text()).toBe('DDP Subscription')
    })

    it('should render the correct DDPSubscription title if DDPProduct name is returned', () => {
      const props = {
        ...initialProps,
        ddpProduct: {
          ...initialProps.ddpProduct,
          name: 'DDP VIP Subscription',
        },
      }

      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent
      expect(wrapper.find('h3').text()).toBe('DDP VIP Subscription')
    })

    it('should render the DDPSubscription title fallback if DDPProduct name is undefined', () => {
      const props = {
        ...initialProps,
        ddpProduct: {
          ...initialProps.ddpProduct,
          name: undefined,
        },
      }
      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent
      expect(wrapper.find('h3').text()).toBe('DDP Subscription')
    })

    it('should render the DDPSubscription component with the Renew button if isDDPRenewable is set to true', () => {
      const props = {
        ...initialProps,
        user: {
          isDDPRenewable: true,
        },
      }
      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent
      const node = wrapper.find('Button.DDPSubscription-renewButton')

      expect(renderedComponent.getTreeFor(node)).toMatchSnapshot()
    })

    it('should render the expired message if isDDPUser is set to false and isDDPRenewable is set to true', () => {
      const props = {
        ...initialProps,
        user: {
          ...initialProps.user,
          isDDPUser: false,
          isDDPRenewable: true,
        },
        isDDPRenewablePostWindow: true,
      }
      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent
      const node = wrapper.find('span.DDPSubscription-message')

      expect(renderedComponent.getTreeFor(node)).toMatchSnapshot()
    })

    it('should render the cancel anchor tag', () => {
      const props = {
        ...initialProps,
      }
      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent
      const node = wrapper.find('a.DDPSubscription-cancel')

      expect(renderedComponent.getTreeFor(node)).toMatchSnapshot()
    })

    it('should not render the cancel anchor tag if the user has no longer an active subscription', () => {
      const props = {
        ...initialProps,
        user: {
          ...initialProps.user,
          isDDPUser: false,
        },
        isDDPRenewablePostWindow: true,
      }
      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent

      expect(wrapper.find('a.DDPSubscription-cancel').exists()).toBe(false)
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    it('DDP renew button routes user to the DDP subscription feature page', () => {
      const props = {
        ...initialProps,
        user: {
          isDDPRenewable: true,
        },
      }
      const renderedComponent = renderComponent(props)
      const { wrapper } = renderedComponent

      expect(browserHistory.push).toHaveBeenCalledTimes(0)
      wrapper
        .find('Button.DDPSubscription-renewButton')
        .props()
        .clickHandler()
      expect(browserHistory.push).toHaveBeenCalledTimes(1)
      expect(browserHistory.push).toHaveBeenCalledWith(
        expect.stringMatching(/uk\/category/)
      )
    })

    it('DDP Cancel button routes user to the eGainPortal', () => {
      const renderedComponent = renderComponent(initialProps)
      const { wrapper } = renderedComponent
      const link = wrapper.find('a.DDPSubscription-cancel')
      expect(link.prop('href')).toBe(
        'http://help.topshop.com/system/templates/selfservice/topshop/#!portal/403700000001048/article/Prod-34796/Can-I-cancel-my-Topshop-Unlimited-Delivery-membership'
      )
      expect(link.prop('target')).toBe('_blank')
      expect(link.prop('rel')).toBe('noopener noreferrer')
    })
  })
})
