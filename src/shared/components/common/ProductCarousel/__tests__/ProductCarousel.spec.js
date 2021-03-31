import { compose } from 'ramda'
import testComponentHelper, {
  mountRender,
  withStore,
  buildComponentRender,
} from 'test/unit/helpers/test-component'

import ProductCarousel, {
  WrappedProductCarousel,
  Arrow,
} from '../ProductCarousel'
import ProductCarouselItem from '../../ProductCarousel/ProductCarouselItem'

import * as viewportSelectors from '../../../../selectors/viewportSelectors'
import {
  CAROUSEL_AXIS_HORIZONTAL,
  CAROUSEL_AXIS_VERTICAL,
  CAROUSEL_VERTICAL_SIZE_DESKTOP,
  CAROUSEL_HORIZONTAL_SIZE_MOBILE,
  CAROUSEL_HORIZONTAL_SIZE_DESKTOP,
} from '../../../../constants/productCarouselConstants'

jest.mock('../../../../selectors/viewportSelectors')

describe('<ProductCarousel />', () => {
  const generateProducts = (length) =>
    [...Array(length)].map(() => ({
      productId: 1708381,
      name: "Nails In Nice'N'Neutral",
      amplienceUrl: 'url',
      imageUrl:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS20N01WNUD_2col_F_1.jpg',
      unitPrice: '5',
      salePrice: '2',
    }))

  const renderComponent = testComponentHelper(WrappedProductCarousel)

  const initialProps = {
    axis: CAROUSEL_AXIS_HORIZONTAL,
    carouselSize: 2,
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@connected', () => {
    const initialState = {}
    const render = compose(
      mountRender,
      withStore(initialState)
    )
    const renderComponent = buildComponentRender(render, ProductCarousel)
    it('should render correctly', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
    describe('mapStateToProps', () => {
      describe('AXIS is horizontal', () => {
        it('should pass correct carousel size for mobile devices', () => {
          viewportSelectors.isMobile.mockReturnValueOnce(true)
          const { instance } = renderComponent(initialProps)
          expect(instance.stateProps.carouselSize).toBe(
            CAROUSEL_HORIZONTAL_SIZE_MOBILE
          )
        })
        it('should pass correct carousel size for non-mobile devices', () => {
          viewportSelectors.isMobile.mockReturnValueOnce(false)
          const { instance } = renderComponent(initialProps)
          expect(instance.stateProps.carouselSize).toBe(
            CAROUSEL_HORIZONTAL_SIZE_DESKTOP
          )
        })
      })
      describe('AXIS is vertical', () => {
        it('should pass correct carousel size for mobile devices', () => {
          viewportSelectors.isMobile.mockReturnValueOnce(true)
          const { instance } = renderComponent({
            ...initialProps,
            axis: CAROUSEL_AXIS_VERTICAL,
          })

          expect(instance.stateProps.carouselSize).toBe(
            CAROUSEL_VERTICAL_SIZE_DESKTOP
          )
        })
        it('should pass correct carousel size for non-mobile devices', () => {
          viewportSelectors.isMobile.mockReturnValueOnce(false)
          const { instance } = renderComponent({
            ...initialProps,
            axis: CAROUSEL_AXIS_VERTICAL,
          })

          expect(instance.stateProps.carouselSize).toBe(
            CAROUSEL_VERTICAL_SIZE_DESKTOP
          )
        })
      })
    })
  })

  describe('@renders', () => {
    it('should render in empty state', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should render supplied products', () => {
      const { getTree } = renderComponent({
        ...initialProps,
        products: generateProducts(2),
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should double the products if there are exactly one more than the carousel size', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(3),
      })
      expect(wrapper.find(ProductCarouselItem).length).toBe(6)
    })

    describe('axis is HORIZONTAL', () => {
      describe('if number of products is greater than the carousel size', () => {
        it('should render <Arrow />s', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            peepNextItem: false,
            products: generateProducts(3),
          })
          expect(
            wrapper
              .find(Arrow)
              .find({ direction: 'left' })
              .exists()
          ).toBe(true)
          expect(
            wrapper
              .find(Arrow)
              .find({ direction: 'right' })
              .exists()
          ).toBe(true)
        })

        it('should supply correct `style` to <ProductCarouselItem />', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            products: generateProducts(3),
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .first()
              .prop('style')
          ).toEqual({
            width: '50%',
            transform: `translateX(0%)`,
            zIndex: '1',
          })
        })

        it('should supply `amplienceUrl` to <ProductCarouselItem />', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            products: generateProducts(1),
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .first()
              .prop('amplienceUrl')
          ).toEqual('url')
        })

        it('should hide <ProductCarouselItem /> items outside of the carousel window view', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            products: generateProducts(3),
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .at(2)
              .prop('style').zIndex
          ).toBe('0')
        })

        it('should supply the correct axis to <ProductCarouselItem />', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            products: generateProducts(3),
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .at(0)
              .prop('axis')
          ).toBe(CAROUSEL_AXIS_HORIZONTAL)
        })
      })
    })

    describe('axis is VERTICAL', () => {
      describe('if number of products is greater than the carousel size', () => {
        it('should render <Arrow />s', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            axis: CAROUSEL_AXIS_VERTICAL,
            products: generateProducts(3),
          })
          expect(
            wrapper
              .find(Arrow)
              .find({ direction: 'top' })
              .exists()
          ).toBe(true)
          expect(
            wrapper
              .find(Arrow)
              .find({ direction: 'bottom' })
              .exists()
          ).toBe(true)
        })

        it('should supply correct `style` to <ProductCarouselItem />', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            axis: CAROUSEL_AXIS_VERTICAL,
            products: generateProducts(3),
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .first()
              .prop('style')
          ).toEqual({
            height: '50%',
            transform: `translateY(0%)`,
            zIndex: '1',
          })
        })

        it('should supply `amplienceUrl` to <ProductCarouselItem />', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            axis: CAROUSEL_AXIS_VERTICAL,
            products: generateProducts(1),
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .first()
              .prop('amplienceUrl')
          ).toEqual('url')
        })

        it('should hide <ProductCarouselItem /> items outside of the carousel window view', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            axis: CAROUSEL_AXIS_VERTICAL,
            products: generateProducts(3),
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .at(2)
              .prop('style').zIndex
          ).toBe('0')
        })

        it('should supply the correct axis to <ProductCarouselItem />', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            products: generateProducts(3),
            axis: CAROUSEL_AXIS_VERTICAL,
          })
          expect(
            wrapper
              .find(ProductCarouselItem)
              .at(0)
              .prop('axis')
          ).toBe(CAROUSEL_AXIS_VERTICAL)
        })
      })
    })

    describe('peepNextItem is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(4),
        peepNextItem: true,
      })

      it('should make items width smaller', () => {
        const itemsOnShow = 2
        const peepSizeModifier = 0.3
        const itemSize = wrapper
          .find(ProductCarouselItem)
          .first()
          .props().style.width
        const expectedSize = `${100 / (itemsOnShow + peepSizeModifier)}%`

        expect(itemSize).toEqual(expectedSize)
      })
      it('arrows should be hidden', () => {
        expect(wrapper.find(Arrow).exists()).toBe(false)
      })
    })
  })

  describe('@events', () => {
    it('should decrease position on forward arrow click', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(7),
      })
      wrapper.find({ direction: 'right' }).prop('onClick')()
      expect(wrapper.state('position')).toBe(0)
    })

    it('should increase position on backward arrow click', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(7),
      })
      wrapper.find({ direction: 'left' }).prop('onClick')()
      expect(wrapper.state('position')).toBe(2)
    })

    it('should wrap position around if moving past the end of the carousel', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(7),
      })
      const clickRightArrow = wrapper
        .find({ direction: 'right' })
        .prop('onClick')
      clickRightArrow()
      clickRightArrow()
      expect(wrapper.state('position')).toBe(6)
    })

    it('should move carousel forward on backward swipe', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(7),
      })
      const swipe = wrapper.find('Hammer').prop('onSwipe')
      swipe({ direction: 2 })
      expect(wrapper.state('position')).toBe(0)
    })

    it('should move backward on forward swipe', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(7),
      })
      const swipe = wrapper.find('Hammer').prop('onSwipe')
      swipe({ direction: 4 })
      expect(wrapper.state('position')).toBe(2)
    })

    it('should pass hammerOptions to hammerJS', () => {
      const hammerOptions = { domEvents: true }
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(7),
        hammerOptions,
      })
      expect(wrapper.find('Hammer').prop('options')).toBe(hammerOptions)
    })

    describe('onCarouselArrowClick', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        products: generateProducts(7),
        onCarouselArrowClick: jest.fn(),
      })
      const onCarouselArrowClickSpy = jest.spyOn(
        wrapper.instance().props,
        'onCarouselArrowClick'
      )
      it('should call onCarouselArrowClick on forward arrow click', () => {
        wrapper.find({ direction: 'right' }).prop('onClick')()
        expect(onCarouselArrowClickSpy).toHaveBeenCalledTimes(1)
      })

      it('should call onCarouselArrowClick on backward arrow click', () => {
        wrapper.find({ direction: 'left' }).prop('onClick')()
        expect(onCarouselArrowClickSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})

describe('<Arrow />', () => {
  const renderComponent = testComponentHelper(Arrow)

  describe('@renders', () => {
    it('should render correctly', () => {
      expect(
        renderComponent({ direction: 'forward', onClick: jest.fn() }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    it('should call `onClick` on button click', () => {
      const onClickMock = jest.fn()
      const { wrapper } = renderComponent({
        direction: 'forward',
        onClick: onClickMock,
      })
      const event = {}
      wrapper.find('button').prop('onClick')(event)
      expect(onClickMock).toHaveBeenCalledWith(event)
    })
  })
})
