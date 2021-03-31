import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import ProductMock from '../../../../../../test/mocks/product-detail'

import ProductDetail from '../../ProductDetail/ProductDetail'
import Bundles from '../../Bundles/Bundles'
import OutOfStockProductDetail from '../../OutOfStockProductDetail/OutOfStockProductDetail'
import Helmet from 'react-helmet'
import SeoSchema from '../../../common/SeoSchema/SeoSchema'
import Loader from '../../../common/Loader/Loader'
import NoSearchResults from '../../../common/NoSearchResults/NoSearchResults'

import PdpContainer, { getSuitableOGImage } from '../PdpContainer'
import BackToTop from '../../../common/BackToTop/BackToTop'
import ProductsBreadCrumbs from '../../../common/ProductsBreadCrumbs/ProductsBreadCrumbs'

import * as productsActions from '../../../../actions/common/productsActions'
import * as geoIPActions from '../../../../actions/common/geoIPActions'
import * as sandBoxActions from '../../../../actions/common/sandBoxActions'
import * as carouselActions from '../../../../actions/common/carousel-actions'

jest.mock('../../../../actions/common/carousel-actions')
jest.mock('../../../../actions/common/productsActions')
jest.mock('../../../../actions/common/geoIPActions')

jest.mock('../../../../actions/common/sandBoxActions', () => ({
  showTacticalMessage: jest.fn(),
  getContent: jest.fn(),
}))

describe('getSuitableOGImage', () => {
  it('gets a suitable image given a valid product and returns a URL', () => {
    expect(getSuitableOGImage(ProductMock)).toEqual(
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_normal.jpg'
    )
  })

  it('returns an empty string when a product without images is given', () => {
    const productWithoutAssets = {
      ...ProductMock,
      assets: [],
    }

    expect(getSuitableOGImage(productWithoutAssets)).toEqual('')
  })
})

