import testComponentHelper from 'test/unit/helpers/test-component'
import PrivacyNotice from '../PrivacyNotice'
import { Link } from 'react-router'

describe('<PrivacyNotice />', () => {
  const initialProps = {
    brandName: 'missselfridge',
    region: 'uk',
  }
  const renderComponent = testComponentHelper(PrivacyNotice.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('renders with a different region, for example de', () => {
      const props = {
        ...initialProps,
        region: 'de',
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('should not render if region is us', () => {
      const props = {
        ...initialProps,
        region: 'us',
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('should render if region is `us` and showPrivacyMessageForUs ', () => {
      const props = {
        ...initialProps,
        region: 'us',
        showPrivacyMessageForUs: true,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('renders with a different brand, for example topshop', () => {
      const props = {
        ...initialProps,
        brandName: 'topshop',
      }

      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('renders with different a region and brand, for example de and topshop', () => {
      const props = {
        ...initialProps,
        region: 'de',
        brandName: 'topshop',
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('defaults to no href if there is no brand for a given region, for example burton in de', () => {
      const props = {
        ...initialProps,
        brandName: 'burton',
        region: 'de',
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('renders privacyMessage if passed', () => {
      const props = {
        ...initialProps,
        privacyMessage: 'myPrivacyMessage',
      }

      const { wrapper } = renderComponent(props)

      expect(wrapper.html()).toEqual(
        expect.stringContaining('myPrivacyMessage')
      )
    })

    it('renders privacyNoticeUrlText if passed', () => {
      const props = {
        ...initialProps,
        privacyNoticeUrlText: 'Privacy policy',
      }

      const { wrapper } = renderComponent(props)

      expect(wrapper.html()).toEqual(expect.stringContaining('Privacy policy'))
    })
  })

  describe('onClick', () => {
    const href = '/privacy/policy'
    const preventDefault = jest.fn()
    // workaround for a known bug in JSDOM reflecting in jest 25
    // https://github.com/facebook/jest/issues/9471

    Object.defineProperty(global, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    })

    Object.defineProperty(global.location, 'reload', {
      writable: true,
      value: jest.fn(),
    })

    beforeEach(() => jest.clearAllMocks())

    it('should open the privacy policy in a new window', () => {
      global.open = jest.fn(() => ({}))
      const { wrapper } = renderComponent(initialProps)
      wrapper.find(Link).simulate('click', {
        preventDefault,
        target: {
          href,
        },
      })
      expect(preventDefault).toHaveBeenCalled()
      expect(global.open).toHaveBeenCalledWith(href, '')
      expect(global.location.assign).not.toHaveBeenCalled()
    })

    it('should open the privacy policy in the same window if a new window could not be opened', () => {
      global.open = jest.fn(() => null)
      const { wrapper } = renderComponent(initialProps)
      wrapper.find(Link).simulate('click', {
        preventDefault,
        target: {
          href,
        },
      })
      expect(preventDefault).toHaveBeenCalled()
      expect(global.open).toHaveBeenCalledWith(href, '')
      expect(global.location.assign).toHaveBeenCalledWith(href)
    })
  })
})
