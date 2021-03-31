/* eslint-disable no-undef */
// TODO remove System and eslint-disable
import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import deepFreeze from 'deep-freeze'
import { mount } from 'enzyme'
import { without } from 'ramda'
import Helmet from 'react-helmet'
import Main from '../Main'
import CheckoutMiniBag from '../../CheckoutMiniBag/CheckoutMiniBag'
import Espot from '../../Espot/Espot'
import MiniBag from '../../MiniBag/MiniBag'
import ContentOverlay from '../../../common/ContentOverlay/ContentOverlay'
import FooterContainer from '../../Footer/FooterContainer/FooterContainer'
import FooterCheckout from '../../Footer/FooterCheckout/FooterCheckout'
import { getFooterConfig } from '../../../../../server/config/footer_config'
import GeoIPModal from '../../../common/GeoIP'
import TopNavMenu from '../../TopNavMenu/TopNavMenu'
import reducer from '../../../../lib/combine-reducers'
import topshop from '../../../../../server/config/brands/topshop'
import { getItem, setItem } from '../../../../../client/lib/cookie/utils'
import storageHandlers from '../../../../../client/lib/state-sync/handlers/index'
import { SHOPPING_BAG_SYNC_KEY } from '../../../../../client/lib/state-sync/handlers/shoppingBagSyncHandler'
import espots from '../../../../constants/espotsMobile'
import cmsConsts from '../../../../constants/cmsConsts'
import { getContent } from '../../../../actions/common/sandBoxActions'
import {
  getCategories,
  getMegaNav,
} from '../../../../actions/common/navigationActions'
import { getFooterContent } from '../../../../actions/common/footerActions'
import { getSiteOptions } from '../../../../actions/common/siteOptionsActions'
import { getCountries } from '../../../../actions/components/StoreLocatorActions'
import { getDefaultWishlist } from '../../../../actions/common/wishlistActions'
import * as assetUtils from '../../../../../shared/lib/asset-utils'
import * as featureSelectors from '../../../../../shared/selectors/featureSelectors'

jest.mock('../../../../../client/lib/cookie/utils')
jest.mock('../../../../actions/common/sandBoxActions', () => ({
  getContent: jest.fn(),
}))
jest.mock('../../../../actions/common/navigationActions', () => ({
  getCategories: jest.fn(),
  getMegaNav: jest.fn(),
}))
jest.mock('../../../../actions/common/footerActions', () => ({
  getFooterContent: jest.fn(),
}))
jest.mock('../../../../actions/common/siteOptionsActions', () => ({
  getSiteOptions: jest.fn(),
}))
jest.mock('../../../../actions/components/StoreLocatorActions', () => ({
  getCountries: jest.fn(),
}))
jest.mock('../../../../actions/common/wishlistActions', () => ({
  getDefaultWishlist: jest.fn(),
}))
jest.mock('../../../../lib/user-agent', () => ({
  isIOS: jest.fn(() => false),
}))
jest.mock('../../../../../shared/selectors/featureSelectors')

