import { clone } from 'ramda'
import React from 'react'
import { shallow } from 'enzyme'
import testComponentHelper, {
  until,
} from '../../../../../../test/unit/helpers/test-component'
import productMockData from '../../../../../../test/mocks/product-detail'
import { forAnalyticsDecorator as createMockStoreForAnalytics } from 'test/unit/helpers/mock-store'
import QubitReact from 'qubit-react/wrapper'

import ProductDetail, { WrappedProductDetail } from '../ProductDetail'
import ProductDescription from '../../../common/ProductDescription/ProductDescription'

import ProductSizes from '../../../common/ProductSizes/ProductSizes'
import SizeGuide from '../../../common/SizeGuide/SizeGuide'
import AddToBag from '../../../common/AddToBag/AddToBag'
import ProductsBreadCrumbs from '../../../common/ProductsBreadCrumbs/ProductsBreadCrumbs'
import FitAttributes from '../../../common/FitAttributes/FitAttributes'
import Message from '../../../common/FormComponents/Message/Message'
import FreeShippingMessage from '../../../common/FreeShippingMessage/FreeShippingMessage'
import ProductCarouselThumbnails from '../../ProductCarouselThumbnails/ProductCarouselThumbnails'
import ProductMedia from '../../../common/ProductMedia/ProductMedia'
import Loader from '../../../common/Loader/Loader'
import HistoricalPrice from '../../../common/HistoricalPrice/HistoricalPrice'
import DressipiRecommendationsRail from '../../../common/Recommendations/DressipiRecommendationsRail'
import BnplPaymentsBreakdown from '../../../common/BnplPaymentsBreakdown/BnplPaymentsBreakdown'

import Recommendations from '../../../common/Recommendations/Recommendations'
import { analyticsPdpClickEvent } from '../../../../analytics/tracking/site-interactions'

import prevPropsMockData from './prevProps.data'

const bnplPaymentOptions = {
  klarna: { instalments: 3, amount: '12.00' },
  clearpay: { instalments: 4, amount: '9.00' },
}

const productMock = {
  ...productMockData,
  amplienceAssets: {
    images: ['http://www.images.com/root'],
    video: 'some video',
  },
  bnplPaymentOptions,
}

jest.mock('../../../../analytics/tracking/site-interactions', () => ({
  analyticsPdpClickEvent: jest.fn(),
}))

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))
jest.mock('../../../../lib/product-utilities', () => ({
  getMatchingAttribute: jest.fn(() => 'abc'),
  calculateBagDiscount: jest.fn(() => 0),
  checkIfOneSizedItem: jest.fn(() => false),
}))

import FindInStore from '../../../common/FindInStore/FindInStore'

jest.mock('../../../../lib/get-product-route', () => ({
  getRouteFromUrl: jest.fn(),
}))
jest.mock('react-router', () => ({
  browserHistory: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}))

import { getRouteFromUrl } from '../../../../lib/get-product-route'
import { browserHistory } from 'react-router'
import FindInStoreButton from '../../../common/FindInStoreButton/FindInStoreButton'
import WishlistButton from '../../../common/WishlistButton/WishlistButton'

