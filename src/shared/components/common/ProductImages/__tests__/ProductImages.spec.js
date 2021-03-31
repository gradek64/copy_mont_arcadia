import testComponentHelper from 'test/unit/helpers/test-component'
import ProductImages from '../ProductImages'
import setupConnectionType from '../../../../../../test/unit/helpers/setup-connection-type'
import WishlistButton from '../../WishlistButton/WishlistButton'
import ResponsiveImage from '../../ResponsiveImage/ResponsiveImage'

import WithQubit from '../../Qubit/WithQubit'

jest.mock('../../../../lib/viewHelper', () => ({
  touchDetection: jest.fn(() => false),
}))

const productImage =
  '//media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_2col_F_1.jpg'
const outfitImage =
  '//media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_2col_M_1.jpg'

const assets = [
  {
    assetType: 'IMAGE_SMALL',
    index: 1,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Thumb_F_1.jpg',
  },
  {
    assetType: 'IMAGE_THUMB',
    index: 1,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Small_F_1.jpg',
  },
  {
    assetType: 'IMAGE_NORMAL',
    index: 1,
    url: `http:${productImage}`,
  },
  {
    assetType: 'IMAGE_LARGE',
    index: 1,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Zoom_F_1.jpg',
  },
]

const additionalAssets = [
  {
    assetType: 'IMAGE_ZOOM',
    index: 1,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Zoom_F_1.jpg',
  },
  {
    assetType: 'IMAGE_2COL',
    index: 1,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_2col_F_1.jpg',
  },
  {
    assetType: 'IMAGE_OUTFIT_SMALL',
    index: 2,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Thumb_M_1.jpg',
  },
  {
    assetType: 'IMAGE_OUTFIT_THUMB',
    index: 2,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Small_M_1.jpg',
  },
  {
    assetType: 'IMAGE_OUTFIT_NORMAL',
    index: 2,
    url: `http:${outfitImage}`,
  },
  {
    assetType: 'IMAGE_OUTFIT_LARGE',
    index: 2,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Large_M_1.jpg',
  },
  {
    assetType: 'IMAGE_OUTFIT_ZOOM',
    index: 2,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Zoom_M_1.jpg',
  },
  {
    assetType: 'IMAGE_OUTFIT_2COL',
    index: 2,
    url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_2col_M_1.jpg',
  },
]

const getResponsiveImage = (w) => w.find(ResponsiveImage)
const isShowingProductImage = (w) => {
  const hasCorrectImgSrc = getResponsiveImage(w).props().src === productImage
  return hasCorrectImgSrc
}
const isShowingOutfitImage = (w) => {
  const hasCorrectImgSrc = getResponsiveImage(w).props().src === outfitImage
  return hasCorrectImgSrc
}

/**
 * Test that ResponsiveImage is called correctly rather than testing it's behaviour
 * @param  {ShallowWrapper} wrapper
 * @param  {Object} partialProps
 * @return {undefined}
 */
const expectResponsiveImageWithProps = (wrapper, partialProps) => {
  const respImgProps = getResponsiveImage(wrapper).props()
  expect(respImgProps).toEqual(expect.objectContaining(partialProps))
}

