import testComponentHelper from 'test/unit/helpers/test-component'
import * as productCarouselConstants from '../../../../constants/productCarouselConstants'
import RecentlyViewed from '../RecentlyViewed'
import ProductCarousel from '../../ProductCarousel/ProductCarousel'
import { GTM_LIST_TYPES } from '../../../../analytics/analytics-constants'

describe('<RecentlyViewed />', () => {
  const singleRecentlyViewed = [
    {
      productId: 30348471,
      name: 'MOTO Indigo Holding Power Jeans',
      amplienceUrl: 'http://www.images.com',
      imageUrl:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS02P03MIND_Small_F_1.jpg',
      unitPrice: '40.00',
      iscmCategory: 'JEAN',
    },
  ]
  const recentlyViewed = [
    {
      productId: 30348471,
      name: 'MOTO Indigo Holding Power Jeans',
      amplienceUrl: 'http://www.images.com',
      imageUrl:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS02P03MIND_Small_F_1.jpg',
      unitPrice: '40.00',
      iscmCategory: 'JEAN',
    },
    {
      productId: 29434229,
      name: 'Marble Reversible Crop Bikini Top',
      amplienceUrl: 'http://www.images.com',
      imageUrl:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS03P13MLIL_Small_F_1.jpg',
      unitPrice: '10.00',
      iscmCategory: 'SWIM',
    },
  ]
  const requiredProps = {
    deleteRecentlyViewedProduct: () => {},
    sendAnalyticsProductClickEvent: () => {},
    brand: 'topshop',
    setPredecessorPage: () => {},
  }
  const renderComponent = testComponentHelper(RecentlyViewed.WrappedComponent)

  beforeEach(jest.resetAllMocks)

  describe('@renders', () => {
    it('should render nothing in default state', () => {
      const { wrapper } = renderComponent(requiredProps)
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should  render the title', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        recentlyViewed: singleRecentlyViewed,
      })

      expect(wrapper.find('.RecentlyViewed-header').exists()).toBe(true)
    })

    describe('if `recentlyViewed` prop supplied', () => {
      it('should render recently viewed items', () => {
        const { getTree } = renderComponent({
          ...requiredProps,
          recentlyViewed,
        })
        expect(getTree()).toMatchSnapshot()
      })

      it('should omit currently viewed product', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          recentlyViewed,
          currentProductId: recentlyViewed[1].productId,
        })
        expect(wrapper.find(ProductCarousel).prop('products')).toEqual([
          recentlyViewed[0],
        ])
      })

      it('should render nothing if the single `recentlyViewed` is currently view product', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          recentlyViewed: singleRecentlyViewed,
          currentProductId: 30348471,
        })

        expect(wrapper.isEmptyRender()).toBe(true)
      })

      describe('isPlp is supplied', () => {
        describe('isPlp is true', () => {
          it('should not render the title', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              recentlyViewed: singleRecentlyViewed,
              isPlp: true,
            })

            expect(wrapper.find('.RecentlyViewed-header').exists()).toBe(false)
          })

          it('should pass to Carousel specific props', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              recentlyViewed: singleRecentlyViewed,
              isPlp: true,
            })

            expect(wrapper.find(ProductCarousel).props()).toMatchObject({
              hideProductName: true,
              axis: productCarouselConstants.CAROUSEL_AXIS_VERTICAL,
              openQuickViewOnProductClick: true,
            })
          })
        })

        describe('isPlp is false', () => {
          it('shouldnt pass PLP props', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              recentlyViewed: singleRecentlyViewed,
              isPlp: false,
            })

            expect(wrapper.find(ProductCarousel).prop('hideProductName')).toBe(
              undefined
            )
            expect(wrapper.find(ProductCarousel).prop('axis')).toBe(undefined)
            expect(
              wrapper.find(ProductCarousel).prop('openQuickViewOnProductClick')
            ).toBe(undefined)
          })
        })
      })
    })
  })

  describe('@events', () => {
    describe('on product link click', () => {
      it('should call `registerReferral`', () => {
        const registerReferralMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          recentlyViewed,
          registerReferral: registerReferralMock,
        })
        wrapper.find(ProductCarousel).prop('onProductLinkClick')(30348471)
        expect(registerReferralMock).toHaveBeenCalledWith(30348471)
      })

      it('should track the click event with the correct product info', () => {
        const trackingSpy = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          recentlyViewed,
          sendAnalyticsProductClickEvent: trackingSpy,
        })
        const index = 1
        wrapper.find(ProductCarousel).prop('onProductLinkClick')(
          recentlyViewed[index].productId
        )
        const { name, productId, unitPrice, iscmCategory } = recentlyViewed[
          index
        ]
        expect(trackingSpy).toHaveBeenCalledWith({
          listType: GTM_LIST_TYPES.PDP_RECENTLY_VIEWED,
          name,
          id: productId,
          price: unitPrice,
          category: iscmCategory,
          position: index + 1,
          brand: requiredProps.brand,
        })
      })

      describe('isPlp is provided', () => {
        describe('isPlp is true', () => {
          it('should track the click event with the correct product info', () => {
            const trackingSpy = jest.fn()
            const setPredecessorPage = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              recentlyViewed,
              sendAnalyticsProductClickEvent: trackingSpy,
              isPlp: true,
              setPredecessorPage,
            })
            const index = 1
            wrapper.find(ProductCarousel).prop('onProductLinkClick')(
              recentlyViewed[index].productId
            )
            const { name, productId, unitPrice, iscmCategory } = recentlyViewed[
              index
            ]
            expect(setPredecessorPage).toHaveBeenCalledWith(
              GTM_LIST_TYPES.PLP_RECENTLY_VIEWED
            )
            expect(trackingSpy).toHaveBeenCalledWith({
              listType: GTM_LIST_TYPES.PLP_RECENTLY_VIEWED,
              name,
              id: productId,
              price: unitPrice,
              category: iscmCategory,
              position: index + 1,
              brand: requiredProps.brand,
            })
          })
        })

        describe('isPlp is false', () => {
          it('should track the click event with the correct product info', () => {
            const trackingSpy = jest.fn()
            const setPredecessorPage = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              recentlyViewed,
              sendAnalyticsProductClickEvent: trackingSpy,
              isPlp: false,
              setPredecessorPage,
            })
            const index = 1
            wrapper.find(ProductCarousel).prop('onProductLinkClick')(
              recentlyViewed[index].productId
            )
            const { name, productId, unitPrice, iscmCategory } = recentlyViewed[
              index
            ]
            expect(setPredecessorPage).toHaveBeenCalledWith(
              GTM_LIST_TYPES.PDP_RECENTLY_VIEWED
            )
            expect(trackingSpy).toHaveBeenCalledWith({
              listType: GTM_LIST_TYPES.PDP_RECENTLY_VIEWED,
              name,
              id: productId,
              price: unitPrice,
              category: iscmCategory,
              position: index + 1,
              brand: requiredProps.brand,
            })
          })
        })
      })
    })

    describe('on product remove', () => {
      it('should call `deleteRecentlyViewedProduct`', () => {
        const deleteRecentlyViewedProductMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          recentlyViewed,
          deleteRecentlyViewedProduct: deleteRecentlyViewedProductMock,
        })
        wrapper.find(ProductCarousel).prop('onProductRemove')(1247392)
        expect(deleteRecentlyViewedProductMock).toHaveBeenCalledWith(1247392)
      })
    })
  })
})
