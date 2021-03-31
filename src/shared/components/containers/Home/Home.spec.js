import React from 'react'
import { shallow } from 'enzyme'
import Helmet from 'react-helmet'
import * as sandBoxActions from '../../../actions/common/sandBoxActions'
import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import espots from '../../../constants/espotsMobile'
import cmsConsts from '../../../constants/cmsConsts'
import Sandbox from '../SandBox/SandBox'
import Home from './Home'

jest.mock('../../../actions/common/sandBoxActions')

const showTacticalMessageMock = jest.fn()
const hideTacticalMessageMock = jest.fn()

describe('<Home/>', () => {
  const brandName = 'topshop'
  const initialProps = {
    showTacticalMessage: showTacticalMessageMock,
    hideTacticalMessage: hideTacticalMessageMock,
    brandName,
    isHomePageSegmentationEnabled: false,
    routingLocation: {},
    isFeatureHttpsCanonicalEnabled: false,
  }
  const renderComponent = testComponentHelper(
    Home.WrappedComponent.WrappedComponent
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(
        renderComponent({
          brandName,
          isHomePageSegmentationEnabled: false,
          routingLocation: { hostname: 'www.topshop.com' },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('in default state with callback props', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('when FEATURE_HOME_PAGE_SEGMENTATION enabled', () => {
      expect(
        renderComponent({
          brandName,
          isHomePageSegmentationEnabled: true,
          routingLocation: { hostname: 'www.topshop.com' },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should contain three sandbox modules', () => {
      const wrapper = shallow(
        <Home.WrappedComponent.WrappedComponent
          brandName={brandName}
          isHomePageSegmentationEnabled={false}
          routingLocation={{ hostname: 'www.topshop.com' }}
        />,
        { context: { l: jest.fn() } }
      )
      expect(wrapper.find(Sandbox)).toHaveLength(3)
    })

    it('should render heading <h1/>', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('h1')).toHaveLength(1)
      expect(wrapper.find('h1').text()).toBe(`${brandName} homepage`)
    })

    it('sets canonical prefixed with "http" if "isFeatureHttpsCanonicalEnabled" prop is true', () => {
      const extendedProps = {
        ...initialProps,
        routingLocation: { hostname: 'www.topshop.com' },
        isFeatureHttpsCanonicalEnabled: true,
      }
      const { wrapper } = renderComponent(extendedProps)
      expect(wrapper.find(Helmet).props()).toEqual({
        defer: true,
        encodeSpecialCharacters: true,
        link: [{ href: 'https://www.topshop.com', rel: 'canonical' }],
      })
    })

    it('renders hrefLanguages in Helmet component when provided', () => {
      const extendedProps = {
        ...initialProps,
        routingLocation: { hostname: 'www.topshop.com' },
        isFeatureHttpsCanonicalEnabled: true,
        hrefLanguages: [
          {
            href: 'https://www.topshop.com',
            hreflang: 'en-gb',
          },
          {
            href: 'https://fr.topshop.com',
            hreflang: 'fr-fr',
          },
        ],
      }
      const { wrapper } = renderComponent(extendedProps)
      expect(wrapper.find(Helmet).props()).toEqual({
        defer: true,
        encodeSpecialCharacters: true,
        link: [
          { href: 'https://www.topshop.com', rel: 'canonical' },
          {
            href: 'https://www.topshop.com',
            hreflang: 'en-gb',
            rel: 'alternate',
          },
          {
            href: 'https://fr.topshop.com',
            hreflang: 'fr-fr',
            rel: 'alternate',
          },
        ],
      })
    })
  })

  describe('@lifecycle', () => {
    describe('on componentDidMount', () => {
      it('calls showTacticalMessage', () => {
        const { instance } = renderComponent(initialProps)
        expect(showTacticalMessageMock).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(showTacticalMessageMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('on componentWillUnmount', () => {
      it('calls hideTacticalMessage', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(hideTacticalMessageMock).toHaveBeenCalledTimes(0)
        wrapper.unmount()
        expect(hideTacticalMessageMock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@needs', () => {
    it('contains a call to cmsActions.showTacticalMessage', () => {
      expect(sandBoxActions.showTacticalMessage).toHaveBeenCalledTimes(0)
      Home.WrappedComponent.needs[0]()
      expect(sandBoxActions.showTacticalMessage).toHaveBeenCalledTimes(1)
    })
    it('contains a call to segmentedSandBoxActions.getSegmentedContent to get the home CMS page', () => {
      expect(sandBoxActions.getHomePageContent).toHaveBeenCalledTimes(0)
      Home.WrappedComponent.needs[1]()
      expect(sandBoxActions.getHomePageContent).toHaveBeenCalledTimes(1)
    })
    it('contains a call to sandBoxActions.getContent to get the CMS content for the first espot of the home page', () => {
      expect(sandBoxActions.getContent).toHaveBeenCalledTimes(0)
      Home.WrappedComponent.needs[2]()
      expect(sandBoxActions.getContent).toHaveBeenCalledTimes(1)
      expect(sandBoxActions.getContent).lastCalledWith(
        null,
        espots.home[0],
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })
    it('contains a call to sandBoxActions.getContent to get the CMS content for second espot of the home page', () => {
      expect(sandBoxActions.getContent).toHaveBeenCalledTimes(0)
      Home.WrappedComponent.needs[3]()
      expect(sandBoxActions.getContent).toHaveBeenCalledTimes(1)
      expect(sandBoxActions.getContent).lastCalledWith(
        null,
        espots.home[1],
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(Home, 'home', {
      componentName: 'Home',
      isAsync: true,
      redux: true,
    })
  })
})
