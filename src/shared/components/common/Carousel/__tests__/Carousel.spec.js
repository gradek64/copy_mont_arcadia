import React from 'react'
import { shallow } from 'enzyme'
import Carousel from 'src/shared/components/common/Carousel/Carousel'
import CarouselNormal from 'src/shared/components/common/Carousel/CarouselNormal'
import ImageOverlay from '../../../common/ImageOverlay/ImageOverlay'
import { GTM_ACTION, GTM_CATEGORY } from '../../../../analytics'

import testComponentHelper, {
  buildComponentRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'

import { compose } from 'ramda'

const key = 'testCarousel'
const storeState = {
  config: {
    brandName: 'Topshop',
    brandCode: 'tsuk',
  },
  viewport: { media: 'mobile' },
  carousel: {
    [key]: { current: 0, max: 8, zoom: 1 },
  },
  features: {
    status: {
      FEATURE_PRODUCT_CAROUSEL_THUMBNAIL: false,
      FEATURE_USE_AMPLIENCE: false,
    },
  },
}

const render = buildComponentRender(
  compose(
    mountRender,
    withStore(storeState)
  ),
  Carousel
)

const shallowRender = testComponentHelper(Carousel.WrappedComponent, {
  disableLifecycleMethods: false,
})

describe('<Carousel/>', () => {
  const mountOptions = { context: { l: jest.fn() } }

  let props
  beforeEach(() => {
    jest.resetAllMocks()

    props = {
      name: key,
      enableImageOverlay: false,
      isFeatureCarouselThumbnailEnabled: false,
      showModal: jest.fn(),
      initCarousel: jest.fn(),
      carouselZoom: () => {},
      carouselPan: () => {},
      backCarousel: () => {},
      forwardCarousel: () => {},
      resetTapMessage: () => {},
      assets: [
        {
          assetType: 'IMAGE_LARGE',
          index: 0,
          url:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_normal.jpg',
        },
        {
          assetType: 'IMAGE_LARGE',
          index: 1,
          url:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_large.jpg',
        },
        {
          assetType: 'IMAGE_LARGE',
          index: 20,
          url:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_2_small.jpg',
        },
        {
          assetType: 'IMAGE_LARGE',
          index: 21,
          url:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_large_2.jpg',
        },
        {
          assetType: 'IMAGE_LARGE',
          index: 22,
          url:
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_large_3.jpg',
        },
      ],
      media: 'mobile',
      sendAnalyticsClickEvent: () => {},
    }
  })

  describe('render', () => {
    it('with correct items', () => {
      const { wrapper } = render(props)

      const carousel = wrapper.find('.Carousel')
      expect(carousel.length).toBe(1)

      expect(carousel.find('.Carousel-images').length).toBe(1)
      expect(carousel.find('.Carousel-list').length).toBe(1)
      expect(carousel.find('.Carousel-item').length).toBe(props.assets.length)
    })

    it('with arrows', () => {
      const { wrapper } = render(props)
      expect(
        wrapper.find('.Carousel-arrow--left').hasClass('is-hidden')
      ).toBeFalsy()
      expect(
        wrapper.find('.Carousel-arrow--right').hasClass('is-hidden')
      ).toBeFalsy()
    })

    it('without arrows', () => {
      props.assets = props.assets.slice(0, 1)
      const { wrapper } = render(props)
      expect(wrapper.find('.Carousel-arrow--left').length).toBe(0)
      expect(wrapper.find('.Carousel-arrow--right').length).toBe(0)
    })

    it('with name', () => {
      const { wrapper } = render({ ...props, name: 'testCarousel' })
      expect(wrapper.find(CarouselNormal).prop('name')).toEqual('testCarousel')
    })

    it('with showZoomIcon', () => {
      const { wrapper } = render({ ...props, enableImageOverlay: true })
      expect(
        wrapper.find(CarouselNormal).prop('enableImageOverlay')
      ).toBeTruthy()
    })

    it('with correct number of selectors', () => {
      const { wrapper } = render(props)
      expect(wrapper.find('.Carousel-selector').length).toBe(
        props.assets.length
      )
    })

    it('with amplience assets and image sizes', () => {
      const amplienceImages = ['ampliance 1', 'amplience 2']
      const sizes = {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      }
      const carouselName = 'carouselName'

      const wrapper = shallow(
        <Carousel.WrappedComponent
          {...props}
          isMobile={false}
          enableImageOverlay
          carousel={{ carouselName }}
          name={carouselName}
          amplienceImages={amplienceImages}
          sizes={sizes}
        />,
        mountOptions
      )

      const carousel = wrapper.find(CarouselNormal)
      expect(carousel).toHaveLength(1)
      expect(carousel.prop('amplienceImages')).toBe(amplienceImages)
      expect(carousel.prop('sizes')).toBe(sizes)
    })
  })

  describe('lifecyle', () => {
    describe('componentDidMount', () => {
      it('should initiate a carousel if the assets are available', () => {
        const initCarousel = jest.fn()
        const name = 'test'
        const initialIndex = 4
        const assets = [
          {
            assetType: 'IMAGE_LARGE',
            index: 0,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_normal.jpg',
          },
        ]

        shallowRender({
          name,
          assets,
          initialIndex,
          carousel: {},
          initCarousel,
        })

        expect(initCarousel).toHaveBeenCalledWith(
          name,
          assets.length,
          initialIndex
        )
      })

      it('should not initiate a carousel if assets are not available', () => {
        const initCarousel = jest.fn()
        const name = 'test'
        const initialIndex = 4
        const assets = null

        shallowRender({
          name,
          assets,
          initialIndex,
          carousel: {},
          initCarousel,
        })

        expect(initCarousel).not.toHaveBeenCalled()
      })
    })

    describe('UNSAFE_componentWillReceiveProps', () => {
      it('should re-init the carousel state if the product id changes', () => {
        const initCarousel = jest.fn()
        const name = 'test'
        const assets = []
        const initialIndex = 4

        const { wrapper } = shallowRender({
          name,
          assets,
          initialIndex,
          carousel: {},
          initCarousel,
          productId: 1,
        })

        expect(initCarousel).toHaveBeenCalledTimes(1)

        // Arguments don't change so change the name
        // to differentiate the assertions
        const newName = 'newName'
        wrapper.setProps({
          productId: 2,
          name: newName,
        })

        expect(initCarousel).toHaveBeenCalledTimes(2)
        expect(initCarousel).toHaveBeenCalledWith(
          newName,
          assets.length,
          initialIndex
        )
      })

      it('should not re-init the carousel state if the product id does not change', () => {
        const initCarousel = jest.fn()

        const { wrapper } = shallowRender({
          name: 'test',
          assets: [],
          initialIndex: 4,
          carousel: {},
          initCarousel,
          productId: 1,
        })

        expect(initCarousel).toHaveBeenCalledTimes(1)

        wrapper.setProps({
          productId: 1,
        })

        expect(initCarousel).toHaveBeenCalledTimes(1)
      })
      it('should re-init the carousel state if the product assets change', () => {
        const initCarousel = jest.fn()
        const name = 'test'
        const assets = []
        const initialIndex = 4

        const { wrapper } = shallowRender({
          name,
          assets,
          initialIndex,
          carousel: {},
          initCarousel,
          productId: 1,
        })

        expect(initCarousel).toHaveBeenCalledTimes(1)

        // Arguments don't change so change the name
        // to differentiate the assertions
        const newAssets = ['http://jose']
        wrapper.setProps({
          productId: 1,
          assets: newAssets,
        })

        expect(initCarousel).toHaveBeenCalledTimes(2)
        expect(initCarousel).toHaveBeenCalledWith(
          name,
          assets.length,
          initialIndex
        )
      })
    })
  })

  it('clicks are working', () => {
    const { wrapper, store } = render(props)
    const arrowLeft = wrapper.find('.Carousel-arrow--left')
    const arrowRight = wrapper.find('.Carousel-arrow--right')

    expect(store.getActions()).not.toContainEqual({
      type: 'FORWARD_CAROUSEL',
      key,
    })

    setTimeout(() => {
      arrowRight.simulate('click')
      expect(store.getActions()).toContainEqual({
        type: 'FORWARD_CAROUSEL',
        key,
      })
      arrowLeft.simulate('click')
      expect(store.getActions()).toContainEqual({ type: 'BACK_CAROUSEL', key })
    }, 0)
  })

  it('with arrowColor overriding color of the arrow', () => {
    props.arrowColor = '#ff0'
    const { wrapper } = render(props)

    const arrowLeft = wrapper.find('.Carousel-arrow--left')
    const arrowRight = wrapper.find('.Carousel-arrow--right')

    expect(arrowLeft.html()).toEqual(
      expect.stringContaining('style="background-color: rgb(255, 255, 0);"')
    )
    expect(arrowRight.html()).toEqual(
      expect.stringContaining('style="background-color: rgb(255, 255, 0);"')
    )
  })

  describe('Common carousel functionality', () => {
    ;[
      [
        'Flat carousel',
        {
          mode: 'flat',
          className: 'Carousel--flat',
          prevArrowSelector: '.Carousel-arrow--left',
          nextArrowSelector: '.Carousel-arrow--right',
        },
      ],
      [
        'Thumbnail carousel',
        {
          mode: 'thumbnail',
          className: 'Carousel--thumbnail',
          prevArrowSelector: '.Carousel-arrow--top',
          nextArrowSelector: '.Carousel-arrow--bottom',
        },
      ],
    ].forEach(
      ([
        carouselDescription,
        { mode, className, prevArrowSelector, nextArrowSelector },
      ]) => {
        describe(carouselDescription, () => {
          it('exists', () => {
            const { wrapper } = render({ ...props, mode })
            expect(wrapper.find('.Carousel').hasClass(className)).toBe(true)
            expect(wrapper.find('.Carousel-item').length).toBe(
              props.assets.length
            )
          })

          it('selector click works', () => {
            const { wrapper, store } = render(props)
            const selectors = wrapper.find('.Carousel-selector')

            selectors.last().simulate('click')
            expect(store.getActions()).toContainEqual({
              type: 'SET_CAROUSEL_INDEX',
              key,
              current: props.assets.length - 1,
            })
          })

          it('starts with first image', () => {
            const { wrapper } = render({ ...props, mode })
            expect(
              wrapper
                .find('.Carousel-image')
                .first()
                .prop('src')
            ).toBe(props.assets[0].url)
          })

          it('the `current` index is used as the first image', () => {
            const { wrapper } = render({
              props: {
                ...props,
                mode,
              },
              state: {
                ...storeState,
                carousel: { [key]: { current: 2, max: 3 } },
              },
            })
            const node = wrapper.find('.Carousel-image').first()

            expect(node.prop('src')).toContain(props.assets[2].url.slice(5))
          })

          it('supports nodes', () => {
            const { wrapper } = render({
              ...props,
              mode,
              assets: [<div>works</div>],
            })
            expect(
              wrapper
                .find('.Carousel-item')
                .first()
                .children()
                .html()
            ).toBe('<div>works</div>')
          })

          it('arrows are visible when more than 3 images', () => {
            const { wrapper } = render({ ...props, mode })
            expect(wrapper.find(prevArrowSelector).length).toBe(1)
            expect(wrapper.find(nextArrowSelector).length).toBe(1)
          })

          it('arrows are not visible when 3 or less images', () => {
            const { wrapper } = render({
              ...props,
              mode,
              assets: props.assets.slice(0, 3),
            })
            expect(wrapper.find(prevArrowSelector).length).toBe(0)
            expect(wrapper.find(nextArrowSelector).length).toBe(0)
          })
        })
      }
    )
  })

  describe('Flat Carousel', () => {
    it('images are 25% wide', () => {
      const { wrapper } = render({ ...props, mode: 'flat' })
      expect(wrapper.find('.Carousel-list').prop('style').width).toBe('125%')
    })
  })

  describe('Responsive Carousel', () => {
    it('arrows are visible for responsive carousel', () => {
      const { wrapper } = render({ ...props, media: 'tablet' })
      expect(
        wrapper.find('.Carousel-arrow--left').hasClass('is-hidden')
      ).toBeFalsy()
      expect(
        wrapper.find('.Carousel-arrow--right').hasClass('is-hidden')
      ).toBeFalsy()
    })
  })

  describe('onclick', () => {
    const assets = [
      { assetType: 'IMAGE_LARGE', name: 'image1' },
      { assetType: 'IMAGE_SMALL', name: 'image2' },
    ]
    const initialProps = {
      name: 'carouselName',
      assets,
      imageOverlayAssets: assets,
      carousel: {
        carouselName: {},
      },
      initCarousel: jest.fn(),
      backCarousel: jest.fn(),
      forwardCarousel: jest.fn(),
      showModal: jest.fn(),
      sendAnalyticsClickEvent: jest.fn(),
    }

    it('should call showModal when isMobile is false', () => {
      const { showModal, imageOverlayAssets } = initialProps
      const wrapper = shallow(
        <Carousel.WrappedComponent
          {...initialProps}
          isMobile={false}
          enableImageOverlay
        />,
        mountOptions
      )
      expect(showModal).not.toHaveBeenCalled()

      wrapper.find(CarouselNormal).simulate('click')

      expect(showModal).toHaveBeenCalledTimes(1)
      expect(showModal).toHaveBeenLastCalledWith(
        <ImageOverlay
          assets={imageOverlayAssets}
          amplienceImages={[]}
          sourceCarouselName={initialProps.name}
        />,
        { mode: 'imageCarousel' }
      )
    })

    it('should track event when image overlay modal is shown', () => {
      const { sendAnalyticsClickEvent } = initialProps
      const routePath = "/big/ol'/hat"
      const wrapper = shallow(
        <Carousel.WrappedComponent
          {...initialProps}
          isMobile={false}
          enableImageOverlay
          routePath={routePath}
        />,
        mountOptions
      )
      expect(sendAnalyticsClickEvent).not.toHaveBeenCalled()

      wrapper.find(CarouselNormal).simulate('click')

      expect(sendAnalyticsClickEvent).toHaveBeenCalledWith({
        category: GTM_CATEGORY.PDP,
        action: GTM_ACTION.IMAGE_OVERLAY,
        label: routePath,
      })
    })

    it('should call showModal with ampliance URLs', () => {
      const { showModal, imageOverlayAssets } = initialProps
      const amplienceImages = ['ampliance 1', 'ampliance 2', 'ampliance 3']
      const wrapper = shallow(
        <Carousel.WrappedComponent
          {...initialProps}
          isMobile={false}
          enableImageOverlay
          amplienceImages={amplienceImages}
        />,
        mountOptions
      )
      expect(showModal).not.toHaveBeenCalled()

      wrapper.find(CarouselNormal).simulate('click')

      expect(showModal).toHaveBeenCalledTimes(1)
      expect(showModal).toHaveBeenLastCalledWith(
        <ImageOverlay
          assets={imageOverlayAssets}
          amplienceImages={amplienceImages}
          sourceCarouselName={initialProps.name}
        />,
        { mode: 'imageCarousel' }
      )
    })

    it('should not call showModal when isMobile is true', () => {
      const { showModal } = initialProps

      const wrapper = shallow(
        <Carousel.WrappedComponent
          {...initialProps}
          isMobile
          enableImageOverlay
        />,
        mountOptions
      )
      expect(showModal).not.toHaveBeenCalled()

      wrapper.find(CarouselNormal).simulate('click')

      expect(showModal).not.toHaveBeenCalled()
    })
  })
})
