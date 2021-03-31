import ProductMedia from '../ProductMedia'
import Carousel from '../../Carousel/Carousel'
import ProductVideo from '../../ProductVideo/ProductVideo'
import testComponentHelper from '../../../../../../test/unit/helpers/test-component'

describe('<ProductMedia />', () => {
  beforeEach(() => jest.clearAllMocks())
  const largeAssets = [
    { assetType: 'IMAGE_LARGE', name: 'image1' },
    { assetType: 'IMAGE_LARGE', name: 'image2' },
  ]
  const initialProps = {
    name: 'defaultName',
    productId: 12345,
    amplienceAssets: {
      images: ['url 1', 'url 2'],
    },
    assets: [
      ...largeAssets,
      { assetType: 'VIDEO', name: 'video', url: 'video-url' },
    ],
  }
  const renderComponent = testComponentHelper(ProductMedia)

  describe('@renders', () => {
    it('Carousel with name', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Carousel).prop('name')).toEqual(initialProps.name)
    })

    it('Carousel with Amplience images', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Carousel).prop('amplienceImages')).toEqual(
        initialProps.amplienceAssets.images
      )
    })

    it('Carousel with assets', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Carousel).prop('assets')).toEqual(largeAssets)
    })

    it('Carousel with imageOverlayAssets', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Carousel).prop('imageOverlayAssets')).toEqual(
        initialProps.assets
      )
    })

    it('Carousel without hiding prop by default', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Carousel).prop('isHidden')).toBeFalsy()
    })

    it('Carousel with hiding prop when video is played', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      instance.play()
      wrapper.update()
      expect(wrapper.find(Carousel).prop('isHidden')).toBeTruthy()
    })

    it('Carousel without image overlay by default', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(Carousel).prop('enableImageOverlay')).toBeFalsy()
    })

    it('Carousel with image overlay when enabled', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        enableImageOverlay: true,
      })
      expect(wrapper.find(Carousel).prop('enableImageOverlay')).toBeTruthy()
    })

    it('without product video by default', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(ProductVideo)).toHaveLength(0)
    })

    it('ProductVideo with video url when video is enabled', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        enableVideo: true,
      })
      expect(wrapper.find(ProductVideo).prop('videoUrl')).toBe('video-url')
    })

    it('ProductVideo with Amplience video url when video is enabled', () => {
      const amplienceVideo = 'amplienceVideo'
      const amplienceAssets = {
        ...initialProps.amplienceAssets,
        video: amplienceVideo,
      }
      const { wrapper } = renderComponent({
        ...initialProps,
        amplienceAssets,
        enableVideo: true,
      })
      expect(wrapper.find(ProductVideo).prop('amplienceVideo')).toBe(
        amplienceVideo
      )
    })

    it('ProductVideo with play handler when video is enabled', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        enableVideo: true,
      })
      expect(wrapper.find(ProductVideo).prop('play')).toBeTruthy()
    })
  })
})
