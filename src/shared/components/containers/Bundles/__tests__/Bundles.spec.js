import React from 'react'
import { mergeDeepRight } from 'ramda'
import { shallow } from 'enzyme'
import bundleMocksFixed from '../../../../../../test/mocks/bundleMocksFixed'
import testComponentHelper, { until } from 'test/unit/helpers/test-component'
import { forAnalyticsDecorator as createMockStoreForAnalytics } from 'test/unit/helpers/mock-store'

import Bundles, { WrappedBundles } from '../Bundles'
import BundlesAddAll from '../../../common/BundlesAddAll/BundlesAddAll'
import ProductMedia from '../../../common/ProductMedia/ProductMedia'
import ProductCarouselThumbnails from '../../ProductCarouselThumbnails/ProductCarouselThumbnails'
import DressipiRecommendationsRail from '../../../common/Recommendations/DressipiRecommendationsRail'
import Recommendations from '../../../common/Recommendations/Recommendations'
import BnplPaymentsBreakdown from '../../../common/BnplPaymentsBreakdown/BnplPaymentsBreakdown'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

describe('<Bundles />', () => {
  const renderComponent = testComponentHelper(WrappedBundles)
  const bnplPaymentOptions = {
    klarna: { instalments: 3, amount: '12.00' },
    clearpay: { instalments: 4, amount: '9.00' },
  }
  const defaultProps = {
    product: {
      name: 'Humbug Stripe Suit Jacket & Trousers Set',
      lineNumber: 'BUNDLE_03P13MLIL03P14MLIL',
      unitPrice: '115.00',
      bnplPaymentOptions,
      assets: [
        {
          assetType: 'IMAGE_LARGE',
          index: 1,
          url:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/BUNDLE_17X02MMON36X01MMON_Zoom_F_1.jpg',
        },
        {
          assetType: 'IMAGE_SMALL',
          index: 2,
          url:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/BUNDLE_17X02MMON36X01MMON_Thumb_M_1.jpg',
        },
      ],
      amplienceAssets: {
        images: ['image url 1', 'image url 2'],
        videos: ['video url 1'],
      },
      bundleSlots: [
        {
          slotNumber: 1,
          products: [
            {
              productId: 29140305,
            },
          ],
        },
      ],
      bundleType: 'Flexible',
      productId: 29774047,
      description:
        'Add modern bold stripes to your suiting with this black and white Humbug stripe suit.',
    },
    carousel: {},
    deleteRecentlyViewedProduct: jest.fn(),
    setCarouselIndex: jest.fn(),
    getPDPBundleEspots: jest.fn(),
    isFeatureDressipiRecommendationsEnabled: false,
    isFeatureBnplPaymentsBreakdownPdp: false,
    isMobile: false,
    showModal: jest.fn(),
    storeCode: 'tsuk',
  }

  describe('@renders', () => {
    it('flexible bundle (default)', () => {
      expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
    })
    it('fixed bundle', () => {
      const fixedBundleProps = mergeDeepRight(defaultProps, {
        product: {
          bundleType: 'Fixed',
        },
      })
      expect(renderComponent(fixedBundleProps).getTree()).toMatchSnapshot()
    })

    it('should add `Bundles-price--discounted` class if a bundle item is discounted', () => {
      const bundleSlots = [
        {
          slotNumber: 1,
          products: [
            {
              productId: 29140305,
            },
          ],
        },
        {
          slotNumber: 2,
          products: [
            {
              productId: 27974357,
              wasWasPrice: '16.00',
            },
          ],
        },
      ]
      const { wrapper } = renderComponent({
        ...defaultProps,
        product: {
          ...defaultProps.product,
          bundleSlots,
        },
      })
      expect(
        wrapper.find('.Bundles-price').hasClass('Bundles-price--discounted')
      ).toBe(true)
    })

    it('should pass `product.deliveryMessage` prop to <BundlesAddAll />', () => {
      const deliveryMessage = 'Order in 9 hrs 23 mins for next day delivery'
      const product = {
        ...defaultProps.product,
        bundleType: 'Fixed',
        deliveryMessage,
      }
      const { wrapper } = renderComponent({
        ...defaultProps,
        product,
      })
      expect(wrapper.find(BundlesAddAll).prop('deliveryMessage')).toBe(
        deliveryMessage
      )
    })

    it('with isFeatureCarouselThumbnailEnabled', () => {
      const { getTreeFor, wrapper } = renderComponent({
        ...defaultProps,
        isFeatureCarouselThumbnailEnabled: true,
      })
      expect(
        getTreeFor(wrapper.find('.Carousel-container--thumbnailEnabled'))
      ).toMatchSnapshot()
      expect(wrapper.find(ProductMedia).prop('amplienceAssets')).toBe(
        defaultProps.product.amplienceAssets
      )
    })

    it('should correctly access the amplience image assets to ProductCarouselThumbnails if provided', () => {
      const { wrapper } = renderComponent({ ...defaultProps })
      expect(
        wrapper.find(ProductCarouselThumbnails).prop('amplienceImages')
      ).toBe(defaultProps.product.amplienceAssets.images)
    })

    it('should pass an empty array to ProductCarouselThumbnails as amplienceImages if assets not provided', () => {
      const product = { ...defaultProps.product, amplienceAssets: undefined }
      const { wrapper } = renderComponent({
        ...defaultProps,
        product,
      })
      expect(
        wrapper.find(ProductCarouselThumbnails).prop('amplienceImages')
      ).toEqual([])
    })

    describe('when `isFeatureDressipiRecommendationsEnabled` is true', () => {
      it('should render the `<DressipiReccomendationsRail />` component and not the `<Recommendations />` one', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
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
        const { wrapper } = renderComponent(defaultProps)
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
          ...defaultProps,
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
          ...defaultProps,
          isFeatureBnplPaymentsBreakdownPdp: false,
        })
        const bnplPaymentsBreakdown = wrapper.find(BnplPaymentsBreakdown)

        expect(bnplPaymentsBreakdown).toHaveLength(0)
      })
    })
  })

  describe('@lifecycle methods', () => {
    describe('componentDidMount', () => {
      beforeEach(() => {
        defaultProps.getPDPBundleEspots.mockClear()
      })

      it('should call getPDPBundleEspots if personalised espots enabled', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          isPersonalisedEspotsEnabled: true,
        })
        expect(instance.props.getPDPBundleEspots).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.getPDPBundleEspots).toHaveBeenCalled()
      })

      it('should not call getPDPBundleEspots if personalised espots not enabled', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          isPersonalisedEspotsEnabled: false,
        })
        instance.componentDidMount()
        expect(instance.props.getPDPBundleEspots).not.toHaveBeenCalled()
      })
    })
  })

  describe('@instance methods', () => {
    describe('getFixedBundleProductIds', () => {
      it(`should return array of currentItemReference's if relevant carousel exists and it has a currentItemReference prop`, () => {
        const { instance } = renderComponent({
          ...defaultProps,
          carousel: {
            miniProductCarousel0: {
              currentItemReference: '123',
            },
            miniProductCarousel1: {
              currentItemReference: '234',
            },
            miniProductCarousel2: {
              currentItemReference: 345,
            },
          },
        })

        expect(instance.getFixedBundleProductIds({})).toEqual(
          expect.arrayContaining(['123', '234', 345])
        )
        expect(instance.getFixedBundleProductIds({}).length).toEqual(3)
      })

      it(`should return array of product ids if a fixed bundle product is passed in and there are no relevant carousel items`, () => {
        const props = {
          ...defaultProps,
          product: bundleMocksFixed,
        }
        const { instance } = renderComponent(props)

        expect(instance.getFixedBundleProductIds(props.product)).toEqual(
          expect.arrayContaining([
            18848276,
            22266082,
            22265776,
            18848362,
            24387907,
            22934963,
          ])
        )
        expect(instance.getFixedBundleProductIds(props.product).length).toEqual(
          6
        )
      })

      it('clickCarouselThumbs calls setCarouselIndex action with index param', () => {
        const { instance } = renderComponent(defaultProps)
        const mockIndex = 5
        expect(instance.props.setCarouselIndex).not.toHaveBeenCalled()
        instance.clickCarouselThumbs(mockIndex)
        expect(instance.props.setCarouselIndex).toHaveBeenCalledTimes(1)
        expect(instance.props.setCarouselIndex).toHaveBeenCalledWith(
          'bundles',
          mockIndex
        )
      })
    })
  })

  describe('@decorator', () => {
    describe('analytics decorator', () => {
      it('wraps the component with the correct analytics property', () => {
        const mockStore = createMockStoreForAnalytics({ preloadedState: {} })
        const shallowOptions = { context: { store: mockStore } }

        const wrapper = shallow(<Bundles />, shallowOptions)

        expect(Bundles.displayName).toMatch(/AnalyticsDecorator/)
        const analyticsDecorator = until(
          wrapper,
          'AnalyticsDecorator',
          shallowOptions
        )
        const analyticsInstance = analyticsDecorator.instance()
        expect(analyticsInstance.pageType).toBe('bundle')
        expect(analyticsInstance.isAsync).toBe(true)
      })
    })
  })
})
