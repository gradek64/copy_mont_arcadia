import React from 'react'
import { shallow, mount } from 'enzyme'
import { analyticsDecoratorHelper } from 'test/unit/helpers/test-component'
import Helmet from 'react-helmet'
import Dressipi from './Dressipi'
import CmsNotAvailable from '../../common/CmsNotAvailable/CmsNotAvailable'

const state = {
  config: {
    brandCode: 'ts',
    region: 'uk',
  },
  navigation: {
    menuLinks: [],
  },
  loaderOverlay: {
    visible: false,
  },
  routing: {
    location: {
      hostname: 'm.topshop.com',
      pathname: '/foo',
    },
    visited: ['/'],
  },
  products: [],
  account: {},
  viewport: {
    height: 800,
    width: 320,
  },
}

describe('<Dressipi />', () => {
  describe('@decorators', () => {
    analyticsDecoratorHelper(Dressipi, 'style-adviser', {
      componentName: 'Dressipi',
      isAsync: false,
    })
  })

  const WrappedComponent = Dressipi.WrappedComponent.WrappedComponent

  it('exists', () => {
    const wrapper = shallow(<WrappedComponent brandCode="ts" region="uk" />)
    expect(wrapper.find('.Dressipi').length).toBe(1)
  })

  it('for TSUK returns UK My Topshop Wardrobe', () => {
    const wrapper = shallow(
      <WrappedComponent brandCode="ts" region="uk" isMobile />
    )
    expect(wrapper.find('.Dressipi-module').prop('src')).toBe(
      '//dressipi-production.topshop.com?mobile=1'
    )
  })

  it('for TSUS returns US My Topshop Wardrobe', () => {
    const wrapper = shallow(
      <WrappedComponent brandCode="ts" region="us" isMobile />
    )
    expect(wrapper.find('.Dressipi-module').prop('src')).toBe(
      '//dressipi-production-us.topshop.com?mobile=1'
    )
  })

  it('for WLUK returns Wallis Style Adviser', () => {
    const wrapper = shallow(
      <WrappedComponent brandCode="wl" region="uk" isMobile />
    )
    expect(wrapper.find('.Dressipi-module').prop('src')).toBe(
      '//dressipi-production.wallis.co.uk?mobile=1'
    )
  })

  it('for EVUK returns Wallis Style Adviser', () => {
    const wrapper = shallow(
      <WrappedComponent brandCode="ev" region="uk" isMobile />
    )
    expect(wrapper.find('.Dressipi-module').prop('src')).toBe(
      '//dressipi-production.evans.co.uk?mobile=1'
    )
  })
  it('Production should be called with desktop parameters [mobile=0]', () => {
    const wrapper = shallow(<WrappedComponent brandCode="ev" region="uk" />)
    expect(wrapper.find('.Dressipi-module').prop('src')).toBe(
      '//dressipi-production.evans.co.uk?mobile=0'
    )
  })

  it('for other brand code returns Not Found', () => {
    const wrapper = shallow(<WrappedComponent brandCode="ts" region="de" />)
    expect(wrapper.find(CmsNotAvailable).length).toBe(1)
  })

  describe('mapStateToProps', () => {
    it('builds props from state', () => {
      const store = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => state,
      }
      const wrapper = mount(<Dressipi store={store} />)

      expect(wrapper.find(WrappedComponent).props()).toMatchObject({
        height: 800,
        width: 320,
        brandCode: 'ts',
        region: 'uk',
        baseUrl: 'm.topshop.com',
        pathname: '/foo',
        menuLinks: [],
      })
    })
  })

  describe('#Canonical', () => {
    it('sets the canonical link', () => {
      const store = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => state,
      }
      const wrapper = mount(<Dressipi store={store} />)

      expect(wrapper.find(Helmet).props()).toMatchObject({
        link: [
          {
            href: 'http://www.topshop.com/foo',
            rel: 'canonical',
          },
        ],
        title: 'My Topshop Wardrobe',
      })
    })
    it('prefixes the canonical link with `https` if FEATURE_HTTPS_CANONICAL is enabled', () => {
      const store = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => ({
          ...state,
          features: {
            status: { FEATURE_HTTPS_CANONICAL: true },
          },
        }),
      }

      const wrapper = mount(<Dressipi store={store} />)

      expect(wrapper.find(Helmet).props()).toMatchObject({
        link: [
          {
            href: 'https://www.topshop.com/foo',
            rel: 'canonical',
          },
        ],
        title: 'My Topshop Wardrobe',
      })
    })
  })
})
