import { Link } from 'react-router'

import testComponentHelper from 'test/unit/helpers/test-component'

import ShopTheLook from '../ShopTheLook'
import ProductCarousel from '../../ProductCarousel/ProductCarousel'

describe('<ShopTheLook />', () => {
  const shopTheLookProducts = [
    {
      bundleId: '22092706',
      productDisplayURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/sleeveless-suede-trench-coat-by-rare-4699824',
      bundleImagePath:
        'http://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/62S15IBLK_thumb.jpg',
      bundleProductPrice: '55.0',
      productId: '12345',
    },
    {
      bundleId: '22092706',
      productDisplayURL:
        'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/skeleton-print-mini-dress-4857523',
      bundleImagePath:
        'http://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/10D22IBLK_thumb.jpg',
      bundleProductPrice: '28.0',
      productId: '123456',
    },
  ]
  const requiredProps = {
    bundleURL:
      'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/3-fixed-outfit-shop-the-look-4910692?bundle=true',
  }
  const renderComponent = testComponentHelper(ShopTheLook)

  describe('@renders', () => {
    it('should render nothing by default', () => {
      const { wrapper } = renderComponent(requiredProps)
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should render if there are products', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        shopTheLookProducts,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should pass correct `products` prop to <ProductCarousel />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        shopTheLookProducts,
      })
      expect(wrapper.find(ProductCarousel).prop('products')).toEqual([
        {
          name: '',
          url:
            'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/sleeveless-suede-trench-coat-by-rare-4699824',
          imageUrl:
            'http://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/62S15IBLK_thumb.jpg',
          price: '55.0',
          productId: 12345,
        },
        {
          name: '',
          url:
            'http://ts.pplive.arcadiagroup.ltd.uk/en/tsuk/product/skeleton-print-mini-dress-4857523',
          imageUrl:
            'http://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/10D22IBLK_thumb.jpg',
          price: '28.0',
          productId: 123456,
        },
      ])
    })

    it('should pass correct `to` prop to <Link />', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        shopTheLookProducts,
      })
      expect(wrapper.find(Link).prop('to')).toBe(
        '/en/tsuk/product/3-fixed-outfit-shop-the-look-4910692?bundle=true'
      )
    })
  })
})
