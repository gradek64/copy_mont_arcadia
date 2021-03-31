import testComponentHelper from 'test/unit/helpers/test-component'
import CarouselPanel from '../CarouselPanel'
import React from 'react'
import { path } from 'ramda'

describe('@<CarouselPanel />', () => {
  const initialProps = {
    name: 'miniProductCarousel0',
    carousel: {
      miniProductCarousel0: {
        direction: 'right',
        previous: -1,
        current: 0,
        max: 6,
        zoom: 1,
        panX: 0,
        panY: 0,
        currentItemReference: undefined,
        initialIndex: 0,
      },
    },
    assets: [<div />, <div />, <div />],
    touchEnabled: false,
    backCarousel: jest.fn(),
    forwardCarousel: jest.fn(),
    className: 'Carousel--panel',
  }

  const renderComponent = testComponentHelper(CarouselPanel)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('`null` if `initialProps.name` is not found in `initialProps.carousel`', () => {
      expect(
        renderComponent({
          ...initialProps,
          carousel: {},
        }).getTree()
      ).toBe('')
    })
    it('renders with correct `Carousel--panel` class', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.hasClass('Carousel--panel')).toBe(true)
    })
    it('first Carousel-item should have is-selected class', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(
        wrapper
          .find('.Carousel-item')
          .at(0)
          .hasClass('is-selected')
      ).toBe(true)
    })
    it('controls do not render when `assets` prop is empty array', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        assets: [],
      })
      expect(wrapper.find('.Carousel-arrow--left').length).toBe(0)
      expect(wrapper.find('.Carousel-arrow--right').length).toBe(0)
    })

    it('should adjust the initial carousel image according to the initial index', () => {
      expect(
        renderComponent({
          ...initialProps,
          carousel: {
            ...initialProps.carousel,
            miniProductCarousel0: {
              ...initialProps.carousel.miniProductCarousel0,
              initialIndex: 2,
            },
          },
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('baseControls click', () => {
      let renderedComponent

      beforeEach(() => {
        renderedComponent = renderComponent(initialProps)
        jest.resetAllMocks()
      })
      it('should call `backCarousel` on left arrow click', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.backCarousel).not.toHaveBeenCalled()
        wrapper.find('.Carousel-arrow--left').simulate('click')
        expect(instance.props.backCarousel).toHaveBeenCalledTimes(1)
        expect(instance.props.backCarousel).toHaveBeenCalledWith(
          instance.props.name
        )
      })
      it('should call `forwardCarousel` on right arrow click', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.forwardCarousel).not.toHaveBeenCalled()
        wrapper.find('.Carousel-arrow--right').simulate('click')
        expect(instance.props.forwardCarousel).toHaveBeenCalledTimes(1)
        expect(instance.props.forwardCarousel).toHaveBeenCalledWith(
          instance.props.name
        )
      })
    })
    describe('Hammer swipe', () => {
      it('should call `handleSwipe`', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          handleSwipe: jest.fn(),
        })
        expect(instance.props.handleSwipe).not.toHaveBeenCalled()
        wrapper.find('Hammer').simulate('swipe')
        expect(instance.props.handleSwipe).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      it('should call `setCurrentItemReference` should be called once with correct args', () => {
        const { instance } = renderComponent({
          ...initialProps,
          setCurrentItemReference: jest.fn(),
          currentItemReferencePath: path(['props', 'productId']),
          assets: [
            <div productId={123} />,
            <div productId={234} />,
            <div productId={345} />,
          ],
        })
        expect(instance.props.setCurrentItemReference).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.setCurrentItemReference).toHaveBeenCalledTimes(1)
        expect(instance.props.setCurrentItemReference).toHaveBeenCalledWith(
          instance.props.name,
          instance.props.assets[0].props.productId
        )
      })

      it('setCurrentItemReference` should not be called if `currentItemReferencePath` is falsey', () => {
        const { instance } = renderComponent({
          ...initialProps,
          setCurrentItemReference: jest.fn(),
          currentItemReferencePath: null,
        })
        instance.componentDidMount()
        expect(instance.props.setCurrentItemReference).not.toHaveBeenCalled()
      })

      it('currentItemReferencePath` should called once with correct args', () => {
        const { instance } = renderComponent({
          ...initialProps,
          setCurrentItemReference: jest.fn(),
          currentItemReferencePath: jest.fn(),
          assets: [
            <div productId={123} />,
            <div productId={234} />,
            <div productId={345} />,
          ],
        })
        expect(instance.props.currentItemReferencePath).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.currentItemReferencePath).toHaveBeenCalledTimes(1)
        expect(instance.props.currentItemReferencePath).toHaveBeenCalledWith(
          instance.props.assets[0]
        )
        expect(
          instance.props.currentItemReferencePath
        ).not.toHaveBeenCalledWith(instance.props.assets[1])
      })
    })

    describe('@UNSAFE_componentWillReceiveProps', () => {
      it('should call `setCurrentItemReference` should be called once with correct args', () => {
        const { instance } = renderComponent({
          ...initialProps,
          setCurrentItemReference: jest.fn(),
          currentItemReferencePath: path(['props', 'productId']),
          assets: [
            <div productId={123} />,
            <div productId={234} />,
            <div productId={345} />,
          ],
        })

        expect(instance.props.setCurrentItemReference).not.toHaveBeenCalled()

        const nextProps = {
          ...initialProps,
          carousel: {
            miniProductCarousel0: {
              direction: 'right',
              previous: 0,
              current: 1,
              max: 6,
              zoom: 1,
              panX: 0,
              panY: 0,
              currentItemReference: instance.props.assets[0].props.productId,
            },
          },
          assets: [
            <div productId={123} />,
            <div productId={234} />,
            <div productId={345} />,
          ],
        }

        instance.UNSAFE_componentWillReceiveProps(nextProps)

        expect(instance.props.setCurrentItemReference).toHaveBeenCalledTimes(1)
        expect(instance.props.setCurrentItemReference).toHaveBeenCalledWith(
          instance.props.name,
          instance.props.assets[1].props.productId
        )
      })
    })

    it('setCurrentItemReference` should not be called if `nextIndex !== currentIndex` is false', () => {
      const { instance } = renderComponent({
        ...initialProps,
        setCurrentItemReference: jest.fn(),
      })

      const nextProps = {
        ...initialProps,
      }

      instance.UNSAFE_componentWillReceiveProps(nextProps)

      expect(instance.props.setCurrentItemReference).not.toHaveBeenCalled()
    })
  })
})
