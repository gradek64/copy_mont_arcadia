import testComponentHelper from 'test/unit/helpers/test-component'
import ImageOverlay from '../ImageOverlay'
import Carousel from '../../Carousel/Carousel'
import { IMAGE_SIZES } from '../../../../constants/amplience'

const initProps = {
  setCarouselIndex: () => {},
  isFeatureCarouselThumbnailEnabled: false,
  assets: [
    {
      url: 'http://topshop.com/assets/demo_image_1.jpg',
      assetType: 'IMAGE_LARGE',
    },
    {
      url: 'http://topshop.com/assets/demo_image_2.jpg',
      assetType: 'IMAGE_LARGE',
    },
    {
      url: 'http://topshop.com/assets/demo_image_2.jpg',
      assetType: 'IMAGE_SMALL',
    },
    {
      url: 'http://topshop.com/assets/demo_image_3.jpg',
      assetType: 'IMAGE_SMALL',
    },
  ],
  amplienceImages: ['url1', 'url2'],
  initialCarouselIndex: 3,
}

describe('<ImageOverlay />', () => {
  const renderComponent = testComponentHelper(ImageOverlay.WrappedComponent)

  describe('@renders', () => {
    it('should render without carousel thumbnails when isFeatureCarouselThumbnailEnabled is not enabled', () => {
      expect(renderComponent(initProps).getTree()).toMatchSnapshot()
    })

    it('should render with carousel thumbnails when isFeatureCarouselThumbnailEnabled is enabled', () => {
      const { wrapper, getTree } = renderComponent({
        ...initProps,
        isFeatureCarouselThumbnailEnabled: true,
      })
      const renderedCarouselThumbnails = wrapper.find(Carousel).at(0)
      const renderedCarouselLarge = wrapper.find(Carousel).at(1)
      expect(getTree()).toMatchSnapshot()
      expect(renderedCarouselThumbnails.prop('amplienceImages')).toEqual(
        initProps.amplienceImages
      )
      expect(renderedCarouselThumbnails.prop('sizes')).toEqual(
        IMAGE_SIZES.thumbnails
      )
      expect(renderedCarouselLarge.prop('amplienceImages')).toEqual(
        initProps.amplienceImages
      )
      expect(renderedCarouselLarge.prop('sizes')).toEqual(
        IMAGE_SIZES.overlayLarge
      )
    })
  })
})