describe('</ProductDetail>', () => {
  const context = {
    l: jest.fn((txt) => `${txt}`),
    store: createMockStoreForAnalytics(),
  }
  const renderComponent = testComponentHelper(WrappedProductDetail, { context })

  const initialProps = {
    brandName: 'topshop',
    storeCode: 'tsuk',
    maximumNumberOfSizeTiles: 8,
    siteId: 12556,
    product: productMock,
    activeItem: productMock.items[0],
    location: { pathname: '...' },
    region: 'uk',
    visited: [],
    sandboxPages: {
      mobileESpotPDPPos1: {},
    },
    isPersonalisedEspotsEnabled: false,
    updateActiveItemQuanity: jest.fn(),
    enableDropdownForLongSizes: false,
    enableSizeGuideButtonAsSizeTile: false,
    isFeatureFindInStoreEnabled: true,
    isFeatureWishlistEnabled: false,
    isFeatureCarouselThumbnailEnabled: false,
    isFeaturePriceSavingEnabled: false,
    isMobile: true,
    showItemError: false,
    scrollToTopFeature: false,
    analyticsProductDetail: jest.fn(),
    updateFindInStoreActiveItem: jest.fn(),
    closeModal: jest.fn(),
    showModal: jest.fn(),
    setModalChildren: jest.fn(),
    toggleModal: jest.fn(),
    setModalMode: jest.fn(),
    deleteRecentlyViewedProduct: jest.fn(),
    setStoreStockList: jest.fn(),
    extractRecentlyDataFromProduct: jest.fn(),
    updateShowItemsError: jest.fn(),
    getPDPEspots: jest.fn(),
    updateActiveItem: jest.fn(),
    updateSwatch: jest.fn(),
    updateActiveItemQuantity: jest.fn(),
    setPredecessorPage: () => {},
    isFeatureDressipiRecommendationsEnabled: false,
    isFeatureBnplPaymentsBreakdownPdp: false,
    mobileBreadcrumbs: [],
  }

  const itemLongSize = {
    sku: '609',
    size: 'Size 6 years',
    quantity: 1,
  }

  const e = {
    preventDefault: () => {},
  }

  // TODO Add missing test cases for snapshots
  describe('@renders', () => {
    it('should have all required components / elements, should have code display the correct text, should have the right information', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('should render desktop when isMobile is false', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should show the loader when product is preloaded', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        product: {
          ...productMock,
          isPreloaded: true,
        },
      })
      expect(wrapper.find(Loader).length).toBe(1)
    })

    it('should display ProductsBreadcrumbs on Mobile', () => {
      const { wrapper } = renderComponent(initialProps)
      const breadCrumbs = wrapper.find(ProductsBreadCrumbs)
      expect(breadCrumbs).toHaveLength(1)
    })
    it('should not display ProductsBreadcrumbs on desktop', () => {
      const { wrapper } = renderComponent({ ...initialProps, isMobile: false })
      const breadCrumbs = wrapper.find(ProductsBreadCrumbs)
      expect(breadCrumbs).toHaveLength(0)
    })

    it('should pass data to ProductSizes when selectedOosItem is defined', () => {
      expect(
        renderComponent({
          ...initialProps,
          selectedOosItem: {},
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('AmplienceAssets', () => {
      it('should pass amplience images to ProductCarouselThumbnails', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(
          wrapper.find(ProductCarouselThumbnails).prop('amplienceImages')
        ).toBe(productMock.amplienceAssets.images)
      })

      it('should pass amplience urls to ProductMedia', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find(ProductMedia).prop('amplienceAssets')).toBe(
          productMock.amplienceAssets
        )
      })
    })

    describe('<ProductDescription />', () => {
      it('should pass seeMoreValue to ProductDescription', () => {
        const seeMoreValue = [
          {
            seeMoreLabel: 'Jeans',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreUrl: '/_/N-2bu3Z1xjf',
          },
        ]
        const { wrapper } = renderComponent({
          ...initialProps,
          product: {
            ...productMock,
            seeMoreValue,
          },
        })
        expect(wrapper.find(ProductDescription).prop('seeMoreValue')).toEqual(
          seeMoreValue
        )
      })
    })

    describe('SizeBlock', () => {
      it('should show with correct props when isMobile is true and number of size tiles less than maximum', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isMobile: true,
          maximumNumberOfSizeTiles: 8,
        })

        expect(wrapper.find(ProductSizes).prop('className')).toBe(
          'ProductSizes--pdp ProductSizes--sizeGuideBox'
        )

        expect(
          wrapper
            .find(SizeGuide)
            .at(0)
            .prop('displayAsBox')
        ).toBeFalsy()
      })

      it('should show with correct props when isMobile is true and number of size tiles greater than maximum', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isMobile: true,
          maximumNumberOfSizeTiles: 2,
        })

        expect(wrapper.find(ProductSizes).prop('className')).toBe(
          'ProductSizes--pdp ProductSizes--sizeGuideDropdown'
        )

        expect(wrapper.find(SizeGuide).prop('displayAsBox')).toBeFalsy()
      })
      it('should show with correct props when desktop and number of size tiles less than maximum', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isMobile: false,
          maximumNumberOfSizeTiles: 8,
        })

        expect(wrapper.find(ProductSizes).prop('className')).toBe(
          'ProductSizes--pdp ProductSizes--sizeGuideBox'
        )
        expect(wrapper.find(SizeGuide).prop('displayAsBox')).toBeTruthy()
      })
      it('should show with correct props when desktop and number of size tiles greater than maximum', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isMobile: false,
          maximumNumberOfSizeTiles: 2,
        })

        expect(wrapper.find(ProductSizes).prop('className')).toBe(
          'ProductSizes--pdp ProductSizes--sizeGuideDropdown'
        )
        expect(
          wrapper
            .find(SizeGuide)
            .at(0)
            .prop('displayAsBox')
        ).toBeFalsy()
      })
    })

    describe('espot positioning', () => {
      it('Should render espots in the correct position for Wallis', () => {
        const { getTree } = renderComponent({
          ...initialProps,
          brandName: 'wallis',
          espot: {
            cmsData: {
              CEProductEspotCol2Pos1: {
                isPlpEspot: false,
                responsiveCMSUrl: '/cms/ping/pong',
              },
            },
          },
        })

        expect(getTree()).toMatchSnapshot()
      })

      it('Should render espots in the correct position for other brands', () => {
        const { getTree } = renderComponent({
          ...initialProps,
          brandName: 'topshop',
          espot: {
            cmsData: {
              CEProductEspotCol2Pos1: {
                isPlpEspot: false,
                responsiveCMSUrl: '/cms/ping/pong',
              },
            },
          },
        })

        expect(getTree()).toMatchSnapshot()
      })
    })

    it('should add a class to the carousel container when the carousel thumbnail feature is enabled', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isFeatureCarouselThumbnailEnabled: true,
      })

      expect(
        wrapper
          .find('.Carousel-container')
          .hasClass('Carousel-container--thumbnailEnabled')
      ).toEqual(true)
    })

    it('should not add a class to the carousel container when the carousel thumbnail feature is disabled', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isFeatureCarouselThumbnailEnabled: false,
      })

      expect(
        wrapper
          .find('.Carousel-container')
          .hasClass('Carousel-container--thumbnailEnabled')
      ).toEqual(false)
    })

    it('should hide the buy now / and add to bag buttons when it is out of stock', () => {
      expect(
        renderComponent({
          ...initialProps,
          product: {
            ...productMock,
            items: productMock.items.filter((i) => i.quantity === 0),
          },
          selectedOosItem: {},
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should hide the size guide when there is only one size available', () => {
      const items = [
        {
          sku: '602016000925081',
          size: 'ONE',
          quantity: 10,
          selected: false,
          wcsSizeADValueId: '10',
        },
      ]
      expect(
        renderComponent({
          ...initialProps,
          product: {
            ...productMock,
            items,
          },
          selectedOosItem: {},
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with valid sandboxPages ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sandboxPages: {
          mobilePDPESpotPos1: {
            props: {
              data: {
                pageName: 'fake-espot',
                pageData: ['espot'],
              },
            },
          },
        },
      })
      expect(
        wrapper.find('.ProductDetail-deliveryInfo').prop('className')
      ).toBe('ProductDetail-deliveryInfo ')
    })
    it('with sandboxPages having no mobilePDPESpotPos1 ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sandboxPages: {},
      })
      expect(
        wrapper.find('.ProductDetail-deliveryInfo').prop('className')
      ).toBe('ProductDetail-deliveryInfo is-hidden')
    })
    it('with sandboxPages having mobilePDPESpotPos1 as error ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sandboxPages: {
          mobilePDPESpotPos1: {
            props: {
              data: {
                error: true,
              },
            },
          },
        },
      })
      expect(
        wrapper.find('.ProductDetail-deliveryInfo').prop('className')
      ).toBe('ProductDetail-deliveryInfo is-hidden')
    })
    it('with sandboxPages having mobilePDPESpotPos1 with no pageName ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sandboxPages: {
          mobilePDPESpotPos1: {
            props: {
              data: {
                pageData: ['espot'],
              },
            },
          },
        },
      })
      expect(
        wrapper.find('.ProductDetail-deliveryInfo').prop('className')
      ).toBe('ProductDetail-deliveryInfo is-hidden')
    })
    it('with sandboxPages having mobilePDPESpotPos1 with pageName having error ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sandboxPages: {
          mobilePDPESpotPos1: {
            props: {
              data: {
                pageName: 'is an error',
                pageData: ['espot'],
              },
            },
          },
        },
      })
      expect(
        wrapper.find('.ProductDetail-deliveryInfo').prop('className')
      ).toBe('ProductDetail-deliveryInfo is-hidden')
    })
    it('with sandboxPages having mobilePDPESpotPos1 with pageData missing ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sandboxPages: {
          mobilePDPESpotPos1: {
            props: {
              data: {
                pageName: 'fake-espot',
                pageData: undefined,
              },
            },
          },
        },
      })
      expect(
        wrapper.find('.ProductDetail-deliveryInfo').prop('className')
      ).toBe('ProductDetail-deliveryInfo is-hidden')
    })
    it('with sandboxPages having mobilePDPESpotPos1 with pageData empty array ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        sandboxPages: {
          mobilePDPESpotPos1: {
            props: {
              data: {
                pageName: 'fake-espot',
                pageData: [],
              },
            },
          },
        },
      })
      expect(
        wrapper.find('.ProductDetail-deliveryInfo').prop('className')
      ).toBe('ProductDetail-deliveryInfo is-hidden')
    })
    describe('with activeProductWithInventory', () => {
      it('shows FulfilmentInfo when in mobile and isCFSIEspotEnabled is true', () => {
        const { getTree } = renderComponent({
          ...initialProps,
          isCFSIEspotEnabled: true,
          isMobile: true,
          activeProductWithInventory: { sku: '602016000925078' },
        })
        expect(getTree()).toMatchSnapshot()
      })
      it('shows FulfilmentInfo when in desktop and isCFSIEspotEnabled is true', () => {
        const { getTree } = renderComponent({
          ...initialProps,
          isCFSIEspotEnabled: true,
          activeProductWithInventory: { sku: '602016000925078' },
        })
        expect(getTree()).toMatchSnapshot()
      })
    })

    it('should not render `AddToBag` if none of the product‘s items have a quantity', () => {
      const props = clone(initialProps)
      props.product.items = [{ quantity: 0 }, { quantity: 0 }]
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(AddToBag).exists()).toBeFalsy()
    })

    it('should not render a Find in Store button when the find in store feature flag is disabled', () => {
      const props = {
        ...initialProps,
        isFeatureFindInStoreEnabled: false,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(FindInStoreButton).length).toBe(0)
    })

    it('should render a Wishlist icon when the wishlist feature flag is enabled', () => {
      const props = {
        ...initialProps,
        isFeatureWishlistEnabled: true,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(WishlistButton).length).toBe(1)
    })

    it('should pass `product.deliveryMessage` prop to <AddToBag >', () => {
      const deliveryMessage = 'Order in 9 hrs 23 mins for next day delivery'
      const product = {
        ...initialProps.product,
        deliveryMessage,
      }
      const { wrapper } = renderComponent({
        ...initialProps,
        product,
      })
      expect(wrapper.find(AddToBag).prop('deliveryMessage')).toBe(
        deliveryMessage
      )
    })
    it('`FitAttributes` should have correct `fitAttributes` prop', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(FitAttributes).prop('fitAttributes')).toBe(
        initialProps.product.tpmLinks[0]
      )
    })

    it('`FitAttributes` `swatchChange` can set swatchTriggeredChange to true', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      const swatchChange = wrapper.find(FitAttributes).prop('swatchChange')
      expect(instance.swatchTriggeredChange).toBe(false)
      swatchChange()
      expect(instance.swatchTriggeredChange).toBe(true)
    })

    it('should render error message', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        showItemError: true,
      })

      const messageNode = wrapper.find(Message)
      expect(messageNode.exists()).toBeTruthy()
      expect(messageNode.prop('type')).toBe('error')
    })

    it('should render <FreeShippingMessage> if FF is active', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isThresholdEnabled: true,
      })

      const FreeShippingNode = wrapper.find(FreeShippingMessage)
      expect(FreeShippingNode.exists()).toBeTruthy()
    })

    describe('<HistoricalPrice />', () => {
      it('should have false value for prop shouldShowSaving if `isFeaturePriceSavingEnabled` is false', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find(HistoricalPrice).prop('shouldShowSaving')).toBe(
          false
        )
      })
      it('should have true value for prop shouldShowSaving if `isFeaturePriceSavingEnabled` is true and not on mobile', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeaturePriceSavingEnabled: true,
          isMobile: false,
        })
        expect(wrapper.find(HistoricalPrice).prop('shouldShowSaving')).toBe(
          true
        )
      })
      it('should have false value for prop shouldShowSaving if `isFeaturePriceSavingEnabled` is true but on mobile', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeaturePriceSavingEnabled: true,
        })
        expect(wrapper.find(HistoricalPrice).prop('shouldShowSaving')).toBe(
          false
        )
      })
    })

    describe('@qubit', () => {
      const { wrapper } = renderComponent(initialProps)
      const qubitWrapper = wrapper.find(QubitReact)
      const WithQubit = wrapper.find('WithQubit')
      it('should render two qubit react wrappers', () => {
        expect(qubitWrapper.length).toBe(2)
      })
      it('should render a qubit react wrapper for ProductDetail with correct id', () => {
        expect(qubitWrapper.at(0).props().id).toBe('qubit-pdp-ProductDetail')
      })
      it('should render a qubit react wrapper for HistoricalPrice with correct id', () => {
        expect(qubitWrapper.at(1).props().id).toBe('qubit-pdp-HistoricalPrice')
      })
      it('should render a qubit react wrapper for Dressipi outfits with correct id', () => {
        expect(WithQubit.at(0).props().id).toBe('dressipi-outfits')
      })
    })

    describe('when `isFeatureDressipiRecommendationsEnabled` is true', () => {
      it('should render the `<DressipiReccomendationsRail />` component and not the `<Recommendations />` one', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeatureDressipiRecommendationsEnabled: true,
        })
        const dressipiRecommendations = wrapper.find(
          DressipiRecommendationsRail
        )
        const recommendations = wrapper.find(Recommendations)

        expect(recommendations).toHaveLength(0)
        expect(dressipiRecommendations).toHaveLength(1)
      })
    })

    describe('when `isFeatureDressipiRecommendationsEnabled` is false', () => {
      it('should render the`<Recommendations />` component and not the `<DressipiReccomendationsRail />` one', () => {
        const { wrapper } = renderComponent(initialProps)
        const dressipiRecommendations = wrapper.find(
          DressipiRecommendationsRail
        )
        const recommendations = wrapper.find(Recommendations)

        expect(dressipiRecommendations).toHaveLength(0)
        expect(recommendations).toHaveLength(1)
      })
    })

    describe('<BnplPaymentsBreakdown/>', () => {
      it('should render the`<BnplPaymentsBreakdown />` if FEAUTRE_BNPL_PAYMENTS_BREAKDOWN_PDP is turned on', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeatureBnplPaymentsBreakdownPdp: true,
        })
        const bnplPaymentsBreakdown = wrapper.find(BnplPaymentsBreakdown)

        expect(bnplPaymentsBreakdown).toHaveLength(1)
        expect(bnplPaymentsBreakdown.props().bnplPaymentOptions).toEqual(
          bnplPaymentOptions
        )
      })

      it('should not render the`<BnplPaymentsBreakdown />` if FEAUTRE_BNPL_PAYMENTS_BREAKDOWN_PDP is turned off', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeatureBnplPaymentsBreakdownPdp: false,
        })
        const bnplPaymentsBreakdown = wrapper.find(BnplPaymentsBreakdown)

        expect(bnplPaymentsBreakdown).toHaveLength(0)
      })
    })
  })

  describe('@lifeCycles', () => {
    describe('constructor', () => {
      const visitedLength = 2
      const { instance } = renderComponent({ ...initialProps, visitedLength })
      it('should set initial values', () => {
        expect(instance.shouldRemoveIfRedirectionFromBundles).toBe(true)
      })
      it('should set swatchTriggeredChange to false', () => {
        instance.swatchTriggeredChange = false
      })
    })
    describe('componentDidMount', () => {
      beforeEach(() => {
        initialProps.getPDPEspots.mockClear()
      })

      it('should call extractRecentlyDataFromProduct', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          instance.props.extractRecentlyDataFromProduct
        ).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(
          instance.props.extractRecentlyDataFromProduct
        ).toHaveBeenCalledTimes(1)
        expect(
          instance.props.extractRecentlyDataFromProduct
        ).toHaveBeenLastCalledWith(instance.props.product)
      })

      it('should call getPDPEspots if personalised espots are enabled', () => {
        initialProps.getPDPEspots.mockClear()
        const { instance } = renderComponent({
          ...initialProps,
          isPersonalisedEspotsEnabled: true,
        })
        expect(instance.props.getPDPEspots).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.getPDPEspots).toHaveBeenCalled()
      })

      it('should not call getPDPEspots if personalised espots are not enabled', () => {
        initialProps.getPDPEspots.mockClear()
        const { instance } = renderComponent({
          ...initialProps,
          isPersonalisedEspotsEnabled: false,
        })
        instance.componentDidMount()
        expect(instance.props.getPDPEspots).not.toHaveBeenCalled()
      })
    })

    describe('UNSAFE_componentWillReceiveProps', () => {
      it('should not call updateFindInStoreActiveItem if activeItem has not changed', () => {
        const { instance } = renderComponent(initialProps)
        instance.UNSAFE_componentWillReceiveProps(instance.props)
        expect(
          instance.props.updateFindInStoreActiveItem
        ).not.toHaveBeenCalled()
      })

      it('should call updateFindInStoreActiveItem activeItem prop has changed', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          instance.props.updateFindInStoreActiveItem
        ).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps({
          ...instance.props,
          activeItem: { sku: 'new' },
        })
        expect(
          instance.props.updateFindInStoreActiveItem
        ).toHaveBeenCalledTimes(1)
      })

      it('should call closeModal in case we decrease the size of the window to make isMobile true', () => {
        const renderedComponent = renderComponent({
          ...initialProps,
          closeModal: jest.fn(),
          isMobile: false,
        })
        const { instance } = renderedComponent
        expect(instance.props.closeModal).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps({
          isMobile: true,
        })
        expect(instance.props.closeModal).toHaveBeenCalledTimes(1)
      })
    })

    describe('componentDidUpdate', () => {
      it('should call extractRecentlyDataFromProduct', () => {
        jest.clearAllMocks()
        const { instance } = renderComponent(initialProps)
        expect(
          instance.props.extractRecentlyDataFromProduct
        ).not.toHaveBeenCalled()
        instance.componentDidUpdate({ visitedLength: 3 })
        expect(
          instance.props.extractRecentlyDataFromProduct
        ).toHaveBeenCalledTimes(1)
        expect(
          instance.props.extractRecentlyDataFromProduct
        ).toHaveBeenLastCalledWith(instance.props.product)
      })
      it('should remove extra entry in visited if reditection from bundles', () => {
        const visitedLength = 3
        const removeFromVisited = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          visitedLength,
          removeFromVisited,
        })
        expect(instance.props.removeFromVisited).not.toHaveBeenCalled()
        const prevProps = {
          ...initialProps,
          visitedLength: 2,
          removeFromVisited,
        }
        instance.componentDidUpdate(prevProps)
        expect(instance.props.removeFromVisited).toHaveBeenCalledTimes(1)
        expect(instance.props.removeFromVisited).toHaveBeenCalledWith(1)
        expect(instance.shouldRemoveIfRedirectionFromBundles).toBe(false)
      })
      it('should not remove extra entry in visited if not reditection from bundles', () => {
        const visitedLength = 2
        const removeFromVisited = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          visitedLength,
          removeFromVisited,
        })
        instance.shouldRemoveIfRedirectionFromBundles = false
        expect(instance.props.removeFromVisited).not.toHaveBeenCalled()
        const prevProps = {
          ...initialProps,
          visitedLength: 2,
          removeFromVisited,
        }
        instance.componentDidUpdate(prevProps)
        expect(instance.props.removeFromVisited).not.toHaveBeenCalled()
        expect(instance.shouldRemoveIfRedirectionFromBundles).toBe(false)
      })

      describe('updateSwatch', () => {
        it('should call updateSwatch if swatchTriggeredChange is true', () => {
          const updateSwatch = jest.fn()
          const { instance } = renderComponent({
            ...initialProps,
            updateSwatch,
          })
          instance.swatchTriggeredChange = true
          instance.componentDidUpdate(prevPropsMockData)
          expect(updateSwatch).toHaveBeenCalledWith(initialProps.product)
        })
        it('should not call updateSwatch if swatchTriggeredChange is false', () => {
          const updateSwatch = jest.fn()
          const { instance } = renderComponent({
            ...initialProps,
            updateSwatch,
          })
          instance.swatchTriggeredChange = false
          instance.componentDidUpdate(prevPropsMockData)
          expect(updateSwatch).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('@functions', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('clickCarouselThumbs', () => {
      it('should set video enabled to false, and change the carousel index to the one given', () => {
        const setVideoEnabled = jest.fn()
        const setCarouselIndex = jest.fn()
        const props = { ...initialProps, setCarouselIndex }
        const wrapper = shallow(<WrappedProductDetail {...props} />, {
          context,
        })
        wrapper.instance().setVideoEnabled = setVideoEnabled

        wrapper.instance().clickCarouselThumbs(321)

        expect(setVideoEnabled).toHaveBeenCalledWith(false)
        expect(setCarouselIndex).toHaveBeenCalledWith('productDetail', 321)
      })
    })

    it('@clickFindInStore for mobile', () => {
      const isMobile = true
      const location = {
        pathname: 'prod',
      }
      const storeListOpen = true

      const { instance } = renderComponent({
        ...initialProps,
        isMobile,
        location,
        storeListOpen,
      })
      expect(instance.props.setStoreStockList).toHaveBeenCalledTimes(0)
      expect(instance.props.setModalChildren).toHaveBeenCalledTimes(0)
      expect(instance.props.setModalMode).toHaveBeenCalledTimes(0)
      expect(instance.props.toggleModal).toHaveBeenCalledTimes(0)
      expect(instance.props.showModal).toHaveBeenCalledTimes(0)
      instance.clickFindInStore(e)
      expect(instance.props.setStoreStockList).toHaveBeenCalledTimes(1)
      expect(instance.props.setModalChildren).toHaveBeenCalledTimes(1)
      expect(instance.props.setModalMode).toHaveBeenCalledTimes(1)
      expect(instance.props.toggleModal).toHaveBeenCalledTimes(1)
      expect(instance.props.showModal).toHaveBeenCalledTimes(0)
      expect(analyticsPdpClickEvent).toHaveBeenCalledWith(
        `findinstore-${instance.props.product.productId}`
      )
    })
    it('@clickFindInStore for desktop', () => {
      const isMobile = false
      const location = {
        pathname: 'prod',
      }
      const storeListOpen = true

      const { instance } = renderComponent({
        ...initialProps,
        isMobile,
        location,
        storeListOpen,
      })
      expect(instance.props.setStoreStockList).toHaveBeenCalledTimes(0)
      expect(instance.props.setModalChildren).toHaveBeenCalledTimes(0)
      expect(instance.props.setModalMode).toHaveBeenCalledTimes(0)
      expect(instance.props.toggleModal).toHaveBeenCalledTimes(0)
      expect(instance.props.showModal).toHaveBeenCalledTimes(0)
      instance.clickFindInStore(e)
      expect(instance.props.setStoreStockList).toHaveBeenCalledTimes(0)
      expect(instance.props.setModalChildren).toHaveBeenCalledTimes(0)
      expect(instance.props.setModalMode).toHaveBeenCalledTimes(0)
      expect(instance.props.toggleModal).toHaveBeenCalledTimes(0)
      expect(instance.props.showModal).toHaveBeenCalledTimes(1)
      expect(analyticsPdpClickEvent).toHaveBeenCalledWith(
        `findinstore-${instance.props.product.productId}`
      )
    })
    it('@getFindInStoreButton to link', () => {
      const { instance } = renderComponent(initialProps)
      const params = {
        text: 'link',
      }
      instance.getFindInStoreButton(params)
      expect(instance.getFindInStoreButton(params)).toMatchSnapshot()
    })
    describe('@hasItemsBiggerSizes', () => {
      it('should return true when item size has more than 2 chars and enableDropdownForLongSizes is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          enableDropdownForLongSizes: true,
          product: {
            ...initialProps.product,
            items: [itemLongSize],
          },
        })
        expect(instance.hasItemsBiggerSizes()).toBe(true)
      })
      it('should return false when item size has more than 2 chars and enableDropdownForLongSizes is false', () => {
        const { instance } = renderComponent({
          ...initialProps,
          enableDropdownForLongSizes: false,
          product: {
            ...initialProps.product,
            items: [itemLongSize],
          },
        })
        expect(instance.hasItemsBiggerSizes()).toBe(false)
      })
      it('should return false when item size has less than 2  and enableDropdownForLongSizes is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          enableDropdownForLongSizes: true,
        })
        expect(instance.hasItemsBiggerSizes()).toBe(false)
      })
    })
    it('@renderFindInStoreButton to button', () => {
      const { instance } = renderComponent(initialProps)
      expect(instance.renderFindInStoreButton('button')).toMatchSnapshot()
    })
    describe('@setVideoEnabled', () => {
      const { instance } = renderComponent(initialProps)
      it('Default', () => {
        expect(instance.state.showProductVideo).toBe(false)
      })
      it('With argument set', () => {
        instance.setVideoEnabled(true)
        expect(instance.state.showProductVideo).toBe(true)
        instance.setVideoEnabled(false)
        expect(instance.state.showProductVideo).toBe(false)
      })
      it('No argument, toggling', () => {
        instance.setVideoEnabled()
        expect(instance.state.showProductVideo).toBe(true)
        instance.setVideoEnabled()
        expect(instance.state.showProductVideo).toBe(false)
      })
    })
    describe('@renderFulfilmentDetails', () => {
      it('should not render FulfilmentInfo if activeProductWithInventory is null', () => {
        const { instance } = renderComponent({ ...initialProps })

        expect(instance.renderFulfilmentDetails()).toMatchSnapshot()
      })
      it('should render FulfilmentInfo', () => {
        const { instance } = renderComponent({
          ...initialProps,
          activeProductWithInventory: { sku: '602016000925078' },
        })
        expect(instance.renderFulfilmentDetails()).toMatchSnapshot()
      })
    })
  })

  describe('@events', () => {
    describe('onSelect swatches', () => {
      const path =
        'http://ts-tst1.tst.digital.arcadiagroup.co.uk/en/tsuk/product/nashville-tubular-sandals-7739127'
      const event = {
        preventDefault: jest.fn(),
      }

      it('should call relevant functions when product is loaded', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        wrapper.find('Swatches').simulate('select', event, { productUrl: path })
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
        expect(getRouteFromUrl).toHaveBeenCalledTimes(1)
        expect(getRouteFromUrl).toHaveBeenLastCalledWith(path)
        expect(instance.swatchTriggeredChange).toBe(true)
      })
    })
    describe('clickHandler findInStoreButton', () => {
      describe('on mobile', () => {
        let renderedComponent
        beforeEach(() => {
          renderedComponent = renderComponent({
            ...initialProps,
            isMobile: true,
            region: 'uk',
          })
          const findInStoreButton = renderedComponent.wrapper.find(
            'FindInStoreButton'
          )
          findInStoreButton
            .find('[type="mobile"]')
            .props()
            .onClick()
        })

        afterEach(() => {
          jest.resetAllMocks()
        })

        it('should call setModalChildren', () => {
          const { instance } = renderedComponent
          expect(instance.props.setModalChildren).toHaveBeenCalledTimes(1)
          expect(instance.props.setModalChildren).toHaveBeenLastCalledWith(
            <FindInStore
              className="ProductDetail-findInStore"
              product={instance.props.product}
              siteId={instance.props.siteId}
            />
          )
        })
        it('should call setModalMode', () => {
          const { instance } = renderedComponent
          expect(instance.props.setModalMode).toHaveBeenCalledTimes(1)
          expect(instance.props.setModalMode).toHaveBeenLastCalledWith(
            'rollFull'
          )
        })
        it('should call toggleModal', () => {
          const { instance } = renderedComponent
          expect(instance.props.toggleModal).toHaveBeenCalledTimes(1)
        })
        it('should not call setStoreStockList if storeListOpen is false', () => {
          const { instance } = renderedComponent
          expect(instance.props.setStoreStockList).not.toHaveBeenCalled()
        })
        it('should call browserHistory.push', () => {
          const { instance } = renderedComponent
          expect(browserHistory.push).toHaveBeenCalledTimes(1)
          expect(browserHistory.push).toHaveBeenLastCalledWith(
            `${instance.props.location.pathname}#`
          )
        })
        it('should call setStoreStockList if storeListOpen is true', () => {
          const { instance, wrapper } = renderComponent({
            ...initialProps,
            isMobile: true,
            region: 'uk',
            storeListOpen: true,
          })
          const findInStoreButton = wrapper.find('FindInStoreButton')
          findInStoreButton
            .find('[type="mobile"]')
            .props()
            .onClick()
          expect(instance.props.setStoreStockList).toHaveBeenCalledTimes(1)
          expect(instance.props.setStoreStockList).toHaveBeenLastCalledWith(
            !instance.props.setStoreStockList
          )
        })
      })

      describe('on desktop', () => {
        let renderedComponent
        beforeAll(() => {
          renderedComponent = renderComponent({
            ...initialProps,
            isMobile: false,
            region: 'uk',
          })

          const findInStoreButton = renderedComponent.wrapper.find(
            'FindInStoreButton'
          )
          findInStoreButton
            .find('[type="mobile"]')
            .props()
            .onClick()
        })
        it('should call showModal', () => {
          const { instance } = renderedComponent
          expect(instance.props.showModal).toHaveBeenCalledTimes(1)
          expect(instance.props.showModal).toHaveBeenLastCalledWith(
            <FindInStore
              className="productdetail-findInStore"
              product={instance.props.product}
              siteId={instance.props.siteId}
            />,
            { mode: 'storeLocator' }
          )
        })
      })
    })

    describe('on shouldAddToBag', () => {
      it('should return `true` if there is an `activeItem` and it has an `sku`', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find(AddToBag).prop('shouldAddToBag')()).toBe(true)
      })

      it('should call `updateShowItemsError` if there isn‘t an `activeItem`', () => {
        const updateShowItemsErrorMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          activeItem: {},
          updateShowItemsError: updateShowItemsErrorMock,
        })
        wrapper.find(AddToBag).prop('shouldAddToBag')()
        expect(updateShowItemsErrorMock).toHaveBeenCalled()
      })
    })
  })

  describe('@decorator', () => {
    describe('analytics decorator', () => {
      it('wraps the component with the correct analytics property', () => {
        const mockStore = createMockStoreForAnalytics({ preloadedState: {} })
        const shallowOptions = { context: { store: mockStore, ...context } }

        const wrapper = shallow(<ProductDetail />, shallowOptions)

        expect(ProductDetail.displayName).toMatch(/AnalyticsDecorator/)
        const analyticsDecorator = until(
          wrapper,
          'AnalyticsDecorator',
          shallowOptions
        )
        const analyticsInstance = analyticsDecorator.instance()
        expect(analyticsInstance.pageType).toBe('pdp')
        expect(analyticsInstance.isAsync).toBe(true)
      })
    })
  })
})