describe('<Main/>', () => {
  const initialProps = {
    brandName: 'burton',
    brandDisplayName: 'Burton',
    region: 'uk',
    location: { pathname: '/' },
    routes: [],
    sizeGuideOpen: false,
    isFeatureWishlistEnabled: false,
    isHomePage: false,
    wishlistedItemIds: null,
    updateWindow: jest.fn(),
    setAndUpdateMediaType: jest.fn(),
    updateAgent: jest.fn(),
    updateTouch: jest.fn(),
    getBag: jest.fn(),
    initFeaturesListener: jest.fn(),
    retrieveCachedData: jest.fn(),
    initShoppingBag: jest.fn(),
    showModal: jest.fn(),
    closeModal: jest.fn(),
    getDefaultWishlist: jest.fn(),
    getAccount: jest.fn(),
    stickyHeader: false,
    pageTitle: 'Page title',
    megaNavSelectedCategory: false,
    modalOpen: false,
    miniBagOpen: false,
    topNavMenuOpen: false,
    syncState: jest.fn(),
    isCheckout: false,
    getRoutePath: 'route/path',
    ddpDefaultSku: {
      sku: '100000001',
      default: true,
      catentryId: '32077179',
      name: 'DDP VIP 1 Month',
      description: 'DDP VIP 1 Month',
      timePeriod: '1',
    },
    isOrderCompletePage: false,
    isDDPOrder: true,
    ddpEndDate: '1 April 2020',
    ddpLogoSrc: 'ddpLogoSrc/path',
    stylesheetProps: [
      {
        rel: 'stylesheet',
        href: '/assets/topshop/style.css',
        media: '(min-width: 0px)',
      },
    ],
    assets: {
      css: {
        'burton/styles-desktop.css':
          '/assets/burton/styles-desktop.315f67dabf70a8a1fd5bd6802da1a6cc.css',
        'burton/styles-grid.css':
          '/assets/burton/styles-grid.cc653b82ad95a434d369f82b88a71034.css',
        'burton/styles-laptop.css':
          '/assets/burton/styles-laptop.cc653b82ad95a434d369f82b88a71034.css',
        'burton/styles-tablet.css':
          '/assets/burton/styles-tablet.1b884f9e00922c4a558d9986470f2ae1.css',
        'burton/styles.css':
          '/assets/burton/styles.ad5ded4c0a32258b9fb3fbf4aa587ed3.css',
        'dorothyperkins/styles-desktop.css':
          '/assets/dorothyperkins/styles-desktop.03dfe3e50a08492ab7088e2e274debe4.css',
        'dorothyperkins/styles-grid.css':
          '/assets/dorothyperkins/styles-grid.dd27d1702f4c07af8dbdef0de9f0583f.css',
        'dorothyperkins/styles-laptop.css':
          '/assets/dorothyperkins/styles-laptop.dd27d1702f4c07af8dbdef0de9f0583f.css',
        'dorothyperkins/styles-tablet.css':
          '/assets/dorothyperkins/styles-tablet.ae28a3cc44699106e2a68bacaab825b1.css',
        'dorothyperkins/styles.css':
          '/assets/dorothyperkins/styles.6843256cf8b34f5615b0eb37aa9d3862.css',
        'evans/styles-desktop.css':
          '/assets/evans/styles-desktop.fa6dcbb2647695f3785b0461552a73c0.css',
        'evans/styles-grid.css':
          '/assets/evans/styles-grid.cdc1132752f0058b7c6fd25ca659f09c.css',
        'evans/styles-laptop.css':
          '/assets/evans/styles-laptop.cdc1132752f0058b7c6fd25ca659f09c.css',
        'evans/styles-tablet.css':
          '/assets/evans/styles-tablet.684526e202ffe918eae1e756c739f8ac.css',
        'evans/styles.css':
          '/assets/evans/styles.e8f3b79944e51fcefe82536f9d8f6679.css',
        'missselfridge/styles-desktop.css':
          '/assets/missselfridge/styles-desktop.0bab879861496dc018a2a93c7093b236.css',
        'missselfridge/styles-grid.css':
          '/assets/missselfridge/styles-grid.978919c00e5c5c73cffb75e83077ca15.css',
        'missselfridge/styles-laptop.css':
          '/assets/missselfridge/styles-laptop.978919c00e5c5c73cffb75e83077ca15.css',
        'missselfridge/styles-tablet.css':
          '/assets/missselfridge/styles-tablet.1f1e1baf4b0be11bc3462adc26506af6.css',
        'missselfridge/styles.css':
          '/assets/missselfridge/styles.95dbc7ba7a0a98d6540ac5d3e82f9e91.css',
        'topman/styles-desktop.css':
          '/assets/topman/styles-desktop.e9ae81230c3b4e75ddc3fef00fb6ff60.css',
        'topman/styles-grid.css':
          '/assets/topman/styles-grid.0df5791391148ae2561d88dc02d866fc.css',
        'topman/styles-laptop.css':
          '/assets/topman/styles-laptop.0df5791391148ae2561d88dc02d866fc.css',
        'topman/styles-tablet.css':
          '/assets/topman/styles-tablet.2ad548ddafc69914a1fb8dd11bb1d25f.css',
        'topman/styles.css':
          '/assets/topman/styles.62ccd4e10c50552a9479cd47a2b8aa68.css',
        'topshop/styles-desktop.css':
          '/assets/topshop/styles-desktop.58671e1ddc586ed901ac3cf8202abfd4.css',
        'topshop/styles-grid.css':
          '/assets/topshop/styles-grid.c7a77d7c8e5c2cc50e116ae1ae29adb6.css',
        'topshop/styles-laptop.css':
          '/assets/topshop/styles-laptop.c7a77d7c8e5c2cc50e116ae1ae29adb6.css',
        'topshop/styles-tablet.css':
          '/assets/topshop/styles-tablet.2a6705741c64620e5425077c249aa719.css',
        'topshop/styles.css':
          '/assets/topshop/styles.953dd62878426ba3d3f3070f23888c7e.css',
        'wallis/styles-desktop.css':
          '/assets/wallis/styles-desktop.62b76314987d7d3a29d7b70eb05b00ce.css',
        'wallis/styles-grid.css':
          '/assets/wallis/styles-grid.3343237ff53f618d816151071a547bc4.css',
        'wallis/styles-laptop.css':
          '/assets/wallis/styles-laptop.3343237ff53f618d816151071a547bc4.css',
        'wallis/styles-tablet.css':
          '/assets/wallis/styles-tablet.d5ca6a7eee1fcb3769e437f2b9740df3.css',
        'wallis/styles.css':
          '/assets/wallis/styles.b0348172a698d0ecda4531fea35c729f.css',
      },
    },
  }
  const responsiveProps = {
    featureResponsive: true,
    media: 'desktop',
  }
  const mockStore = {
    getState: () => {},
    dispatch: () => {},
  }
  function mockLocalise() {}
  const renderComponent = testComponentHelper(Main.WrappedComponent, {
    context: { store: mockStore, l: mockLocalise },
  })

  describe('@events', () => {
    it('popstate event should ', () => {
      const dispatch = global.window.dispatchEvent
      global.window.dispatchEvent = jest.fn()
      const { instance } = renderComponent(initialProps)
      const customEvent = new Event('popstate')
      customEvent.state = undefined
      global.process.browser = true

      Object.defineProperty(global.navigator, 'userAgent', {
        get: () => 'CriOS',
      })

      instance.componentDidMount()

      dispatch(customEvent)

      expect(global.window.dispatchEvent).toHaveBeenCalledTimes(1)
      expect(global.window.dispatchEvent.mock.calls[0][0].type).toBe('popstate')
      expect(global.window.dispatchEvent.mock.calls[0][0].state.key).toBe(
        'custom'
      )
      global.window.dispatchEvent = dispatch
      global.process.browser = false
    })
  })
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('does not render TopNav Menu by default', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        ...responsiveProps,
        media: 'desktop',
      })
      expect(wrapper.find(TopNavMenu)).toHaveLength(0)
    })
    it('renders TopNavMenu when not responsive', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        media: 'desktop',
      })
      expect(wrapper.find(TopNavMenu)).toHaveLength(1)
    })
    it('renders TopNavMenu when media is mobile', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        media: 'mobile',
      })
      expect(wrapper.find(TopNavMenu)).toHaveLength(1)
    })
    it('renders TopNavMenu when forceMobileHeader=true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        ...responsiveProps,
        media: 'desktop',
        forceMobileHeader: true,
      })
      expect(wrapper.find(TopNavMenu)).toHaveLength(1)
    })
    it('with iOS', () => {
      expect(
        renderComponent({
          ...initialProps,
          iosAgent: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with error message', () => {
      expect(
        renderComponent({
          ...initialProps,
          errorMessage: {
            isOverlay: true,
          },
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with debug', () => {
      expect(
        renderComponent({
          ...initialProps,
          debugShown: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with Helmet enabled', () => {
      expect(
        renderComponent({
          ...initialProps,
          ...responsiveProps,
          googleSiteVerification: 'this_is_a_fake_google_site-verification',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with TacticalMessage enabled', () => {
      expect(
        renderComponent({
          ...initialProps,
          showTacticalMessage: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with responsive feature active and media is desktop', () => {
      expect(
        renderComponent({
          ...initialProps,
          ...responsiveProps,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with responsive feature active and media is mobile', () => {
      expect(
        renderComponent({
          ...initialProps,
          ...responsiveProps,
          media: 'mobile',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with responsive feature inactive and media is desktop', () => {
      expect(
        renderComponent({
          ...initialProps,
          media: 'desktop',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with sizeguideopen amd mobile true', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: true,
          sizeGuideOpen: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with sizeguideopen and mobile false', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: false,
          sizeGuideOpen: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with isHomePage flag to false', () => {
      expect(
        renderComponent({
          ...initialProps,
          isHomePage: false,
        })
          .wrapper.find('.Main-body')
          .hasClass('is-homePage')
      ).toBe(false)
    })

    it('with isHomePage flag to true', () => {
      expect(
        renderComponent({
          ...initialProps,
          isHomePage: true,
        })
          .wrapper.find('.Main-body')
          .hasClass('is-homePage')
      ).toBe(true)
    })

    /**
     * skipped test as it relies on a global called System.
     */
    it.skip('with debugShown', () => {
      const component = renderComponent({
        ...initialProps,
        debugShown: true,
      })
      expect(component.getTree()).toMatchSnapshot()
      const { wrapper } = component
      System.import = jest.fn()
      wrapper.find('#debug').prop('getFile')()
      expect(System.import).toHaveBeenCalledTimes(1)
      expect(System.import).toHaveBeenLastCalledWith('common/Debug/Debug.jsx')
    })

    it('with .Main-body having className "is-right" when topNavMenuOpen is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        topNavMenuOpen: true,
      })
      expect(wrapper.find('.Main-body').hasClass('is-right')).toBe(true)
    })

    it('with .Main-body NOT having className "is-right" when topNavMenuOpen is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        topNavMenuOpen: false,
      })
      expect(wrapper.find('.Main-body').hasClass('is-right')).toBe(false)
    })

    describe('rendering Helmet', () => {
      beforeEach(jest.resetAllMocks)
      afterAll(jest.restoreAllMocks)

      describe('deferred CSS', () => {
        const deferStylesSpy = jest.spyOn(assetUtils, 'deferStyles')

        const deferedStylesMock = deepFreeze([
          {
            rel: 'mocked-rel',
            href: 'mocked-url',
            media: 'defer-load',
            'data-breakpoint': '(min-width: 768px)',
          },
          {
            rel: 'mocked-rel-2',
            href: 'mocked-url-2',
            media: 'defer-load',
            'data-breakpoint': '(min-width: 992px)',
          },
        ])

        it('server side', () => {
          global.process.browser = false
          deferStylesSpy.mockImplementation(() => deferedStylesMock)

          const { wrapper } = renderComponent(initialProps)

          expect(deferStylesSpy).toHaveBeenCalledTimes(1)
          expect(deferStylesSpy).toHaveBeenCalledWith(
            initialProps.stylesheetProps
          )
          expect(
            wrapper
              .find(Helmet)
              .at(1)
              .prop('link')
          ).toEqual(deferedStylesMock)
        })

        it('client side', () => {
          global.process.browser = true

          const { wrapper } = renderComponent(initialProps)

          expect(deferStylesSpy).not.toHaveBeenCalled()
          expect(
            wrapper
              .find(Helmet)
              .at(1)
              .prop('link')
          ).toEqual(initialProps.stylesheetProps)

          global.process.browser = false
        })
      })

      it('with empty noscript prop', () => {
        const stylesheetProps = []
        const sandboxStylesheets = []
        const props = deepFreeze({
          ...initialProps,
          stylesheetProps,
          sandboxStylesheets,
        })
        const { wrapper } = renderComponent(props)
        expect(
          wrapper
            .find(Helmet)
            .first()
            .prop('noscript')
        ).toEqual([])
      })

      it('with correct noscript prop', () => {
        const stylesheetProps = [{ href: 1 }, { href: 2 }]
        const sandboxStylesheets = [{ href: 3 }, { href: 4 }, { href: 5 }]
        const props = deepFreeze({
          ...initialProps,
          stylesheetProps,
          sandboxStylesheets,
        })
        const { wrapper } = renderComponent(props)
        const expectedOutput = [
          { innerHTML: '<link rel="stylesheet" media="all" href="1" />' },
          { innerHTML: '<link rel="stylesheet" media="all" href="2" />' },
          { innerHTML: '<link rel="stylesheet" media="all" href="3" />' },
          { innerHTML: '<link rel="stylesheet" media="all" href="4" />' },
          { innerHTML: '<link rel="stylesheet" media="all" href="5" />' },
        ]
        expect(
          wrapper
            .find(Helmet)
            .first()
            .prop('noscript')
        ).toEqual(expectedOutput)
      })

      it('with correct meta description prop', () => {
        const props = deepFreeze({
          ...initialProps,
          googleSiteVerification: 'googleSiteVerification',
          metaDescription: 'meta description',
        })
        const { wrapper } = renderComponent(props)
        expect(
          wrapper
            .find(Helmet)
            .first()
            .prop('meta')
        ).toEqual([
          {
            name: 'google-site-verification',
            content: props.googleSiteVerification,
          },
          {
            name: 'og:site_name',
            content: 'Burton (UK)',
          },
          {
            name: 'description',
            content: props.metaDescription,
          },
        ])
      })

      it('with correct title prop', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(
          wrapper
            .find(Helmet)
            .first()
            .prop('title')
        ).toBe(initialProps.pageTitle)
      })
    })

    it('with .Main-body having className "is-left" when topNavMenuOpen is false, miniBagOpen is true and is on mobile', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        topNavMenuOpen: false,
        miniBagOpen: true,
        isMobile: true,
      })
      expect(wrapper.find('.Main-body').hasClass('is-left')).toBe(true)
    })
    it('with .Main-body NOT having className "is-left" when topNavMenuOpen is true, even if miniBagOpen is true and is on desktop', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        topNavMenuOpen: true,
        miniBagOpen: true,
        isMobile: true,
      })
      expect(wrapper.find('.Main-body').hasClass('is-left')).toBe(false)
    })
    it('with .Main-body NOT having className "is-left" when topNavMenuOpen is false, miniBagOpen is true and is on desktop', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        topNavMenuOpen: false,
        miniBagOpen: true,
        isMobile: false,
      })
      expect(wrapper.find('.Main-body').hasClass('is-left')).toBe(false)
    })
    it('with .Main-body NOT having className "is-left" when topNavMenuOpen is false, miniBagOpen is false and is on mobile', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        topNavMenuOpen: false,
        miniBagOpen: false,
        isMobile: true,
      })
      expect(wrapper.find('.Main-body').hasClass('is-left')).toBe(false)
    })
    it('with .Main-body having className "is-notScrollable" when refinementsOpen is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        refinementsOpen: true,
        debugShown: false,
      })
      expect(wrapper.find('.Main-body').hasClass('is-notScrollable')).toBe(true)
    })
    it('with .Main-body having className "is-notScrollable" when refinementsOpen is false, even if debugShown is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        refinementsOpen: false,
        debugShown: true,
      })
      expect(wrapper.find('.Main-body').hasClass('is-notScrollable')).toBe(true)
    })
    it('with .Main-body NOT having className "is-notScrollable" when refinementsOpen is false and debugShown is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        refinementsOpen: false,
        debugShown: false,
      })
      expect(wrapper.find('.Main-body').hasClass('is-notScrollable')).toBe(
        false
      )
    })

    it('with .Main-body having className "ios" when iosAgent is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        iosAgent: true,
      })
      expect(wrapper.find('.Main-body').hasClass('ios')).toBe(true)
    })
    it('with .Main-body NOT having className "ios" when iosAgent is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        iosAgent: false,
      })
      expect(wrapper.find('.Main-body').hasClass('ios')).toBe(false)
    })

    it('with .Main-body having className "is-stickyHeader" when stickyHeader is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        stickyHeader: true,
      })
      expect(wrapper.find('.Main-body').hasClass('is-stickyHeader')).toBe(true)
    })
    it('with `FooterContainer` not having className "Main-hideWhenModalOpen" when modalOpen and megaNavSelectedCategory is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        modalOpen: false,
        megaNavSelectedCategory: false,
      })
      expect(
        wrapper.find(FooterContainer).hasClass('Main-hideWhenModalOpen')
      ).toBe(false)
    })

    it('"Main-inner" section DOESNT have stickyMobile class if isRestrictedPath', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isRestrictedPath: true,
        isMobile: true,
        isStickyMobileEnabled: true,
      })
      expect(
        wrapper.find('.Main-inner').hasClass('Main-inner--stickyMobile')
      ).toBe(false)
    })

    it('"Main-body" section DOESNT have is-stickyMobileHeader class if isRestrictedPath', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isRestrictedPath: true,
        isMobile: true,
        isStickyMobileEnabled: true,
      })
      expect(wrapper.find('.Main-body').hasClass('is-stickyMobileHeader')).toBe(
        false
      )
    })

    it('"Main-inner" section DOESNT have stickyMobile class if NOT FF active', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isRestrictedPath: false,
        isMobile: true,
        isStickyMobileEnabled: false,
      })
      expect(
        wrapper.find('.Main-inner').hasClass('Main-inner--stickyMobile')
      ).toBe(false)
    })

    it('contains "Main-inner" section with stickyMobile class', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isRestrictedPath: false,
        isMobile: true,
        isStickyMobileEnabled: true,
      })
      expect(
        wrapper.find('.Main-inner').hasClass('Main-inner--stickyMobile')
      ).toBe(true)
    })

    describe('@FooterCheckout', () => {
      describe('Route specific rendering - in checkout or not', () => {
        const isMobile = false

        it('should not render the Footer Checkout if isMobile is false and isCheckout is false', () => {
          const props = {
            ...initialProps,
            isMobile,
            isCheckout: false,
          }

          const { wrapper } = renderComponent(props)
          expect(wrapper.find(FooterContainer).exists()).toBe(true)
          expect(wrapper.find(FooterCheckout).exists()).toBe(false)
        })

        it('should render the Footer Checkout if isMobile is false and isCheckout is true', () => {
          const props = {
            ...initialProps,
            isMobile,
            isCheckout: true,
          }

          const { wrapper } = renderComponent(props)
          expect(wrapper.find(FooterContainer).exists()).toBe(false)
          expect(wrapper.find(FooterCheckout).exists()).toBe(true)
        })
      })

      describe('Device dependent rendering when in checkout - isMobile or not', () => {
        const isCheckout = true

        it('should render the Footer Checkout when isMobile is false', () => {
          const props = {
            ...initialProps,
            isMobile: false,
            isCheckout,
          }

          const { wrapper } = renderComponent(props)
          expect(wrapper.find(FooterContainer).exists()).toBe(false)
          expect(wrapper.find(FooterCheckout).exists()).toBe(true)
        })

        it('should render the Footer Checkout when isMobile is true', () => {
          const props = {
            ...initialProps,
            isMobile: true,
            isCheckout,
          }

          const { wrapper } = renderComponent(props)
          expect(wrapper.find(FooterContainer).exists()).toBe(false)
          expect(wrapper.find(FooterCheckout).exists()).toBe(true)
        })
      })

      describe('Region dependent rendering', () => {
        const regions = ['uk', 'fr', 'us', 'de']
        const isCheckout = true
        const isMobile = false

        it('should render the Footer Checkout for each supported region', () => {
          regions.forEach((region) => {
            const props = {
              ...initialProps,
              isMobile,
              region,
              isCheckout,
            }

            const { wrapper } = renderComponent(props)
            expect(wrapper.find(FooterContainer).exists()).toBe(false)
            expect(wrapper.find(FooterCheckout).exists()).toBe(true)
          })
        })
      })
    })

    it('ContentOverlay enabled when sizeGuideOpen is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sizeGuideOpen: true,
      })
      expect(wrapper.find(ContentOverlay).prop('showOverlay')).toEqual(true)
    })
    it('ContentOverlay enabled when sizeGuideOpen is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sizeGuideOpen: false,
      })
      expect(wrapper.find(ContentOverlay).prop('showOverlay')).toEqual(false)
    })
    it('with touch as true', () => {
      expect(
        renderComponent({
          ...initialProps,
          touchEnabled: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('renders the Espot Header', () => {
      expect(
        renderComponent({
          ...initialProps,
          location: {
            pathname: '/anything',
          },
        }).wrapper.find(Espot).length
      ).toBe(1)
    })
    it('does not render the Espot Header when in checkout', () => {
      expect(
        renderComponent({
          ...initialProps,
          isCheckout: true,
        }).wrapper.find(Espot).length
      ).toBe(0)
    })
    it('does not render the Espot Header when in order-complete', () => {
      expect(
        renderComponent({
          ...initialProps,
          isOrderCompletePage: true,
        }).wrapper.find(Espot).length
      ).toBe(0)
    })
    it('renders the CheckoutMiniBag with path is part of checkout', () => {
      expect(
        renderComponent({
          ...initialProps,
          isCheckout: true,
        }).wrapper.find(CheckoutMiniBag).length
      ).toBe(1)
    })
    it('renders the MiniBag with path is not part of checkout', () => {
      expect(
        renderComponent({
          ...initialProps,
        }).wrapper.find(MiniBag).length
      ).toBe(1)
    })
    describe('megaNav overlay', () => {
      const setMegaNavSelectedCategoryMock = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        megaNavSelectedCategory: true,
        touchEnabled: false,
        stickyHeader: true,
        setMegaNavSelectedCategory: setMegaNavSelectedCategoryMock,
      })
      const megaNavOverlay = wrapper.find('.MegaNav-overlay').at(0)
      const mainWrapper = wrapper.find('.Main-inner--overlay')

      const megaNavOverlayFooter = wrapper.find('.MegaNav-overlay').at(1)
      const footerWrapper = wrapper.find('.FooterContainer-overlay')

      it('renders meganav overlay', () => {
        expect(megaNavOverlay.length).toBe(1)
        expect(megaNavOverlayFooter.length).toBe(1)
      })

      it('main wrapper should have overlay class', () => {
        expect(mainWrapper.hasClass('Main-inner--overlay')).toBe(true)
        expect(footerWrapper.hasClass('FooterContainer-overlay')).toBe(true)
      })

      it('calls setMegaNavSelectedCategory on touch end', () => {
        const mockEvent = { preventDefault: jest.fn() }
        megaNavOverlay.props().onTouchEnd(mockEvent)
        expect(setMegaNavSelectedCategoryMock).toHaveBeenCalledWith('')
        expect(mockEvent.preventDefault).toHaveBeenCalled()
      })

      it('should render no touch and sticky css class', () => {
        expect(megaNavOverlay.hasClass('MegaNav-overlay--noTouch')).toBe(true)
        expect(megaNavOverlay.hasClass('MegaNav-overlay--sticky')).toBe(true)

        expect(megaNavOverlayFooter.hasClass('MegaNav-overlay--noTouch')).toBe(
          true
        )
        expect(
          megaNavOverlayFooter.hasClass('MegaNav-overlay--stickyFooter')
        ).toBe(true)
      })
    })
  })

  describe('QubitReact - qubit-toast-notification', () => {
    const ddpProps = {
      brandCode: 'topshop',
      route: 'test/path',
      isMobile: true,
      isLoggedIn: true,
      ddpEndDate: '1 April 2020',
      isDDPUserInPreExpiryWindow: false,
      isDDPRenewablePostWindow: true,
      isDDPActiveUserPreRenewWindow: false,
      isDDPUser: false,
      ddpSavingsValue: 11,
      ddpExpressDeliveryPrice: 8,
      bagContainsDDPProduct: false,
      ddpLogoSrc: 'ddpLogoSrc/path',
    }

    const ddpDefaultSku = {
      sku: '100000012',
      unitPrice: 9.95,
    }

    let qubitWrapper
    let props
    beforeAll(() => {
      const { wrapper } = renderComponent({
        ...initialProps,
        ...ddpProps,
        ddpDefaultSku,
      })
      qubitWrapper = wrapper.find('#qubit-toast-notification')
      props = qubitWrapper.props()
    })

    it('should render qubit wrapper', () => {
      expect(qubitWrapper).not.toBeNull()
      expect(qubitWrapper).toHaveLength(1)
    })

    it('should pass ddpProps to qubit wrapper for notification correctly', () => {
      Object.entries(ddpProps).forEach(([key, value]) => {
        expect(props[key]).toBe(value)
      })
    })

    it('should pass ddpDefaultSku props correctly', () => {
      expect(props.ddpDefaultSku).toBe(ddpDefaultSku.sku)
      expect(props.ddpDefaultSkuPrice).toBe(ddpDefaultSku.unitPrice)
    })

    describe('isDDPUserInPreExpiryWindow and isDDPRenewablePostWindow', () => {
      it('pass shouldUseQubit false to withQubit if there are both false', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          ...ddpProps,
          isDDPUserInPreExpiryWindow: false,
          isDDPRenewablePostWindow: false,
          ddpDefaultSku,
        })
        qubitWrapper = wrapper.find('#qubit-toast-notification')

        expect(qubitWrapper.prop('shouldUseQubit')).toBe(false)
      })
      it('pass shouldUseQubit true to withQubit if there one of them is true', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          ...ddpProps,
          isDDPUserInPreExpiryWindow: false,
          isDDPRenewablePostWindow: true,
          ddpDefaultSku,
        })
        qubitWrapper = wrapper.find('#qubit-toast-notification')

        expect(qubitWrapper.prop('shouldUseQubit')).toBe(true)
      })
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => jest.resetAllMocks())
    afterEach(() => {
      global.process.browser = false
    })
    describe('componentDidMount', () => {
      const findAddListenerCall = (findCall) =>
        global.window.addEventListener.mock.calls.find(findCall)

      it('should call initShoppingBag if the current location path isnt "order-complete"', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.initShoppingBag).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.initShoppingBag).toHaveBeenCalledTimes(1)
      })

      it('should not call initShoppingBag if current location is "order-complete"', () => {
        const { instance } = renderComponent({
          ...initialProps,
          location: {
            pathname: '/order-complete',
          },
        })
        instance.componentDidMount()
        expect(instance.props.initShoppingBag).not.toHaveBeenCalled()
      })

      it('should call getAccount, if authenticated', () => {
        const { instance } = renderComponent(initialProps)
        global.process.browser = true
        getItem.mockReturnValueOnce('yes')
        instance.componentDidMount()
        expect(instance.props.getAccount).toHaveBeenCalledTimes(1)
      })

      it('should not call getAccount if in My Account', () => {
        const { instance } = renderComponent({
          ...initialProps,
          location: { pathname: '/my-account' },
        })
        global.process.browser = true
        getItem.mockReturnValueOnce('yes')
        instance.componentDidMount()
        expect(instance.props.getAccount).not.toHaveBeenCalled()
      })

      it('should not call getAccount if not in My Account and not authenticated', () => {
        const { instance } = renderComponent(initialProps)
        global.process.browser = true
        getItem.mockReturnValueOnce(null)
        instance.componentDidMount()
        expect(instance.props.getAccount).not.toHaveBeenCalled()
      })

      it('should call windowResizeEvent and updateTouch(), updateAgent() and initFeaturesListener() and should add event listeners if global.process.browser', () => {
        const { instance } = renderComponent(initialProps)
        global.process.browser = true
        instance.windowResizeEvent = jest.fn()
        global.window.addEventListener = jest.fn(
          global.window.addEventListener.bind(global.window)
        )
        expect(instance.windowResizeEvent).not.toHaveBeenCalled()
        expect(instance.props.updateAgent).not.toHaveBeenCalled()
        expect(instance.props.initFeaturesListener).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.windowResizeEvent).toHaveBeenCalledTimes(1)
        expect(instance.props.updateAgent).toHaveBeenCalledTimes(1)
        expect(instance.props.initFeaturesListener).toHaveBeenCalledTimes(1)

        expect(
          findAddListenerCall(([name]) => name === 'resize')
        ).toMatchSnapshot()

        expect(
          findAddListenerCall(([name]) => name === 'popstate')
        ).toMatchSnapshot()

        const messageHandlers = global.window.addEventListener.mock.calls.filter(
          ([name]) => name === 'message'
        )
        expect(
          messageHandlers.find(([, func]) =>
            /punchoutPostMessageHandler/.test(func.name)
          )
        ).toBeTruthy()
      })

      it('should not call getDefaultWishlist if wishlist wishlistedItemIds have been fetched', () => {
        global.process.browser = true
        const { instance } = renderComponent({
          ...initialProps,
          wishlistedItemIds: [],
        })
        instance.componentDidMount()
        expect(instance.props.getDefaultWishlist).not.toHaveBeenCalled()
      })

      it('should call getDefaultWishlist if wishlist wishlistedItemIds have not been fetched', () => {
        global.process.browser = true
        const { instance } = renderComponent(initialProps)
        instance.componentDidMount()
        expect(instance.props.getDefaultWishlist).toHaveBeenCalled()
      })

      describe('state sync', () => {
        const syncHandlersWithoutShoppingBag = without(
          [SHOPPING_BAG_SYNC_KEY],
          Object.keys(storageHandlers)
        )

        it('should call synState with all sync handler keys', () => {
          global.process.browser = true
          const { instance } = renderComponent(initialProps)
          instance.componentDidMount()
          expect(initialProps.syncState).toHaveBeenCalledTimes(1)
          expect(initialProps.syncState).toHaveBeenCalledWith(
            Object.keys(storageHandlers)
          )
        })

        it('should call syncState with all sync handler keys on checkout 404s', () => {
          global.process.browser = true
          const { instance } = renderComponent({
            ...initialProps,
            location: {
              pathname: '/checkout/boo',
            },
            isNotFound: true,
          })
          instance.componentDidMount()
          expect(initialProps.syncState).toHaveBeenCalledTimes(1)
          expect(initialProps.syncState).toHaveBeenCalledWith(
            Object.keys(storageHandlers)
          )
        })

        it('should call synState with sync handler keys without shoppingBag on checkout pages', () => {
          global.process.browser = true
          const props = {
            ...initialProps,
            ...{
              location: { pathname: '/checkout' },
            },
          }
          const { instance } = renderComponent(props)
          instance.componentDidMount()
          expect(initialProps.syncState).toHaveBeenCalledTimes(1)
          expect(initialProps.syncState).toHaveBeenCalledWith(
            syncHandlersWithoutShoppingBag
          )
        })

        it('should call synState with sync handler keys without shoppingBag on order summary', () => {
          global.process.browser = true
          const props = {
            ...initialProps,
            ...{
              location: { pathname: '/order-complete' },
            },
          }
          const { instance } = renderComponent(props)
          instance.componentDidMount()
          expect(initialProps.syncState).toHaveBeenCalledTimes(1)
          expect(initialProps.syncState).toHaveBeenCalledWith(
            syncHandlersWithoutShoppingBag
          )
        })
      })
    })

    describe('windowResizeEvent', () => {
      afterEach(() => jest.resetAllMocks())
      it('should update media type', () => {
        const { instance } = renderComponent({
          ...initialProps,
          ...responsiveProps,
        })
        expect(instance.props.setAndUpdateMediaType).not.toHaveBeenCalled()
        expect(setItem).not.toHaveBeenCalled()
        expect(instance.props.updateWindow).not.toHaveBeenCalled()
        instance.windowResizeEvent()
        expect(instance.props.updateWindow).toHaveBeenCalledTimes(1)
        expect(instance.props.setAndUpdateMediaType).toHaveBeenCalled()
        expect(setItem).toHaveBeenCalledTimes(1)
        expect(instance.props.setAndUpdateMediaType).lastCalledWith('laptop')
        expect(setItem).toHaveBeenCalledWith('deviceType', 'laptop')
      })
      it("should not call update Media type, if it hasn't changed ", () => {
        const { instance } = renderComponent({
          ...initialProps,
          media: 'laptop',
        })
        instance.windowResizeEvent()
        expect(instance.props.setAndUpdateMediaType).not.toHaveBeenCalled()
      })
    })
  })
  describe('@needs', () => {
    beforeEach(() => jest.resetAllMocks())
    it('contains a call to navigationActions.getCategories', () => {
      expect(getCategories).toHaveBeenCalledTimes(0)
      Main.needs[0]()
      expect(getCategories).toHaveBeenCalledTimes(1)
    })
    it('contains a call to navigationActions.getMegaNav', () => {
      expect(getMegaNav).toHaveBeenCalledTimes(0)
      Main.needs[1]()
      expect(getMegaNav).toHaveBeenCalledTimes(1)
    })
    it('contains a call to siteOptionsActions.getSiteOptions', () => {
      expect(getSiteOptions).toHaveBeenCalledTimes(0)
      Main.needs[2]()
      expect(getSiteOptions).toHaveBeenCalledTimes(1)
    })
    it('contains a call to cmsActions.getContent with arguments for the first espots.home', async () => {
      featureSelectors.isFeatureDeferCmsContentEnabled.mockReturnValue(true)
      const dispatch = jest.fn()
      const getState = jest.fn()
      await Main.needs[3]()(dispatch, getState)
      expect(dispatch).toBeCalledWith(getContent())
    })
    it('contains a call to cmsActions.getContent with arguments for the second espots.home', () => {
      expect(getContent).toHaveBeenCalledTimes(0)
      Main.needs[4]()
      expect(getContent).toHaveBeenCalledTimes(1)
      expect(getContent).lastCalledWith(
        null,
        espots.tacticalMessage[0],
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })
    it('contains a call to footerActions.getFooterContent', () => {
      expect(getFooterContent).toHaveBeenCalledTimes(0)
      Main.needs[5]()
      expect(getFooterContent).toHaveBeenCalledTimes(1)
    })
    it('it calls getCountries', () => {
      expect(getCountries).toHaveBeenCalledTimes(0)
      Main.needs[6]()
      expect(getCountries).toHaveBeenCalledTimes(1)
    })
    it('it calls getDefaultWishlist', () => {
      expect(getDefaultWishlist).toHaveBeenCalledTimes(0)
      Main.needs[7]()
      expect(getDefaultWishlist).toHaveBeenCalledTimes(1)
    })
  })
  describe('GeoIP Modal', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('renders modal if there is a `redirectURL`', () => {
      const redirectURL = 'https://m.topshop.com'
      const onModalClose = jest.fn()
      const { instance } = renderComponent({
        ...initialProps,
        redirectURL,
        onModalClose,
      })

      instance.UNSAFE_componentWillMount()
      expect(instance.props.showModal).toHaveBeenCalledWith(
        <GeoIPModal
          store={mockStore}
          handleClose={instance.handleClose}
          handleRemoveCloseHandler={instance.removeCloseHandler}
        />,
        { mode: 'slideUpFromBottom' }
      )
    })

    it('does not render modal if there is no `redirectURL`', () => {
      const { instance } = renderComponent({
        ...initialProps,
        redirectURL: undefined,
      })

      instance.UNSAFE_componentWillMount()
      expect(instance.props.showModal).not.toHaveBeenCalled()
    })

    it('prevents `closeModalHandler` from being called multiple times', () => {
      const { instance } = renderComponent({
        ...initialProps,
        redirectURL: undefined,
      })
      const cb = jest.fn(() => Promise.resolve())
      instance.handleClose(cb)

      instance.closeModal()
      instance.closeModal()

      expect(cb).toHaveBeenCalledTimes(1)
    })

    it('clicking overlay closes modal after geo pixel', () => {
      let children
      initialProps.showModal.mockImplementation((x) => {
        children = x
      })
      const defaultState = reducer(undefined, { type: '__init__' })
      const context = {
        store: {
          subscribe: () => {},
          dispatch: () => {},
          getState: () => ({
            ...defaultState,
            modal: { open: true, mode: 'normal', children },
            geoIP: {
              redirectURL: 'http://m.topshop.com/en/tsuk/clothing/dress-1',
              geoISO: 'GB',
              hostname: 'm.us.topshop.com',
              userISOPreference: 'GB',
            },
            features: { status: { FEATURE_GEOIP: true } },
            config: topshop.find((conf) => conf.storeCode === 'tsus'),
            footer: {
              config: getFooterConfig('topshop', 'uk'),
            },
          }),
        },
        l: (x) => x,
      }
      const wrapper = mount(
        <Main.WrappedComponent
          {...{
            ...initialProps,
            modalOpen: true,
            redirectURL: 'https://m.topshop.com',
          }}
        />,
        { context }
      )
      wrapper
        .find(ContentOverlay)
        .find('div')
        .simulate('click')

      wrapper
        .find(GeoIPModal)
        .find('img')
        .forEach((img) => {
          expect(initialProps.closeModal).not.toHaveBeenCalled()
          img.props().onLoad()
        })
      expect(initialProps.closeModal).not.toHaveBeenCalled()

      return wrapper.instance().closePromise.then(() => {
        expect(initialProps.closeModal).toHaveBeenCalled()
        initialProps.showModal.mockRestore()
      })
    })
  })

  describe('Test Jenkins Migration', () => {
    it('passes on this test', () => {
      expect(true).toBe(true)
    })
  })

  describe('Test Jenkins Migration - 2', () => {
    it('passes on this test', () => {
      expect(true).toBe(true)
    })
  })
})