describe('<ProductImages/>', () => {
  const props = {
    assets,
    additionalAssets,
    showProductView: true,
    productDescription: 'This is a jeans',
    grid: 3,
    productBaseImageUrl: '//product-image.jpg',
    outfitBaseImageUrl: '//outfit-image.jpg',
    sizes: {
      mobile: 1,
      tablet: 1,
      desktop: 1,
    },
    productId: '100',
    productRoute:
      '%2Fen%2Fevuk%2Fproduct%2Fclothing-250468%2Fnude-kitten-court-heel-shoes-7715200',
    isImageFallbackEnabled: false,
    lazyLoad: true,
    isMobile: false,
    isCarouselItem: false,
  }

  const renderComponent = testComponentHelper(ProductImages)

  it('`showProduct` shows the product image', () => {
    const { wrapper } = renderComponent(props)

    expect(isShowingProductImage(wrapper)).toBeTruthy()
    expectResponsiveImageWithProps(wrapper, {
      isImageFallbackEnabled: props.isImageFallbackEnabled,
      lazyLoad: props.lazyLoad,
      amplienceUrl: props.productBaseImageUrl,
      sizes: props.sizes,
      alt: props.productDescription,
    })
  })

  it('`!showProduct` shows the outfit image', () => {
    const { wrapper } = renderComponent({
      ...props,
      showProductView: false,
    })
    expect(isShowingOutfitImage(wrapper)).toBeTruthy()
  })

  describe('when `isMobile` is equal to false', () => {
    it('hovering on the product image shows the outfit image', () => {
      const { wrapper } = renderComponent(props)

      wrapper.setState({ hovered: true })

      expect(isShowingOutfitImage(wrapper)).toBeTruthy()
    })

    it('hovering on product image and no outfit image still shows product image', () => {
      const { wrapper } = renderComponent({ ...props, additionalAssets: [] })

      wrapper.setState({ hovered: true })

      expect(isShowingProductImage(wrapper)).toBeTruthy()
    })

    it('hovering on outfit image shows the product image', () => {
      const { wrapper } = renderComponent({
        ...props,
        showProductView: false,
      })

      wrapper.setState({ hovered: true })

      expect(isShowingProductImage(wrapper)).toBeTruthy()
    })
  })

  describe('when `isMobile` is equal to true', () => {
    it('hovering on the product image still shows the product image', () => {
      const { wrapper } = renderComponent({ ...props, isMobile: true })

      wrapper.setState({ hovered: true })
      expect(isShowingProductImage(wrapper)).toBeTruthy()
    })

    it('hovering on outfit image still shows the outfit image', () => {
      const { wrapper } = renderComponent({
        ...props,
        showProductView: false,
        isMobile: true,
      })

      wrapper.setState({ hovered: true })

      expect(isShowingOutfitImage(wrapper)).toBeTruthy()
    })
    it('set image as a productImage mobile in order to add the transition when its need it', () => {
      const { wrapper } = renderComponent({ ...props, isMobile: true })
      expect(wrapper.find('.ProductImages-mobile').length).toBe(1)
    })
  })

  it('shows product image if there are no `additionalAssets` (ignores `showProduct` value)', () => {
    const ps = {
      ...props,
      additionalAssets: [],
      showProduct: false,
    }

    expect(isShowingProductImage(renderComponent(ps).wrapper)).toBeTruthy()
    expect(
      isShowingProductImage(
        renderComponent({ ...ps, showProduct: true }).wrapper
      )
    ).toBeTruthy()
  })

  it('if no assets then show "image not unavailable" image ', () => {
    const { wrapper } = renderComponent({ ...props, assets: [] })

    expect(getResponsiveImage(wrapper).props().src).toBe(
      '/assets/common/images/image-not-available.png'
    )
  })

  it("hides image before it's loaded or lazyload is false so that it can transition the images appearence", () => {
    setupConnectionType('4g')
    const { wrapper } = renderComponent(props)

    expect(wrapper.find('.ProductImages-image').length).toBe(1)
    expect(wrapper.find('.ProductImages-mobile--showing').length).toBe(0)
  })

  describe('wishlist button', () => {
    it('should not render the wishlist button by default', () => {
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(WishlistButton)).toHaveLength(0)
    })

    it('should render the wishlist button if `showWishlistButton` is true', () => {
      const { wrapper } = renderComponent({
        ...props,
        showWishlistButton: true,
      })
      expect(wrapper.find(WishlistButton)).toHaveLength(1)
      expect(wrapper.find(WishlistButton).prop('productId')).toBe(
        props.productId
      )
      expect(wrapper.find(WishlistButton).prop('modifier')).toBe('plp')
    })

    it('should not render the wishlist button if `showWishlistButton` is false', () => {
      const { wrapper } = renderComponent({
        ...props,
        showWishlistButton: false,
      })
      expect(wrapper.find(WishlistButton)).toHaveLength(0)
    })
  })
  describe('@qubit', () => {
    describe('touch disabled and isCarouselItem is false', () => {
      const { wrapper } = renderComponent({ ...props, isCarouselItem: false })
      const qubitWrapper = wrapper.find(WithQubit)
      it('should render a qubit react wrapper for quick add to bag with correct id', () => {
        expect(qubitWrapper.props().id).toBe('qubit-quick-add-to-bag')
        expect(qubitWrapper.length).toBe(1)
      })
      it('should render a qubit react wrapper with correct props', () => {
        expect(qubitWrapper.props().viewport).toBe('desktop')
        expect(qubitWrapper.props().productId).toBe('100')
        expect(qubitWrapper.props().productRoute).toBe(
          '%2Fen%2Fevuk%2Fproduct%2Fclothing-250468%2Fnude-kitten-court-heel-shoes-7715200'
        )
        expect(qubitWrapper.props().shouldUseQubit).toBe(true)
      })
    })
    describe('touch disabled and isCarouselItem is true', () => {
      const { wrapper } = renderComponent({
        ...props,
        touchEnabled: true,
        isCarouselItem: true,
      })
      const qubitWrapper = wrapper.find(WithQubit)
      it('should not render a qubit react wrapper', () => {
        expect(qubitWrapper.length).toBe(0)
      })
    })
    describe('touch enabled', () => {
      const { wrapper } = renderComponent({ ...props, touchEnabled: true })
      const qubitWrapper = wrapper.find(WithQubit)
      it('should not render a qubit react wrapper', () => {
        expect(qubitWrapper.length).toBe(0)
      })
    })
  })
})
