import testComponentHelper from 'test/unit/helpers/test-component'
import DressipiRecommendationsRail from '../DressipiRecommendationsRail'
import ProductCarousel from '../../ProductCarousel/ProductCarousel'
import * as analyticsActions from 'src/shared/analytics/analytics-actions'
import * as dressipiUtils from '../../../../lib/dressipi-utils'
import { GTM_LIST_TYPES } from '../../../../analytics'

describe('<DressipiReccomendationsRail />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = testComponentHelper(
    DressipiRecommendationsRail.WrappedComponent
  )

  const dressipiRelatedRecommendations = [
    {
      name: 'Grey Clean Panel Hoodie',
      productId: 36738885,
      url:
        'https://www.topshop.com/en/tsuk/product/shoes-430/sandals-5388227/darwin-black-block-sandals-9718344?&istCompanyId=38aa0d7f-6514-4cb3-bbdc-df0d32d48b7f&istFeedId=2f3c6a0a-c7fb-475c-911a-de0ffac8bf43&istItemId=ipapqarxx&istBid=t',

      img: 'https://images.topshop.com/i/TopShop/TS09H07SGYM_M_1.jpg?$2col$',
      amplienceUrl: 'https://images.topshop.com/i/TopShop/TS09H07SGYM_M_1',
      salePrice: '10',
      unitPrice: '20',
      product_code: 'TS09H07SGYM',
      id: 4845634,
      position: 0,
    },
    {
      name: 'Lilac Panel Relaxed Hoodie',
      productId: 36793240,
      url:
        'https://www.topshop.com/en/tsuk/product/shoes-430/sandals-5388227/darwin-black-block-sandals-9718344?&istCompanyId=38aa0d7f-6514-4cb3-bbdc-df0d32d48b7f&istFeedId=2f3c6a0a-c7fb-475c-911a-de0ffac8bf43&istItemId=ipapqarxx&istBid=t',
      img: 'https://images.topshop.com/i/TopShop/TS09H07SLIL_M_1.jpg?$2col$',
      amplienceUrl: 'https://images.topshop.com/i/TopShop/TS09H07SLIL_M_1',
      salePrice: '20',
      unitPrice: '20',
      product_code: 'TS09H07SLIL',
      id: 4905498,
      position: 1,
    },
  ]
  const initialProps = {
    brand: 'topshop',
    dressipiBaseUrl: 'https://dressipi-staging.topshop.com',
    clickRecommendation: () => {},
    fetchDressipiRelatedRecommendations: jest.fn(),
    setPredecessorPage: () => {},
    dressipiEventId: '1234',
  }
  describe('@renders', () => {
    describe('when there are no recommendations', () => {
      it('should not render', () => {
        const { wrapper } = renderComponent(initialProps)
        const recommendationsEl = wrapper.find('.Recommendations')
        expect(recommendationsEl).toHaveLength(0)
      })
    })

    describe('when there are recommendations', () => {
      it('should render', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          dressipiRelatedRecommendations,
        })
        const recommendationsEl = wrapper.find('.Recommendations')
        expect(recommendationsEl).toHaveLength(1)
      })
    })

    describe('when `headerText` exists ', () => {
      it('should render it as the title', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          dressipiRelatedRecommendations,
          headerText: 'Title to display',
        })
        const header = wrapper.find('.Recommendations-header')
        expect(header).toHaveLength(1)
        expect(header.text()).toBe('Title to display')
      })
    })

    describe('when `headerText` does not exist ', () => {
      it('should render an alternative title', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          dressipiRelatedRecommendations,
        })
        const header = wrapper.find('.Recommendations-header')
        expect(header).toHaveLength(1)
        expect(header.text()).toBe('Why not try?')
      })
    })
  })

  describe('<ProductCarousel />', () => {
    it('should render and pass the right props', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        dressipiRelatedRecommendations,
      })
      const productCarousel = wrapper.find(ProductCarousel)
      expect(productCarousel).toHaveLength(1)
      expect(productCarousel.prop('isImageFallbackEnabled')).toBe(true)
      expect(productCarousel.prop('products')).toEqual(
        dressipiRelatedRecommendations
      )
      expect(productCarousel.prop('onProductLinkClick')).toBeInstanceOf(
        Function
      )
      expect(productCarousel.prop('hideProductName')).toBe(true)
    })
  })

  describe('@events', () => {
    const emitDressipiEventSpy = jest
      .spyOn(dressipiUtils, 'emitDressipiEvent')
      .mockImplementation(() => {})
    describe('product link click', () => {
      const clickRecommendationMock = jest.fn()

      const sendAnalyticsSpy = jest.spyOn(
        analyticsActions,
        'sendAnalyticsProductClickEvent'
      )

      const setPredecessorPage = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        dressipiRelatedRecommendations,
        clickRecommendation: clickRecommendationMock,
        sendAnalyticsProductClickEvent: sendAnalyticsSpy,
        setPredecessorPage,
        emitDressipiEvent: emitDressipiEventSpy,
        dressipiContentId: '4321',
      })
      it('should call `clickRecommendation`', () => {
        wrapper.find(ProductCarousel).prop('onProductLinkClick')(36793240)

        expect(setPredecessorPage).toHaveBeenCalledWith(
          GTM_LIST_TYPES.PDP_WHY_NOT_TRY
        )
        expect(clickRecommendationMock).toBeCalledWith(4905498)
        expect(sendAnalyticsSpy).toHaveBeenCalledWith({
          listType: GTM_LIST_TYPES.PDP_RECOMMENDED_PRODUCTS,
          id: 36793240,
          name: 'Lilac Panel Relaxed Hoodie',
          price: '20',
          position: 1,
        })
        expect(emitDressipiEventSpy).toHaveBeenCalledWith(
          'https://dressipi-staging.topshop.com',
          { content_id: '4321', event_type: 'pdp', root_event_id: '1234' }
        )
      })
    })

    describe('quickView click event', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        dressipiRelatedRecommendations,
        emitDressipiEvent: emitDressipiEventSpy,
        dressipiContentId: '4321',
        onQuickViewClick: () => {},
      })
      it('should call emitDressipiEvent', () => {
        wrapper.find(ProductCarousel).prop('onQuickViewClick')(36793240)
        expect(emitDressipiEventSpy).toHaveBeenCalledWith(
          'https://dressipi-staging.topshop.com',
          {
            content_id: '4321',
            event_type: 'quickview',
            root_event_id: '1234',
          }
        )
      })
    })

    describe('carousel arrow click event', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        dressipiRelatedRecommendations,
        emitDressipiEvent: emitDressipiEventSpy,
        dressipiContentId: '4321',
        onCarouselArrowClick: () => {},
      })
      it('should call emitDressipiEvent', () => {
        wrapper.find(ProductCarousel).prop('onCarouselArrowClick')(36793240)
        expect(emitDressipiEventSpy).toHaveBeenCalledWith(
          'https://dressipi-staging.topshop.com',
          {
            content_id: '4321',
            event_type: 'widget_interacted',
            root_event_id: '1234',
          }
        )
      })
    })
  })

  describe('componentDidMount', () => {
    beforeEach(() => jest.resetAllMocks())

    it('should getDressipiRecommendations if currentProductGroupingId exists', () => {
      const { instance } = renderComponent({
        ...initialProps,
        isFeatureDressipiRelatedRecommendationsEnabled: true,
        currentProductGroupingId: '1234',
      })
      expect(
        initialProps.fetchDressipiRelatedRecommendations
      ).not.toHaveBeenCalled()
      instance.componentDidMount()
      expect(
        initialProps.fetchDressipiRelatedRecommendations
      ).toHaveBeenCalledTimes(1)
      expect(
        initialProps.fetchDressipiRelatedRecommendations
      ).toHaveBeenCalledWith('1234', 'https://dressipi-staging.topshop.com')
    })

    it('should not getDressipiRecommendations if currentProductGroupingId does not exist', () => {
      const { instance } = renderComponent({
        ...initialProps,
        isFeatureDressipiRelatedRecommendationsEnabled: true,
      })
      expect(
        initialProps.fetchDressipiRelatedRecommendations
      ).not.toHaveBeenCalled()
      instance.componentDidMount()
      expect(
        initialProps.fetchDressipiRelatedRecommendations
      ).not.toHaveBeenCalled()
    })
  })
})