describe('PdpContainer', () => {
  global.window.scrollTo = jest.fn()

  const props = {
    product: ProductMock,
    getProductDetail: jest.fn(() => Promise.resolve()),
    getProductStock: jest.fn(),
    clearProduct: jest.fn(),
    scrollToTopFeature: false,
    params: {
      productId: '123123',
      identifier: 'Product-identifier',
    },
    location: {
      pathname: '/',
    },
    hostname: 'hostname.com',
    showTacticalMessage: jest.fn(),
    hideTacticalMessage: jest.fn(),
    globalEspotName: 'globalEspotName',
    prevPath: '/previous-cat-visited',
    categoryBreadcrumbs: [
      { label: 'breadcrumb from user journey', url: '/' },
      { label: 'up to the category page' },
    ],
    breadcrumbsProduct: [
      { label: 'breadcrumb from the server' },
      { label: 'reflect canonical url product path' },
    ],
    updateUniversalVariable: jest.fn(),
    isFeatureHttpsCanonicalEnabled: false,
    isMobile: false,
  }
  const renderComponent = testComponentHelper(PdpContainer.WrappedComponent, {
    disableLifecycleMethods: false,
  })

  beforeEach(() => {
    props.getProductDetail.mockReturnValueOnce(Promise.resolve())
    props.prevPath = '/previous-cat-visited'
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('when the component mounts', () => {
    const browser = process.browser
    beforeEach(() => {
      process.browser = true
      jest.spyOn(global.document, 'dispatchEvent')
    })

    afterEach(() => {
      process.browser = browser
    })

    it(
      'gets the products, scrolls to the top of the page, displays the tactical message and hooks Qubit tag ' +
        '"iProspect Floodlight PDP"',
      async () => {
        const { wrapper } = await renderComponent({ ...props, product: {} })

        expect(wrapper.find('.PdpContainer')).toBeTruthy()

        expect(props.getProductDetail).toHaveBeenCalledWith(props.params)
        expect(global.window.scrollTo).toHaveBeenCalledWith(0, 0)
        expect(props.showTacticalMessage).toHaveBeenCalled()
        expect(global.document.dispatchEvent).toHaveBeenCalled()
      }
    )

    it('fetches stock only if product data exists', async () => {
      document.cookie = 'authenticated=yes'

      await renderComponent(props)

      expect(props.getProductDetail).not.toHaveBeenCalled()
      expect(props.getProductStock).toHaveBeenCalledWith(
        props.product.productId
      )

      document.cookie = 'authenticated=; max-age=-1'
    })

    describe('when pdp data is partially preloaded', () => {
      it('fetches the full product', async () => {
        await renderComponent({
          ...props,
          product: {
            ...props.product,
            ...{ isPreloaded: true },
          },
        })

        expect(props.getProductDetail).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when the component unmounts', () => {
    it('hides the tactical message and clears the product ', async () => {
      const { wrapper } = await renderComponent(props)

      wrapper.unmount()

      expect(props.clearProduct).toHaveBeenCalled()
      expect(props.hideTacticalMessage).toHaveBeenCalled()
    })
  })

  describe('when the component updates', () => {
    it('gets the new product details if the url contains "/product/" and is different than the previous one', async () => {
      let p
      const { wrapper } = await renderComponent(props)
      const nextProps = {
        location: {
          pathname: '/product/',
        },
        params: {
          productId: '123145',
        },
        getProductDetail: jest.fn(() => {
          p = Promise.resolve()
          return p
        }),
        product: {
          productId: '123145',
        },
      }

      wrapper.setProps({ ...nextProps })
      await p

      expect(nextProps.getProductDetail).toHaveBeenCalled()
      expect(global.window.scrollTo.mock.calls.length).toEqual(1)
      expect(global.window.scrollTo).toHaveBeenCalledWith(0, 0)
    })

    it('gets the new product details for PDP deprecated URL /webapp/wcs/stores/servlet/ProductDisplay', async () => {
      let p
      const { wrapper } = await renderComponent(props)
      const nextProps = {
        location: {
          pathname: '/webapp/wcs/stores/servlet/ProductDisplay',
          query: {
            productId: '123',
          },
        },
        getProductDetail: jest.fn(() => {
          p = Promise.resolve()
          return p
        }),
      }

      wrapper.setProps({ ...nextProps })
      await p

      expect(nextProps.getProductDetail).toHaveBeenCalledTimes(1)
      expect(nextProps.getProductDetail).toHaveBeenCalledWith({
        identifier: '123',
      })
    })

    it('does not refetch the new product details if the same product is passed as a prop', async () => {
      const { wrapper } = await renderComponent(props)
      const nextProps = {
        product: ProductMock,
        getProductDetail: jest.fn(() => Promise.resolve()),
        params: {
          productId: '123123',
        },
        location: {
          pathname: '/',
        },
      }

      wrapper.setProps({ ...nextProps })

      expect(nextProps.getProductDetail).not.toHaveBeenCalled()

      expect(global.window.scrollTo.mock.calls.length).toEqual(1)
    })

    it('gets the new product', async () => {
      const productId = '423423'
      let p

      const { wrapper } = await renderComponent(props)
      const nextProps = {
        ...props,
        ...{
          params: { productId },
          location: {
            pathname: `/product/${productId}`,
          },
          getProductDetail: jest.fn(() => {
            p = Promise.resolve()
            return p
          }),
        },
      }
      wrapper.setProps({ ...nextProps })
      await p

      expect(nextProps.getProductDetail).toHaveBeenCalledTimes(1)
      expect(nextProps.getProductDetail).toHaveBeenCalledWith(
        { productId },
        false
      )
    })
  })

  describe('breadCrumbs', () => {
    describe('breadcrumb from SSR', () => {
      // setting those props to reflect their state on SSR
      props.prevPath = 'direct link'
      props.categoryBreadcrumbs = []

      const { wrapper, instance } = renderComponent(props)
      instance.handleBreadcrumbs = jest.fn()

      it('should use the breadcrumbsProduct props', () => {
        expect(instance.handleBreadcrumbs).not.toHaveBeenCalled()
        expect(wrapper.find(ProductsBreadCrumbs).props()).toEqual({
          breadcrumbs: props.breadcrumbsProduct,
        })
        expect(instance.state.breadcrumbs).toBeNull()
      })
    })

    describe('breadcrumb client side', () => {
      props.prevPath = '/previous-cat-visited'
      props.categoryBreadcrumbs = [
        { label: 'breadcrumb from user journey', url: '/' },
        { label: 'up to the category page' },
      ]
      const { wrapper, instance } = renderComponent(props)
      instance.handleBreadcrumbs = jest.fn()

      it('should use the local state breadCrumb', () => {
        expect(instance.handleBreadcrumbs).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.handleBreadcrumbs).toHaveBeenCalled()
        expect(instance.state.breadcrumbs).toEqual([
          { ...props.categoryBreadcrumbs[0] },
          {
            ...props.categoryBreadcrumbs[1],
            url: props.prevPath,
          },
        ])
        expect(wrapper.find(ProductsBreadCrumbs).props()).toEqual({
          breadcrumbs: [
            { ...props.categoryBreadcrumbs[0] },
            {
              ...props.categoryBreadcrumbs[1],
              url: props.prevPath,
            },
            {
              label: props.product.name,
            },
          ],
        })
      })

      it('should properly redirect to homepage when user coming from search', () => {
        props.prevPath = '/search/'
        props.categoryBreadcrumbs = [{ label: 'Home' }]
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(ProductsBreadCrumbs).props()).toEqual({
          breadcrumbs: [
            { label: 'Home', url: '/' },
            { label: props.product.name },
          ],
        })
      })

      it('should use server side rendered breadcrumbs when the user is coming from the recommendation carousel', async () => {
        props.prevPath = '/previous-cat-visited'
        props.categoryBreadcrumbs = [
          { label: 'breadcrumb from user journey', url: '/' },
          { label: 'up to the category page' },
        ]

        const { wrapper, instance } = renderComponent(props)
        instance.componentDidMount()
        expect(instance.state.breadcrumbs).toEqual([
          { ...props.categoryBreadcrumbs[0] },
          {
            ...props.categoryBreadcrumbs[1],
            url: props.prevPath,
          },
        ])

        const nextProps = {
          ...props,
          location: { pathname: '/to-new-product-from-recommendation' },
          params: { identifier: 'another-product-identifier' },
          product: { list: 'PDP Why Not Try' },
        }
        wrapper.setProps({ ...nextProps })

        expect(instance.state.breadcrumbs).toBeNull()
      })

      it('should display server side rendered breadcrumbs if product list is not defined', () => {
        const { wrapper, instance } = renderComponent({
          ...props,
          product: {
            ...props.product,
            list: undefined,
          },
        })
        expect(wrapper.find(ProductsBreadCrumbs).props()).toEqual({
          breadcrumbs: props.breadcrumbsProduct,
        })
        expect(instance.state.breadcrumbs).toBeNull()
      })

      it('should display Breadcrumbs on Desktop reflecting the user Journey including product name', () => {
        expect(wrapper.find(ProductsBreadCrumbs).props()).toEqual({
          breadcrumbs: [
            ...props.categoryBreadcrumbs,
            { label: props.product.name },
          ],
        })
      })

      it('should pass mobileBreadcrumbs props on mobile reflecting the user Journey to ProductDetails without product name', () => {
        // props.isMobile = true
        const { wrapper, instance } = renderComponent({
          ...props,
          isMobile: true,
        })
        instance.renderProductDetails(props.categoryBreadcrumbs)
        expect(wrapper.find(ProductDetail).props()).toEqual({
          product: props.product,
          location: { pathname: '/' },
          mobileBreadcrumbs: props.categoryBreadcrumbs,
        })
      })

      describe('display', () => {
        it('should display breadcrumbs in the pdpContainer on desktop', () => {
          const containerPDP = wrapper.find('.PdpContainer')
          expect(containerPDP.find(ProductsBreadCrumbs)).toHaveLength(1)
        })
        it('should not display breadcrumbs in the pdpContainer on mobile', () => {
          const { wrapper } = renderComponent({ ...props, isMobile: true })
          const containerPDP = wrapper.find('.PdpContainer')
          expect(containerPDP.find(ProductsBreadCrumbs)).toHaveLength(0)
        })
      })
    })
  })

  describe('@render', () => {
    it('displays product detail child', () => {
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(ProductDetail).props()).toEqual({
        product: props.product,
        location: { pathname: '/' },
        mobileBreadcrumbs: false,
      })
    })

    it('displays ProductsBreadCrumbs', () => {
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(ProductsBreadCrumbs)).toHaveLength(1)
    })

    it('displays bundles child', () => {
      const product = Object.assign({}, props.product, {
        isBundleOrOutfit: true,
      })
      const { wrapper } = renderComponent({ ...props, product })

      expect(wrapper.find(Bundles).props()).toEqual({ product })
    })

    it('renders OutOfStockProductDetail component', () => {
      const product = { ...props.product, items: [] }
      const { wrapper } = renderComponent({ ...props, product })
      expect(wrapper.find(OutOfStockProductDetail).props()).toEqual({ product })
    })

    describe('title meta tag', () => {
      it('renders as expected', () => {
        const { wrapper } = renderComponent(props)

        expect(wrapper.find(Helmet).props()).toMatchObject({
          title: 'Tencel Buffalo Duster Coat',
        })
      })
    })

    describe('description meta tag', () => {
      it('renders as expected', () => {
        const { wrapper } = renderComponent(props)

        expect(wrapper.find(Helmet).props().meta).toContainEqual(
          expect.objectContaining({
            name: 'description',
            content:
              'Channel a &#x27;90s-inspired look with our pair of on-trend, versatile baggy jeans in white, by Boutique. 100% Cotton. Machine wash.**PLEASE NOTE THIS ITEM CAN ONLY BE RETURNED VIA POST. STORES ARE UNABLE TO RETURN THESE ITEMS FOR YOU. ALL UK POSTAL RETURNS ARE FREE. INTERNATIONAL POSTAL CHARGES WILL VARY.',
          })
        )
      })
    })

    describe('canonical url', () => {
      it('uses the "canonicalUrl" prop if available', () => {
        const { wrapper } = renderComponent({
          ...props,
          product: { ...ProductMock, canonicalUrl: '/whatever' },
        })

        expect(wrapper.find(Helmet).props().link).toContainEqual(
          expect.objectContaining({
            rel: 'canonical',
            href: 'hostname.com/whatever',
          })
        )
      })

      it('prefixes with "https" if feature FEATURE_HTTPS_CANONICAL is enabled', () => {
        const { wrapper } = renderComponent({
          ...props,
          product: { ...ProductMock, canonicalUrl: '/whatever' },
          isFeatureHttpsCanonicalEnabled: true,
        })
        expect(wrapper.find(Helmet).props().link).toContainEqual(
          expect.objectContaining({
            rel: 'canonical',
            href: 'https://hostname.com/whatever',
          })
        )
      })
    })

    describe('open graph meta tags', () => {
      it('render as expected', () => {
        const { wrapper } = renderComponent(props)

        expect(wrapper.find(Helmet).props().meta).toEqual(
          expect.arrayContaining([
            {
              name: 'og:title',
              content: 'Tencel Buffalo Duster Coat',
            },
            { name: 'og:type', content: 'product' },
            {
              name: 'og:description',
              content:
                'Channel a &#x27;90s-inspired look with our pair of on-trend, versatile baggy jeans in white, by Boutique. 100% Cotton. Machine wash.**PLEASE NOTE THIS ITEM CAN ONLY BE RETURNED VIA POST. STORES ARE UNABLE TO RETURN THESE ITEMS FOR YOU. ALL UK POSTAL RETURNS ARE FREE. INTERNATIONAL POSTAL CHARGES WILL VARY.',
            },
            {
              name: 'og:image',
              content:
                'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_normal.jpg',
            },
          ])
        )
      })
    })

    it('<PdpContainer /> includes SeoSchema for product', () => {
      const { wrapper } = renderComponent(props)
      const { location, product } = props
      const expected = {
        location,
        type: 'Product',
        data: product,
      }

      expect(wrapper.find(SeoSchema).props()).toEqual(expected)
    })

    it('should not enable back-to-top button when feature is disabled', () => {
      const { wrapper } = renderComponent({
        ...props,
        scrollToTopFeature: false,
      })
      expect(wrapper.find(BackToTop).length).toBe(0)
    })

    it('should not enable back-to-top button when feature is enabled', () => {
      const { wrapper } = renderComponent({
        ...props,
        scrollToTopFeature: true,
      })
      expect(wrapper.find(BackToTop).length).toBe(1)
    })

    describe('loader', () => {
      it('should be displayed when product is not provided', () => {
        const { wrapper } = renderComponent({
          ...props,
          product: null,
        })

        expect(wrapper.find(Loader).length).toBe(1)
      })

      it('should be displayed when not productId is provided', () => {
        const { wrapper } = renderComponent({
          ...props,
          product: {
            success: true,
            productId: null,
          },
        })

        expect(wrapper.find(Loader).length).toBe(1)
      })
    })

    describe('no search results', () => {
      it('should be displayed when not product.success is false', () => {
        const { wrapper } = renderComponent({
          ...props,
          product: {
            success: false,
          },
        })

        expect(wrapper.find(NoSearchResults).length).toBe(1)
      })
    })
  })

  describe('block render until', () => {
    it('initialises the product details carousel', async () => {
      await PdpContainer.needs[0]()

      expect(carouselActions.initCarousel).toHaveBeenCalledWith(
        'productDetail',
        1,
        0
      )
    })

    it('initialises the bundles carousel', async () => {
      await PdpContainer.needs[1]()

      expect(carouselActions.initCarousel).toHaveBeenCalledWith('bundles', 1, 0)
    })

    it('gets the products and sets the redirect URL for PDP', async () => {
      const grouping = 'gr'
      const dispatchMock = jest.fn(() => Promise.resolve())
      const getStateMock = jest.fn(() => ({
        currentProduct: {
          grouping,
        },
      }))

      await PdpContainer.needs[2]()(dispatchMock, getStateMock)

      expect(productsActions.getProductDetail).toHaveBeenCalled()
      expect(dispatchMock.mock.calls.length).toEqual(2)
      expect(geoIPActions.setRedirectURLForPDP).toHaveBeenCalledWith(grouping)
    })

    it('it gets the mobilePDPESpotPos1 CMS page', async () => {
      await PdpContainer.needs[4]()

      expect(sandBoxActions.getContent).toHaveBeenCalledWith(
        null,
        'mobilePDPESpotPos1',
        'espot'
      )
    })

    it('it gets the mobilePDPESpotPos2 CMS page', async () => {
      await PdpContainer.needs[5]()

      expect(sandBoxActions.getContent).toHaveBeenCalledWith(
        null,
        'mobilePDPESpotPos2',
        'espot'
      )
    })
  })
})
