import testComponentHelper from 'test/unit/helpers/test-component'
import CarouselThumbnail from '../CarouselThumbnail'
import ResponsiveImage from '../../ResponsiveImage/ResponsiveImage'

describe('<CarouselThumbnail />', () => {
  const initProps = {
    name: 'overlayThumbs',
    mode: 'thumbnail',
    carousel: {
      overlayThumbs: {
        direction: 'right',
        previous: -1,
        current: 0,
        max: 7,
        zoom: 1,
        panX: 0,
        panY: 0,
      },
    },
    assets: [
      {
        url: 'http://topshop.com/assets/demo_image_1.jpg',
        assetType: 'IMAGE_SMALL',
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
    className: '',
    touchEnabled: false,
    isMobile: false,
    backCarousel: jest.fn(),
    forwardCarousel: jest.fn(),
    onClick: jest.fn(),
  }

  const newAssets = [
    {
      url: 'http://topshop.com/assets/demo_image_4.jpg',
      assetType: 'IMAGE_SMALL',
    },
    {
      url: 'http://topshop.com/assets/demo_image_5.jpg',
      assetType: 'IMAGE_SMALL',
    },
  ]

  const renderComponent = testComponentHelper(CarouselThumbnail)

  describe('@renders', () => {
    it('with a default state', () => {
      expect(renderComponent(initProps).getTree()).toMatchSnapshot()
    })
    it('with empty assets', () => {
      expect(
        renderComponent({
          ...initProps,
          assets: [],
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with mode thumbnail', () => {
      expect(
        renderComponent({
          ...initProps,
          mode: 'thumbnail',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when desktop and zoomed in', () => {
      expect(
        renderComponent({
          ...initProps,
          isMobile: false,
          carousel: {
            overlayThumbs: {
              ...initProps.carousel.overlayThumbs,
              zoom: 2,
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })
    it('without carousel arrow buttons if assets is less than 5', () => {
      const { wrapper } = renderComponent(initProps)
      expect(wrapper.find('.Carousel-arrow')).toHaveLength(0)
    })
    it('with carousel arrow buttons if assets is greater than 4', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        assets: initProps.assets.concat(newAssets),
      })
      expect(wrapper.find('.Carousel-arrow')).toHaveLength(2)
    })
    it('with padding when assets is greater than 4', () => {
      const { instance } = renderComponent(initProps)
      expect(
        instance.addClassNamesToCarouselImages(
          initProps.assets.concat(newAssets),
          4
        )
      ).toBe('Carousel-images Carousel-images--padding')
    })
    it('without padding when assets is less than 5', () => {
      const { instance } = renderComponent(initProps)
      expect(instance.addClassNamesToCarouselImages(initProps.assets, 4)).toBe(
        'Carousel-images'
      )
    })
    it('should be centered if assets is more than 5', () => {
      const { instance } = renderComponent(initProps)
      expect(
        instance.centerThumbnails(initProps.assets.concat(newAssets), 4)
      ).toEqual({ justifyContent: 'center' })
    })
    it('with responsive images and sizes', () => {
      const assets = [{ url: 'image 2 ' }, { url: 'image 2' }]
      const amplienceImages = ['url 1', 'url 2']
      const sizes = { mobile: 1, tablet: 2, desktop: 3 }
      const { wrapper } = renderComponent({
        ...initProps,
        sizes,
        assets,
        amplienceImages,
      })

      const responsiveImage = wrapper.find(ResponsiveImage)
      expect(responsiveImage).toHaveLength(assets.length)
      assets.forEach((asset, index) => {
        expect(responsiveImage.at(index).prop('sizes')).toBe(sizes)
        expect(responsiveImage.at(index).prop('amplienceUrl')).toBe(
          amplienceImages[index]
        )
      })
    })
  })
})
