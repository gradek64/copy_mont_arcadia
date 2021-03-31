import toJson from 'enzyme-to-json'
import testComponentHelper from 'test/unit/helpers/test-component'

import { WrappedProductCarouselItem } from '../ProductCarouselItem'
import Product from '../../Product/Product'
import { IMAGE_SIZES } from '../../../../constants/amplience'
import {
  CAROUSEL_AXIS_HORIZONTAL,
  CAROUSEL_AXIS_VERTICAL,
} from '../../../../constants/productCarouselConstants'

describe('<ProductCarouselItem />', () => {
  const requiredProps = {
    clearProduct: () => {},
  }
  const renderComponent = testComponentHelper(WrappedProductCarouselItem)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should add `style` to `.ProductCarouselItem` element', () => {
      const style = {
        width: '100%',
      }
      const { wrapper } = renderComponent({
        ...requiredProps,
        style,
      })
      expect(wrapper.prop('style')).toBe(style)
    })

    it('should add the correct class for horizontal carousel', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        axis: CAROUSEL_AXIS_HORIZONTAL,
      })
      expect(wrapper.prop('className')).toBe(
        'ProductCarouselItem ProductCarouselItem-horizontal'
      )
    })

    it('should add the correct class for horizontal carousel', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        axis: CAROUSEL_AXIS_VERTICAL,
      })
      expect(wrapper.prop('className')).toBe(
        'ProductCarouselItem ProductCarouselItem-vertical'
      )
    })

    it('should pass `name and sizes` to <Product />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        name: 'Slouchy Check Tailored Suit Trousers',
      })
      expect(wrapper.find(Product).prop('name')).toBe(
        'Slouchy Check Tailored Suit Trousers'
      )
      expect(wrapper.find(Product).prop('sizes')).toBe(IMAGE_SIZES.smallProduct)
    })

    it('should pass `productBaseImageUrl` to <Product />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        amplienceUrl: 'url',
      })
      expect(wrapper.find(Product).prop('productBaseImageUrl')).toBe('url')
    })

    it('should pass `productId` to <Product />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        productId: 21466444,
      })
      expect(wrapper.find(Product).prop('productId')).toBe(21466444)
    })

    it('should pass `productUrl` to <Product />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        url:
          'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/slouchy-check-tailored-suit-trousers-4763217',
      })
      expect(wrapper.find(Product).prop('productUrl')).toBe(
        'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/slouchy-check-tailored-suit-trousers-4763217'
      )
    })

    it('should construct `productUrl` from `lang`, `storeCode` and `productId`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        lang: 'en',
        storeCode: 'tsuk',
        productId: 21466444,
      })
      expect(wrapper.find(Product).prop('productUrl')).toBe(
        '/en/tsuk/product/21466444'
      )
    })

    it('should pass `assets` to <Product />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        imageUrl:
          '//ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/36R19IBRN_large.jpg',
      })
      expect(wrapper.find(Product).prop('assets')).toEqual([
        {
          url:
            '//ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/36R19IBRN_large.jpg',
        },
      ])
    })

    it('should pass `unitPrice` to <Product />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        price: '45.00',
      })
      expect(wrapper.find(Product).prop('unitPrice')).toBe('45.00')
    })

    it('should render ‘remove’ button if `canRemoveProduct` is true', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        canRemoveProduct: true,
      })
      expect(
        toJson(wrapper.find('.ProductCarouselItem-delete'))
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('on ’Product Link’ click', () => {
      it('should call `clearProduct`', () => {
        const clearProductMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          clearProduct: clearProductMock,
        })
        wrapper.find(Product).prop('onLinkClick')()
        expect(clearProductMock).toHaveBeenCalled()
      })

      it('should call `onLinkClick` with product ID', () => {
        const onLinkClickMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          productId: 21466444,
          onLinkClick: onLinkClickMock,
        })
        wrapper.find(Product).prop('onLinkClick')()
        expect(onLinkClickMock).toHaveBeenCalledWith(21466444)
      })
    })

    describe('on ‘Remove Product’ click', () => {
      it('should call `onProductRemove`, with product ID, on remove button click', () => {
        const onProductRemoveMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          productId: 21466444,
          canRemoveProduct: true,
          onProductRemove: onProductRemoveMock,
        })
        wrapper.find('.ProductCarouselItem-delete').prop('onClick')()
        expect(onProductRemoveMock).toHaveBeenCalledWith(21466444)
      })
    })
  })
})
