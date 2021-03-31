import testComponentHelper from 'test/unit/helpers/test-component'
import { range } from 'ramda'

import products from '../../../../../../test/mocks/productMocks'
import { IMAGE_SIZES } from '../../../../constants/amplience'
import ProductList from '../ProductList'
import Product from '../../../common/Product/Product'
import Espot from '../../Espot/Espot'
import { WindowScroll } from '../../WindowEventProvider/WindowScroll'

jest.mock('../../../../../server/api/mapping/constants/plp', () => ({
  productListPageSize: 2,
}))

describe('<ProductList />', () => {
  const defaultProps = {
    products,
    grid: 1,
    children: undefined,
    espots: [],
    selectedProductSwatches: {},
    setPredecessorPage: () => {},
    hiddenPagesAbove: [],
    numberOfPagesHiddenAtEnd: 0,
    isFeaturePLPMobileEspotEnabled: false,
  }
  const renderComponent = testComponentHelper(ProductList.WrappedComponent)

  describe('@renders', () => {
    it('should display the correct number of products', () => {
      const grid = 1

      const { wrapper } = renderComponent({
        ...defaultProps,
        grid,
      })

      expect(wrapper.find(Product)).toHaveLength(20)
      expect(
        wrapper
          .find(Product)
          .first()
          .prop('sizes')
      ).toBe(IMAGE_SIZES.plp[grid])
    })

    it('should display the loader when API is fetching products', () => {
      const { wrapper } = renderComponent({ ...defaultProps, isLoading: true })
      expect(wrapper.find('.ProductList-loader')).toHaveLength(1)
    })

    describe('espots', () => {
      const espotsMock = [
        {
          identifier: 'espot-1',
          position: 1,
        },
        {
          identifier: 'espot-2',
          position: 3,
        },
        {
          identifier: 'espot-3',
          position: 6,
        },
        {
          identifier: 'espot-4',
          position: 15,
        },
        {
          identifier: 'espot-5',
          position: 21,
        },
      ]
      const renderedEspots = espotsMock
        .map(({ position, identifier }) => [position, identifier])
        .slice(0, 3)
      describe('on desktop', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          grid: 1,
          espots: espotsMock,
        })
        const productList = wrapper.find('.ProductList-products')
        it('adds content spots', () => {
          expect(productList.find(Espot)).toHaveLength(4)
          expect(productList.children()).toHaveLength(24)
        })
        it.each(renderedEspots)(
          'the espot in position %i has the identifier %s',
          (position, identifier) => {
            const espot = productList.childAt(position - 1)
            expect(espot.is(Espot)).toBe(true)
            expect(espot.prop('identifier')).toBe(identifier)
          }
        )
        it('should not render espots with a position beyond the number of products', () => {
          expect(productList.find({ identifier: 'espot-5' })).toHaveLength(0)
        })
      })

      describe('on mobile', () => {
        it('should not render espots without the feature flag', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            grid: 1,
            espots: espotsMock,
            isMobile: true,
          })
          const productList = wrapper.find('.ProductList-products')
          expect(productList.children()).toHaveLength(20)
          expect(productList.find(Espot)).toHaveLength(0)
        })

        it('should render espots with the feature flag', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            grid: 1,
            espots: espotsMock,
            isMobile: true,
            isFeaturePLPMobileEspotEnabled: true,
          })

          const productList = wrapper.find('.ProductList-products')
          expect(productList.children()).toHaveLength(24)
          expect(productList.find(Espot)).toHaveLength(4)
        })
      })
    })
    describe('renderHiddenPagePlaceholdersAbove', () => {
      it('renders the hidden placeholder if there are hiddenPagesAbove', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          hiddenPagesAbove: [{ height: 120 }],
        })

        expect(wrapper.find(WindowScroll).exists()).toBe(true)
        expect(
          wrapper.find('.ProductList--hiddenProductPlaceholder').prop('style')
        ).toHaveProperty('height', 120)
      })

      it('renders multi hidden placeholders', () => {
        const hiddenPagesAbove = [{ height: 120 }, { height: 150 }]
        const { wrapper } = renderComponent({
          ...defaultProps,
          hiddenPagesAbove,
        })

        expect(wrapper.find(WindowScroll).exists()).toBe(true)
        hiddenPagesAbove.forEach((value, index) => {
          expect(
            wrapper
              .find('.ProductList--hiddenProductPlaceholder')
              .at(index)
              .prop('style')
          ).toHaveProperty('height', hiddenPagesAbove[index].height)
        })
      })

      it('doesnt render the hidden placeholder if hiddenPagesAbove is empty', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          hiddenPagesAbove: [],
        })

        expect(wrapper.find(WindowScroll).exists()).toBe(false)
      })

      describe('onScroll', () => {
        it('triggers hitWaypointTop if it is visible', () => {
          const getBoundingClientRectMock = {
            getBoundingClientRect: () => ({
              top: 10,
              bottom: 200,
            }),
          }

          const hitWaypointTopMock = jest.fn()

          document.querySelector = jest
            .fn()
            .mockReturnValue(getBoundingClientRectMock)

          const { wrapper } = renderComponent({
            ...defaultProps,
            hiddenPagesAbove: [{}],
            hitWaypointTop: hitWaypointTopMock,
          })

          wrapper.find(WindowScroll).simulate('scroll')

          expect(hitWaypointTopMock).toHaveBeenCalledTimes(1)
        })

        it('doesnt trigger hitWaypointTop if it is not visible', () => {
          const getBoundingClientRectMock = {
            getBoundingClientRect: () => ({
              top: -150,
              bottom: -100,
            }),
          }

          const hitWaypointTopMock = jest.fn()

          document.querySelector = jest
            .fn()
            .mockReturnValue(getBoundingClientRectMock)

          const { wrapper } = renderComponent({
            ...defaultProps,
            hiddenPagesAbove: [{}],
            hitWaypointTop: hitWaypointTopMock,
          })

          wrapper.find(WindowScroll).simulate('scroll')

          expect(hitWaypointTopMock).toHaveBeenCalledTimes(0)
        })

        it("should not dispatch action or throw error if the element with data-product-number='0' is not found", () => {
          const hitWaypointTopMock = jest.fn()
          document.querySelector = jest.fn().mockReturnValue(undefined)
          const { wrapper } = renderComponent({
            ...defaultProps,
            hiddenPagesAbove: [{}],
            hitWaypointTop: hitWaypointTopMock,
          })
          wrapper.find(WindowScroll).simulate('scroll')
          expect(hitWaypointTopMock).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('@lifecycle', () => {
    describe('shouldComponentUpdate', () => {
      const { instance } = renderComponent(defaultProps)

      it('should return false if props are not changed', () => {
        expect(instance.shouldComponentUpdate(defaultProps)).toBe(false)
      })

      it('should return true if props are changed', () => {
        expect(
          instance.shouldComponentUpdate({
            ...defaultProps,
            grid: 2,
          })
        ).toBe(true)
      })
    })
  })

  describe('@events', () => {
    describe('product click', () => {
      beforeEach(jest.clearAllMocks)

      const preloadProductDetailMock = jest.fn()
      const props = {
        ...defaultProps,
        preloadProductDetail: preloadProductDetailMock,
      }

      it('should call preloadCurrentProduct with default product data', () => {
        const { wrapper } = renderComponent(props)

        wrapper
          .find(Product)
          .first()
          .prop('onLinkClick')()

        expect(preloadProductDetailMock).toHaveBeenCalledTimes(1)
        expect(preloadProductDetailMock).toHaveBeenCalledWith(
          products[0],
          props,
          undefined
        )
      })

      it('should call preloadCurrentProduct with swatch product data', () => {
        const propsWithSwatches = {
          ...props,
          selectedProductSwatches: {
            24393842: 243938429,
          },
        }
        const { wrapper } = renderComponent(propsWithSwatches)

        wrapper
          .find(Product)
          .first()
          .prop('onLinkClick')()

        expect(preloadProductDetailMock).toHaveBeenCalledTimes(1)
        expect(preloadProductDetailMock).toHaveBeenCalledWith(
          {
            ...products[0].colourSwatches[1].swatchProduct,
            attributes: {
              AverageOverallRating: null,
              NumReviews: null,
            },
          },
          propsWithSwatches,
          undefined
        )
      })
    })
  })

  describe('@methods', () => {
    const initState = {
      totalProducts: 80,
      products: range(0, 27),
      grid: 3,
      isFeaturePLPMobileEspotEnabled: false,
    }
    const { instance } = renderComponent(defaultProps)

    describe('shouldShowContentEspot()', () => {
      const baseProps = {
        numProducts: 10,
        position: 5,
        isMobile: false,
        isFeaturePLPMobileEspotEnabled: false,
      }
      it('should return true for non-mobile with enough products and without feature flag', () => {
        expect(instance.shouldShowContentEspot(baseProps)).toBe(true)
      })

      it('should return true for non-mobile with enough products and with feature flag', () => {
        expect(
          instance.shouldShowContentEspot({
            ...baseProps,
            isFeaturePLPMobileEspotEnabled: true,
          })
        ).toBe(true)
      })

      it('should return false for non-mobile without enough products', () => {
        expect(
          instance.shouldShowContentEspot({ ...baseProps, numProducts: 3 })
        ).toBe(false)
      })
      it('should return true for mobile with enough products and the feature flag', () => {
        expect(
          instance.shouldShowContentEspot({
            ...baseProps,
            isMobile: true,
            isFeaturePLPMobileEspotEnabled: true,
          })
        ).toBe(true)
      })

      it('should return false for mobile without enough products and with the feature flag', () => {
        expect(
          instance.shouldShowContentEspot({
            ...baseProps,
            numProducts: 3,
            isMobile: true,
            isFeaturePLPMobileEspotEnabled: true,
          })
        ).toBe(false)
      })

      it('should return false for mobile without enough products and without the feature flag', () => {
        expect(
          instance.shouldShowContentEspot({
            ...baseProps,
            numProducts: 3,
            isMobile: true,
          })
        ).toBe(false)
      })

      it('should return false for mobile without the feature flag', () => {
        expect(
          instance.shouldShowContentEspot({ ...baseProps, isMobile: true })
        ).toBe(false)
      })
    })
    describe('prepareRowsForRendering()', () => {
      it('should return an array without the last product', () => {
        const state = Object.values({ ...initState, grid: 2 })
        const productList = instance.prepareRowsForRendering(...[...state])
        expect(productList.length).toEqual(26)
      })

      it('should return an array without the last two products', () => {
        const state = Object.values({ ...initState, products: range(0, 26) })
        const productList = instance.prepareRowsForRendering(...[...state])
        expect(productList.length).toEqual(24)
      })

      it('should return an array without the last three products', () => {
        const state = Object.values({ ...initState, grid: 4 })
        const productList = instance.prepareRowsForRendering(...[...state])
        expect(productList.length).toEqual(24)
      })

      it('should return an array with all products', () => {
        const state = Object.values({ ...initState, products: range(0, 80) })
        const productList = instance.prepareRowsForRendering(...[...state])
        expect(productList.length).toEqual(80)
      })
    })

    describe('removeHiddenItems()', () => {
      const productListPageSize = 2

      it('shows all products at the beggining with initial infiniteScroll state', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          hiddenPagesAbove: [],
          numberOfPagesHiddenAtEnd: 0,
          totalProducts: products.length,
        })

        const productList = instance.removeHiddenItems(products)

        expect(productList.length).toEqual(products.length)
      })

      it('always shows two pages at the time when user scroll down', () => {
        const mockProducts = [
          { id: 'one' },
          { id: 'two' },
          { id: 'three' },
          { id: 'four' },
          { id: 'five' },
          { id: 'six' },
          { id: 'seven' },
          { id: 'eight' },
        ]
        const { instance } = renderComponent({
          ...defaultProps,
          products: mockProducts,
          hiddenPagesAbove: [{}, {}],
          numberOfPagesHiddenAtEnd: 0,
          totalProducts: 8,
        })

        const productList = instance.removeHiddenItems(mockProducts)

        expect(productList.length).toEqual(productListPageSize * 2)
        expect(productList).toEqual([
          { id: 'five' },
          { id: 'six' },
          { id: 'seven' },
          { id: 'eight' },
        ])
      })

      it('always shows two pages at a time when user scrolls up', () => {
        const mockProducts = [
          { id: 'one' },
          { id: 'two' },
          { id: 'three' },
          { id: 'four' },
          { id: 'five' },
          { id: 'six' },
          { id: 'seven' },
          { id: 'eight' },
        ]
        const { instance } = renderComponent({
          ...defaultProps,
          products: mockProducts,
          hiddenPagesAbove: [{}],
          numberOfPagesHiddenAtEnd: 1,
          totalProducts: 8,
        })

        const productList = instance.removeHiddenItems(mockProducts)

        expect(productList.length).toEqual(productListPageSize * 2)
        expect(productList).toEqual([
          { id: 'three' },
          { id: 'four' },
          { id: 'five' },
          { id: 'six' },
        ])
      })

      it('should always display full pages of 24 items unless on last page', () => {
        const mockProducts = [
          { id: 'one' },
          { id: 'two' },
          { id: 'three' },
          { id: 'four' },
          { id: 'five' },
          { id: 'six' },
          { id: 'seven' },
        ]
        const { instance } = renderComponent({
          ...defaultProps,
          products: mockProducts,
          hiddenPagesAbove: [{}],
          numberOfPagesHiddenAtEnd: 1,
          totalProducts: 7,
        })

        const productList = instance.removeHiddenItems(mockProducts)

        expect(productList.length).toEqual(4)
        expect(productList).toEqual([
          { id: 'three' },
          { id: 'four' },
          { id: 'five' },
          { id: 'six' },
        ])
      })
    })
  })
})
