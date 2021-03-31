import testComponentHelper from 'test/unit/helpers/test-component'
import deepFreeze from 'deep-freeze'

import { WrappedRecommendations } from '../Recommendations'
import ProductCarousel from '../../ProductCarousel/ProductCarousel'
import * as analyticsActions from 'src/shared/analytics/analytics-actions'
import { GTM_LIST_TYPES } from '../../../../analytics'

describe('<Recommendations />', () => {
  const recommendations = deepFreeze([
    {
      id: 1839010473411,
      productId: 1708381,
      title: "Nails In Nice'N'Neutral",
      url:
        'http://www.topshop.com/webapp/wcs/stores/servlet/ProductDisplay?catalogId=33057&storeId=12556&productId=1708381&langId=-1',
      img:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS20N01WNUD_2col_F_1.jpg',
      amplienceUrl:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS20N01WNUD_2col_F_1',
      prices: {
        GBP: {
          unitPrice: 10,
          salePrice: 5,
        },
      },
      position: 1,
    },
    {
      id: 1839010473461,
      productId: 2205159,
      title: 'Nails In War Paint',
      url:
        'http://www.topshop.com/webapp/wcs/stores/servlet/ProductDisplay?catalogId=33057&storeId=12556&productId=2205159&langId=-1',
      img:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/20N02YFLC_normal.jpg',
      amplienceUrl:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/20N02YFLC_normal',
      prices: {
        GBP: {
          unitPrice: 20,
        },
      },
      position: 2,
    },
  ])
  const requiredProps = {
    clickRecommendation: () => {},
    sendAnalyticsProductClickEvent: () => {},
    setPredecessorPage: () => {},
  }
  const renderComponent = testComponentHelper(WrappedRecommendations)

  describe('@renders', () => {
    it('should render nothing by default', () => {
      const { wrapper } = renderComponent(requiredProps)
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should render if there are recommendations', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        recommendations,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should pass correct `products` prop to <ProductCarousel />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        recommendations,
      })
      expect(wrapper.find(ProductCarousel).prop('products')).toEqual([
        {
          productId: 1708381,
          name: "Nails In Nice'N'Neutral",
          imageUrl:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS20N01WNUD_2col_F_1.jpg',
          amplienceUrl:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS20N01WNUD_2col_F_1',
          unitPrice: '10',
          salePrice: '5',
        },
        {
          productId: 2205159,
          name: 'Nails In War Paint',
          imageUrl:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/20N02YFLC_normal.jpg',
          amplienceUrl:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/20N02YFLC_normal',
          unitPrice: '20',
        },
      ])
    })

    describe('when plain recommendations', () => {
      it('should render correct header for dp', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          recommendations,
          brand: 'dorothyperkins',
        })
        expect(wrapper.find('.Recommendations-header').text()).toBe(
          'you may also like'
        )
      })
    })

    describe('when recommendations has headerText prop', () => {
      it('should render passed headerText prop', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          recommendations,
          headerText: 'Open to persuasion? Try these...',
        })
        expect(wrapper.find('.Recommendations-header').text()).toBe(
          'Open to persuasion? Try these...'
        )
      })
    })
  })

  describe('@events', () => {
    describe('on product link click', () => {
      it('should call `clickRecommendation`', () => {
        const clickRecommendationMock = jest.fn()
        const setPredecessorPage = jest.fn()
        const sendAnalyticsSpy = jest.spyOn(
          analyticsActions,
          'sendAnalyticsProductClickEvent'
        )
        const { wrapper } = renderComponent({
          ...requiredProps,
          recommendations,
          clickRecommendation: clickRecommendationMock,
          sendAnalyticsProductClickEvent: sendAnalyticsSpy,
          setPredecessorPage,
        })
        wrapper.find(ProductCarousel).prop('onProductLinkClick')(1708381)
        expect(clickRecommendationMock).toBeCalledWith(1839010473411)
        expect(setPredecessorPage).toHaveBeenCalledWith(
          GTM_LIST_TYPES.PDP_WHY_NOT_TRY
        )
        expect(sendAnalyticsSpy).toHaveBeenCalledWith({
          listType: GTM_LIST_TYPES.PDP_RECOMMENDED_PRODUCTS,
          id: 1708381,
          name: "Nails In Nice'N'Neutral",
          price: '5',
          position: 1,
        })
        wrapper.find(ProductCarousel).prop('onProductLinkClick')(2205159)
        expect(clickRecommendationMock).toBeCalledWith(1839010473461)
        expect(sendAnalyticsSpy).toHaveBeenCalledWith({
          listType: GTM_LIST_TYPES.PDP_RECOMMENDED_PRODUCTS,
          id: 2205159,
          name: 'Nails In War Paint',
          price: '20',
          position: 2,
        })
      })
    })
  })
})
