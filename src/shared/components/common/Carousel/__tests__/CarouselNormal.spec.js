import testComponentHelper, {
  buildComponentRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import CarouselNormal, { EMPTY_IMAGE } from '../CarouselNormal'
import CarouselImagesOverlay from '../CarouselImagesOverlay'

import KEYS from '../../../../constants/keyboardKeys'

import ResponsiveImage from '../../ResponsiveImage/ResponsiveImage'
import { compose } from 'ramda'

describe('<CarouselNormal />', () => {
  const initProps = {
    name: 'productDetail',
    carousel: {
      productDetail: {
        direction: 'right',
        previous: -1,
        current: 0,
        max: 6,
        zoom: 1,
        panX: 0,
        panY: 0,
        initialIndex: 0,
      },
    },
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
        url: 'http://topshop.com/assets/demo_image_3.jpg',
        assetType: 'IMAGE_LARGE',
      },
    ],
    touchEnabled: false,
    isHidden: false,
    backCarousel: jest.fn(),
    forwardCarousel: jest.fn(),
    onClick: jest.fn(),
  }

  const CarouselRef = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    current: {
      querySelector: () => {
        return {
          offsetWidth: 1000,
          offsetHeight: 1000,
          style: {},
        }
      },
      offsetTop: 20,
      getBoundingClientRect: jest.fn(() => ({
        height: 4,
        width: 1000,
        left: 0,
        top: 0,
      })),
    },
  }
  const renderComponent = testComponentHelper(CarouselNormal, {
    disableLifecycleMethods: true,
  })

  const renderMountStore = compose(
    mountRender,
    withStore({
      features: { status: '' },
      config: {
        brandName: 'topman',
        brandCode: 'tm',
      },
    })
  )

  const mountRenderComponent = buildComponentRender(
    renderMountStore,
    CarouselNormal
  )

  describe('@renders', () => {
    it('in default state', () => {
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
    it('with mode', () => {
      expect(
        renderComponent({
          ...initProps,
          mode: 'large',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with arrowColor', () => {
      expect(
        renderComponent({
          ...initProps,
          arrowColor: 'green',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with showcase as true', () => {
      expect(
        renderComponent({
          ...initProps,
          showcase: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with autoplay', () => {
      expect(
        renderComponent({
          ...initProps,
          autoplay: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when mobile and zoomed in', () => {
      expect(
        renderComponent({
          ...initProps,
          isMobile: true,
          carousel: {
            productDetail: {
              ...initProps.carousel.productDetail,
              zoom: 2,
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when desktop and zoomed in', () => {
      expect(
        renderComponent({
          ...initProps,
          isMobile: false,
          carousel: {
            productDetail: {
              ...initProps.carousel.productDetail,
              zoom: 2,
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with showZoomIcon', () => {
      expect(
        renderComponent({
          ...initProps,
          showZoomIcon: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('should set initial item', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        showZoomIcon: true,
      })
      expect(wrapper.find('.Carousel-initialItem')).toHaveLength(1)
    })
    it('should not hide carousel', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        isHidden: false,
      })
      expect(wrapper.find('.Carousel--invisible')).toHaveLength(0)
    })
    it('should hide carousel', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        isHidden: true,
      })
      expect(wrapper.find('.Carousel--invisible')).toHaveLength(1)
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

    it('should adjust the initial carousel image according to the initial index', () => {
      expect(
        renderComponent({
          ...initProps,
          carousel: {
            ...initProps.carousel,
            productDetail: {
              ...initProps.carousel.productDetail,
              initialIndex: 2,
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('zoom styles', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        carousel: {
          ...initProps.carousel,
          productDetail: {
            ...initProps.carousel.productDetail,
            current: 2,
            zoom: 2.3,
            panX: '123',
            panY: '456',
          },
        },
        isMobile: true,
      })

      it('should only apply the zoom styles to the selected image', () => {
        expect(
          wrapper
            .find(ResponsiveImage)
            .first()
            .prop('style')
        ).toBe(null)
        expect(
          wrapper
            .find(ResponsiveImage)
            .last()
            .prop('style')
        ).toEqual({
          transform: 'scale(2.3)',
          WebkitTransform: 'scale(2.3)',
          transition: 'transform 0.3s ease',
        })
      })

      it('should only apply the pan styles to the div wrapping the selected image', () => {
        expect(
          wrapper
            .find(ResponsiveImage)
            .first()
            .parent()
            .prop('style')
        ).toBe(null)
        expect(
          wrapper
            .find(ResponsiveImage)
            .last()
            .parent()
            .prop('style')
        ).toEqual({
          transform: 'translate(123px, 456px)',
          WebkitTransform: 'translate(123px, 456px)',
        })
      })
    })

    it('renders CarouselImagesOverlay', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        carousel: {
          ...initProps.carousel,
          productDetail: {
            ...initProps.carousel.productDetail,
            current: 2,
            zoom: 2.3,
            panX: '123',
            panY: '456',
          },
        },
        isMobile: true,
      })

      expect(wrapper.find(CarouselImagesOverlay).exists()).toBe(true)
    })
  })

  describe('Image sizing', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('measures the first image on click and sets the content height', (done) => {
      const assets = [{ url: 'image 2 ' }, { url: 'image 2' }]
      const amplienceImages = ['url 1', 'url 2']
      const sizes = { mobile: 1, tablet: 2, desktop: 3 }
      const componentProps = {
        ...initProps,
        sizes,
        assets,
        amplienceImages,
      }

      const { wrapper, instance } = renderComponent(componentProps)
      const mockFunc = {
        preventDefault: jest.fn(),
        callback: jest.fn(),
      }

      Object.defineProperty(global.document, 'querySelector', {
        writable: true,
        value: jest.fn(() => {
          return { height: 1000, src: '' }
        }),
      })

      const setStateSpy = jest.spyOn(instance, 'setState')

      wrapper.find('.Carousel-arrow--left').simulate('click', mockFunc)
      wrapper.update()

      setTimeout(() => {
        expect(setStateSpy).toHaveBeenCalledWith(
          { height: 1000 },
          expect.any(Function)
        )
        done()
      }, 0)
    })

    it('does not update measurements if image has not been changed', async () => {
      const assets = [{ url: 'image 2 ' }, { url: 'image 2' }]
      const amplienceImages = ['url 1', 'url 2']
      const sizes = { mobile: 1, tablet: 2, desktop: 3 }
      const { instance } = renderComponent({
        ...initProps,
        sizes,
        assets,
        amplienceImages,
      })

      const setStateSpy = jest.spyOn(instance, 'setState')

      expect(setStateSpy).toHaveBeenCalledTimes(0)
    })

    it('does not set height to zero', (done) => {
      const assets = [{ url: 'image 2 ' }, { url: 'image 2' }]
      const amplienceImages = ['url 1', 'url 2']
      const sizes = { mobile: 1, tablet: 2, desktop: 3 }
      const componentProps = {
        ...initProps,
        sizes,
        assets,
        amplienceImages,
      }
      const { wrapper, instance } = renderComponent(componentProps)

      const mockFunc = {
        preventDefault: jest.fn(),
        callback: jest.fn(),
      }
      const setStateSpy = jest.spyOn(instance, 'setState')

      Object.defineProperty(global.document, 'querySelector', {
        writable: true,
        value: jest.fn(() => {
          return { height: 0, src: '' }
        }),
      })

      wrapper.find('.Carousel-arrow--left').simulate('click', mockFunc)
      wrapper.update()

      setTimeout(() => {
        expect(setStateSpy).not.toHaveBeenCalled()
        done()
      }, 0)
    })

    it('does not update measurements if it is empty image', async () => {
      const assets = [{ url: EMPTY_IMAGE }, { url: EMPTY_IMAGE }]
      const amplienceImages = ['url 1', 'url 2']
      const sizes = { mobile: 1, tablet: 2, desktop: 3 }
      const { instance } = renderComponent({
        ...initProps,
        sizes,
        assets,
        amplienceImages,
      })

      const setStateSpy = jest.spyOn(instance, 'setState')

      expect(setStateSpy).not.toHaveBeenCalled()
    })

    it('updates the measurements if they become larger', (done) => {
      const assets = [{ url: 'image 2 ' }, { url: 'image 2' }]
      const amplienceImages = ['url 1', 'url 2']
      const sizes = { mobile: 1, tablet: 2, desktop: 3 }
      const componentProps = {
        ...initProps,
        sizes,
        assets,
        amplienceImages,
      }
      const { wrapper, instance } = renderComponent(componentProps)
      const mockFunc = {
        preventDefault: jest.fn(),
        callback: jest.fn(),
      }
      const setStateSpy = jest.spyOn(instance, 'setState')

      Object.defineProperty(global.document, 'querySelector', {
        writable: true,
        value: jest.fn(() => {
          return { height: 700, src: '' }
        }),
      })

      wrapper.find('.Carousel-arrow--left').simulate('click', mockFunc)
      wrapper.update()

      setTimeout(() => {
        expect(setStateSpy).toHaveBeenCalledWith(
          { height: 700 },
          expect.any(Function)
        )
        done()
      }, 0)
    })
  })

  describe('@lifecycle', () => {
    describe('on componentDidMount', () => {
      let renderedComponent

      beforeEach(() => {
        renderedComponent = renderComponent({
          ...initProps,
          handleSwipe: jest.fn(),
          carouselZoom: jest.fn(),
          isMobile: true,
        })
        jest.resetAllMocks()
        jest.useFakeTimers()
      })

      it('to call setInterval', () => {
        const { instance } = renderedComponent
        expect(setInterval).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(setInterval).toHaveBeenCalledWith(instance.autoplay, 4000)
        expect(setInterval).toHaveBeenCalledTimes(1)
      })

      it('to not call handleSwipe when autoplay is false', () => {
        const { instance } = renderedComponent
        instance.componentDidMount()
        jest.runTimersToTime(4000)
        expect(instance.props.handleSwipe).not.toHaveBeenCalled()
      })
      it('to call handleSwipe when autoplay is true and has more than 1 asset', () => {
        const { instance } = renderComponent({
          ...initProps,
          handleSwipe: jest.fn(),
          carouselZoom: jest.fn(),
          autoplay: true,
          isMobile: true,
        })
        expect(instance.props.handleSwipe).not.toHaveBeenCalled()
        instance.componentDidMount()
        jest.runTimersToTime(4000)
        expect(instance.props.handleSwipe).toHaveBeenCalledTimes(1)
        expect(instance.props.handleSwipe).toHaveBeenCalledWith({
          direction: 2,
        })
      })
      it('to not call handleSwipe when it has only 1 asset', () => {
        const { instance } = renderComponent({
          ...initProps,
          handleSwipe: jest.fn(),
          carouselZoom: jest.fn(),
          autoplay: true,
          isMobile: true,
          assets: [
            {
              url: 'http://topshop.com/assets/demo_image_1.jpg',
            },
          ],
        })
        instance.componentDidMount()
        jest.runTimersToTime(4000)
        expect(instance.props.handleSwipe).not.toHaveBeenCalled()
      })
      it('to call addEventListener on CarouselImage', () => {
        const { wrapper, instance } = mountRenderComponent({
          ...initProps,
          handleSwipe: jest.fn(),
          carouselZoom: jest.fn(),
          autoplay: true,
          isMobile: false,
          touchEnabled: false,
          assets: [
            {
              url: 'http://topshop.com/assets/demo_image_1.jpg',
            },
          ],
        })

        wrapper.find('.Carousel-images').getElement().ref.current = CarouselRef

        expect(
          instance.CarouselImageListRef.current.addEventListener
        ).not.toHaveBeenCalled()

        instance.componentDidMount()

        expect(
          instance.CarouselImageListRef.current.addEventListener
        ).toHaveBeenCalled()
      })

      it('to not call addEventListener on CarouselImage for mobile', () => {
        const { wrapper, instance } = mountRenderComponent({
          ...initProps,
          handleSwipe: jest.fn(),
          carouselZoom: jest.fn(),
          autoplay: true,
          isMobile: true,
          touchEnabled: true,
          assets: [
            {
              url: 'http://topshop.com/assets/demo_image_1.jpg',
            },
          ],
        })

        wrapper.find('.Carousel-images').getElement().ref.current = CarouselRef

        instance.componentDidMount()
        expect(
          instance.CarouselImageListRef.current.addEventListener
        ).not.toHaveBeenCalled()
      })
    })

    describe('on UNSAFE_componentWillReceiveProps', () => {
      beforeEach(() => {
        jest.resetAllMocks()
      })

      it('changing screen from mobile to desktop should call addEventListener on CarouselImage', () => {
        const { wrapper, instance } = mountRenderComponent({
          ...initProps,
          isMobile: true,
        })

        wrapper.find('.Carousel-images').getElement().ref.current = CarouselRef

        expect(
          instance.CarouselImageListRef.current.addEventListener
        ).not.toHaveBeenCalled()
        wrapper.setProps({ isMobile: false })
        expect(
          instance.CarouselImageListRef.current.addEventListener
        ).toHaveBeenCalledTimes(2)
        expect(
          instance.CarouselImageListRef.current.removeEventListener
        ).not.toHaveBeenCalled()
      })
      it('changing screen from desktop to mobile should call removeEventListener on CarouselImage', () => {
        const { wrapper, instance } = mountRenderComponent({
          ...initProps,
          isMobile: false,
        })

        wrapper.find('.Carousel-images').getElement().ref.current = CarouselRef

        expect(
          instance.CarouselImageListRef.current.removeEventListener
        ).not.toHaveBeenCalled()
        wrapper.setProps({ isMobile: true })
        expect(
          instance.CarouselImageListRef.current.removeEventListener
        ).toHaveBeenCalledTimes(2)
        expect(
          instance.CarouselImageListRef.current.addEventListener
        ).not.toHaveBeenCalled()
      })
      it('should enable animation when selected image is not equal to initial selected image', () => {
        const { wrapper } = mountRenderComponent({
          ...initProps,
        })

        expect(wrapper.find('.Carousel-initialItem')).toHaveLength(1)

        wrapper.setProps({
          carousel: { productDetail: { current: 1, direction: 'right' } },
        })
        expect(wrapper.state().shouldAnimate).toBe(true)

        expect(wrapper.find('.Carousel-initialItem')).toHaveLength(0)
        expect(wrapper.find('.Carousel-rightItem')).toHaveLength(3)
      })
    })

    describe('on componentWillUnmount', () => {
      let renderedComponent
      beforeEach(() => {
        renderedComponent = mountRenderComponent({
          ...initProps,
          carouselZoom: jest.fn(),
          carouselPan: jest.fn(),
        })

        renderedComponent.wrapper
          .find('.Carousel-images')
          .getElement().ref.current = CarouselRef
        jest.resetAllMocks()
      })
      it('should call carouselZoom', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.unmount()
        expect(instance.props.carouselZoom).toHaveBeenCalledTimes(1)
        expect(instance.props.carouselZoom).toHaveBeenCalledWith(
          instance.props.name,
          1
        )
      })
      it('should call carouselPan', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.unmount()
        expect(instance.props.carouselPan).toHaveBeenCalledTimes(1)
        expect(instance.props.carouselPan).toHaveBeenCalledWith(
          instance.props.name,
          0,
          0
        )
      })
      it('should call clearInterval', () => {
        const { wrapper } = renderedComponent
        expect(clearInterval).not.toHaveBeenCalled()
        wrapper.unmount()
        expect(clearInterval).toHaveBeenCalledTimes(1)
      })
      it('should call removeEventListener on CarouselImages is desktop', () => {
        const { instance } = renderedComponent
        instance.componentDidMount()
        expect(
          instance.CarouselImageListRef.current.removeEventListener
        ).not.toHaveBeenCalled()

        instance.componentWillUnmount()
        expect(
          instance.CarouselImageListRef.current.removeEventListener
        ).toHaveBeenCalledTimes(2)
      })
      it('should not call removeEventListener on CarouselImages if mobile', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          carouselZoom: jest.fn(),
          carouselPan: jest.fn(),
          isMobile: true,
        })
        wrapper.find('.Carousel-images').getElement().ref.current = CarouselRef
        instance.componentWillUnmount()
        expect(
          instance.CarouselImageListRef.current.removeEventListener
        ).not.toHaveBeenCalled()
      })
    })
  })

  describe('@events', () => {
    describe('Hammer double tap', () => {
      it('if desktop should not call carouselZoom', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          showcase: true,
          carouselZoom: jest.fn(),
        })
        instance.CarouselRef = CarouselRef
        wrapper.find('Hammer').simulate('tap')
        expect(instance.props.carouselZoom).not.toHaveBeenCalled()
      })

      it('if mobile and is zoomed out should call carouselZoom with zoom level 2.5', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          showcase: true,
          isMobile: true,
          carouselZoom: jest.fn(),
          carouselPan: jest.fn(),
        })
        instance.CarouselRef = CarouselRef
        expect(instance.props.carouselZoom).not.toHaveBeenCalled()
        wrapper.find('Hammer').simulate('tap')
        expect(instance.props.carouselZoom).toHaveBeenCalledWith(
          instance.props.name,
          2.5
        )
        expect(instance.props.carouselZoom).toHaveBeenCalledTimes(1)
        expect(instance.props.carouselPan).not.toHaveBeenCalled()
      })
      it('if mobile and is zoomed in should call carouselZoom with zoom level 1 and should also call carouselPan', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          showcase: true,
          isMobile: true,
          carouselZoom: jest.fn(),
          carouselPan: jest.fn(),
          carousel: {
            productDetail: {
              ...initProps.carousel.productDetail,
              zoom: 2,
            },
          },
        })
        instance.CarouselRef = CarouselRef
        expect(instance.props.carouselZoom).not.toHaveBeenCalled()
        expect(instance.props.carouselPan).not.toHaveBeenCalled()
        wrapper.find('Hammer').simulate('tap')
        expect(instance.props.carouselZoom).toHaveBeenCalledWith(
          instance.props.name,
          1
        )
        expect(instance.props.carouselZoom).toHaveBeenCalledTimes(1)
        expect(instance.props.carouselPan).toHaveBeenCalledWith(
          instance.props.name,
          0,
          0
        )
        expect(instance.props.carouselPan).toHaveBeenCalledTimes(1)
      })
    })
    describe('Hammer pan', () => {
      const panEventObject = {
        deltaX: 50,
        deltaY: 70,
        isFinal: true,
      }
      let renderedComponent
      beforeEach(() => {
        renderedComponent = renderComponent({
          ...initProps,
          showcase: true,
          isMobile: true,
          carouselPan: jest.fn(),
          carousel: {
            productDetail: {
              ...initProps.carousel.productDetail,
              zoom: 2,
            },
          },
        })
        renderedComponent.instance.originX = 0
        renderedComponent.instance.originY = 0
        renderedComponent.instance.diffX = 150
        renderedComponent.instance.diffY = 150
      })
      it('if mobile and zoomed in then call carouselPan', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.find('Hammer').simulate('pan', panEventObject)
        expect(instance.props.carouselPan).toHaveBeenCalledWith(
          'productDetail',
          50,
          70
        )
        expect(instance.props.carouselPan.mock.calls).toMatchSnapshot()
        expect(instance.originX).toMatchSnapshot()
        expect(instance.originY).toMatchSnapshot()
      })
      it('if mobile and zoomed in then call carouselPan with is final as false', () => {
        const { wrapper, instance } = renderedComponent
        wrapper
          .find('Hammer')
          .simulate('pan', { ...panEventObject, isFinal: false })
        expect(instance.props.carouselPan.mock.calls).toMatchSnapshot()
        expect(instance.originX).toMatchSnapshot()
        expect(instance.originY).toMatchSnapshot()
      })
      it('if mobile and zoomed out then does not call carouselPan', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          showcase: true,
          isMobile: true,
          carouselPan: jest.fn(),
        })
        wrapper.find('Hammer').simulate('pan', panEventObject)
        expect(instance.props.carouselPan).not.toHaveBeenCalled()
      })
    })

    describe('Hammer swipe', () => {
      it('should call handleSwipe', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          showcase: true,
          handleSwipe: jest.fn(),
        })
        expect(instance.props.handleSwipe).not.toHaveBeenCalled()
        wrapper.find('Hammer').simulate('swipe')
        expect(instance.props.handleSwipe).toHaveBeenCalledTimes(1)
      })
    })

    describe('baseControls click', () => {
      let renderedComponent
      const mockFunc = {
        preventDefault: jest.fn(),
        callback: jest.fn(),
      }
      const componentProps = {
        ...initProps,
        forwardCarousel: jest.fn(),
        backCarousel: jest.fn(),
      }
      beforeEach(() => {
        jest.resetAllMocks()
      })

      it('should call handleBackAndForwardClickEvent on left arrow click', () => {
        renderedComponent = renderComponent(componentProps)
        const { wrapper, instance } = renderedComponent
        const setsSpy = jest.spyOn(instance, 'handleBackAndForwardClickEvent')

        wrapper.find('.Carousel-arrow--left').simulate('click', mockFunc)
        wrapper.update()

        expect(setsSpy).toHaveBeenCalledTimes(1)
        expect(setsSpy).toHaveBeenCalledWith(mockFunc, expect.any(Function))
      })

      it('should call handleBackAndForwardClickEvent on right arrow click', () => {
        renderedComponent = renderComponent(componentProps)
        const { wrapper, instance } = renderedComponent
        const setsSpy = jest.spyOn(instance, 'handleBackAndForwardClickEvent')
        wrapper.find('.Carousel-arrow--right').simulate('click', mockFunc)
        wrapper.update()

        expect(setsSpy).toHaveBeenCalledTimes(1)
        expect(setsSpy).toHaveBeenCalledWith(mockFunc, expect.any(Function))
      })
    })

    describe('selector click', () => {
      it('should call setCarouselIndex', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          showcase: true,
          setCarouselIndex: jest.fn(),
        })
        expect(instance.props.setCarouselIndex).not.toHaveBeenCalled()
        wrapper
          .find('.Carousel-selector')
          .at(1)
          .simulate('click')
        expect(instance.props.setCarouselIndex).toHaveBeenCalledTimes(1)
        expect(instance.props.setCarouselIndex).toHaveBeenCalledWith(
          instance.props.name,
          1
        )
      })
    })

    describe('zoomicon click', () => {
      it('should call onClick when zoomicon is clicked', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          enableImageOverlay: true,
          onClick: jest.fn(),
        })
        expect(instance.props.onClick).not.toHaveBeenCalled()
        wrapper.find('.Carousel-zoom').simulate('click')
        expect(instance.props.onClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('CarouselItem click', () => {
      it('should call onClick() with the correct index', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          onClick: jest.fn(),
        })
        expect(instance.props.onClick).not.toHaveBeenCalled()
        wrapper
          .find('.Carousel-item')
          .at(1)
          .simulate('click')
        expect(instance.props.onClick).toHaveBeenCalledTimes(1)
        expect(instance.props.onClick).toHaveBeenCalledWith(1)
      })
    })

    describe('carousel keydown', () => {
      const keyEvent = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      }

      beforeEach(() => {
        jest.resetAllMocks()
      })
      it('should be able to pan when zoomed in', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          forwardCarousel: jest.fn(),
          carouselPan: jest.fn(),
          carouselZoom: jest.fn(),
          isMobile: true,
          carousel: {
            productDetail: {
              ...initProps.carousel.productDetail,
              zoom: 2,
            },
          },
        })
        instance.CarouselRef = CarouselRef
        instance.originX = 0
        instance.originY = 0
        instance.diffX = 150
        instance.diffY = 150
        expect(instance.props.forwardCarousel).not.toHaveBeenCalled()
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.ENTER })
        expect(instance.props.carouselPan).not.toHaveBeenCalled()
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.A })
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.D })
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.W })
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.S })
        expect(instance.props.carouselZoom).not.toHaveBeenCalled()
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.Z })

        expect(instance.props.forwardCarousel.mock.calls).toMatchSnapshot()
        expect(instance.props.carouselZoom.mock.calls).toMatchSnapshot()
        expect(instance.props.carouselPan.mock.calls).toMatchSnapshot()
        expect(keyEvent.preventDefault.mock.calls).toMatchSnapshot()
        expect(keyEvent.stopPropagation.mock.calls).toMatchSnapshot()
      })
      it('should be able to pan when not zoomed in', () => {
        const { wrapper, instance } = renderComponent({
          ...initProps,
          forwardCarousel: jest.fn(),
          backCarousel: jest.fn(),
          carouselPan: jest.fn(),
          carouselZoom: jest.fn(),
          isMobile: true,
        })
        instance.CarouselRef = CarouselRef

        expect(instance.props.forwardCarousel).not.toHaveBeenCalled()
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.ENTER })
        expect(instance.props.forwardCarousel).toHaveBeenCalledTimes(1)
        expect(instance.props.forwardCarousel).toHaveBeenCalledWith(
          instance.props.name
        )

        expect(instance.props.backCarousel).not.toHaveBeenCalled()
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.A })
        expect(instance.props.backCarousel).toHaveBeenLastCalledWith(
          instance.props.name
        )
        expect(instance.props.backCarousel).toHaveBeenCalledTimes(1)

        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.D })
        expect(instance.props.forwardCarousel).toHaveBeenCalledTimes(2)
        expect(instance.props.forwardCarousel).toHaveBeenLastCalledWith(
          instance.props.name
        )

        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.W })
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.S })
        wrapper.simulate('keydown', { ...keyEvent, keyCode: KEYS.Z })
        expect(instance.props.carouselZoom).toHaveBeenCalledTimes(1)
        expect(instance.props.carouselZoom).toHaveBeenLastCalledWith(
          instance.props.name,
          2.5
        )

        expect(instance.props.carouselPan).not.toHaveBeenCalled()

        expect(keyEvent.preventDefault.mock.calls).toMatchSnapshot()
        expect(keyEvent.stopPropagation.mock.calls).toMatchSnapshot()
      })
    })
  })
})
