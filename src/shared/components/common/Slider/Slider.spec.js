import { pick } from 'ramda'
import testComponentHelper from 'test/unit/helpers/test-component'
import Slider from './Slider'

describe('<Slider/>', () => {
  const initialProps = {
    minValue: 0,
    maxValue: 100,
    viewportWidth: 320,
    activeRefinements: [],
  }

  const sliderProperties = [
    'slider',
    'iconWidth',
    'height',
    'width',
    'left',
    'offsetAllowance',
    'handlerStartOffset',
    'isHandlerTooFar',
  ]

  const renderComponent = testComponentHelper(Slider.WrappedComponent)

  const iconWidth = 25
  const iconNode = { getBoundingClientRect: () => ({ width: iconWidth }) }
  const sliderNode = {
    getBoundingClientRect: jest.fn(() => ({
      height: 4,
      width: 1000,
      left: 0,
      top: 0,
    })),
  }

  afterEach(() => {
    sliderNode.getBoundingClientRect.mockClear()
    sliderNode.getBoundingClientRect.mockReset()
    sliderNode.getBoundingClientRect.mockImplementation(() => ({
      height: 4,
      width: 1000,
      left: 0,
      top: 0,
    }))
  })

  describe('@constructor', () => {
    it('sets initial state', () => {
      expect(renderComponent(initialProps).instance.state).toMatchSnapshot()
    })

    it('sets initial slider properties', () => {
      expect(
        pick(sliderProperties, renderComponent(initialProps).instance)
      ).toMatchSnapshot()
    })

    it('sets handle press event handlers', () => {
      expect(
        renderComponent(initialProps).instance.onPressEventHandlers
      ).toMatchSnapshot()
    })
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('on componentWillRecieveProps', () => {
      let renderedComponent

      beforeEach(() => {
        renderedComponent = renderComponent(initialProps)
        const { wrapper } = renderedComponent

        wrapper
          .find('.Slider-icon')
          .first()
          .getElement()
          .ref(iconNode)
        wrapper
          .find('.Slider')
          .getElement()
          .ref(sliderNode)
      })

      it('updates all .Slider-handle styles on getBoundingClientRect changes', () => {
        const { wrapper } = renderedComponent
        const getStyleProp = (componentWrapper) =>
          componentWrapper.prop('style')
        const before = wrapper.find('.Slider-handle').map(getStyleProp)

        sliderNode.getBoundingClientRect.mockReturnValueOnce({
          width: 100,
          left: 50,
        })

        /*
         * setProps requires a props object to trigger UNSAFE_componentWillReceiveProps
         */

        wrapper.setProps({})

        const after = wrapper.find('.Slider-handle').map(getStyleProp)
        expect({ before, after }).toMatchSnapshot()
      })

      it('updates only .Slider-label--minHandle renders on minValue changes', () => {
        const { wrapper, getTreeFor } = renderedComponent
        const before = wrapper.find('.Slider-label').map(getTreeFor)

        wrapper.setProps({ minValue: 10 })

        const after = wrapper.find('.Slider-label').map(getTreeFor)
        expect({ before, after }).toMatchSnapshot()
      })

      it('updates only .Slider-label--maxHandle renders on maxValue changes', () => {
        const { wrapper, getTreeFor } = renderedComponent
        const before = wrapper.find('.Slider-label').map(getTreeFor)

        wrapper.setProps({ maxValue: 50 })

        const after = wrapper.find('.Slider-label').map(getTreeFor)
        expect({ before, after }).toMatchSnapshot()
      })
      describe('updating min and max values', () => {
        it('should update minHandle and mixHandle when minValue or maxValue are changing', () => {
          const { instance } = renderedComponent
          expect(instance.state.minHandle).toEqual({
            left: 0,
            value: 0,
          })
          expect(instance.state.maxHandle).toEqual({
            left: 975,
            value: 100,
          })
          instance.UNSAFE_componentWillReceiveProps({
            minValue: 5,
            maxValue: 80,
            viewportWidth: 320,
          })
          expect(instance.state.minHandle).toEqual({
            left: 0,
            value: 5,
          })
          expect(instance.state.maxHandle).toEqual({
            left: 975,
            value: 80,
          })
        })
        it('should set min and max value from selectedOptions if applied', () => {
          const { wrapper, instance } = renderedComponent
          wrapper.setProps({
            refinementIdentifier: 'price',
            selectedOptions: {
              price: [10, 40],
            },
          })
          expect(instance.state.minHandle.value).toBe(10)
          expect(instance.state.maxHandle.value).toBe(40)
        })
      })
      describe('New Filter Prices Slider', () => {
        it('update Min-Max values nad NOT previous active refinements', () => {
          const { instance } = renderComponent({
            ...initialProps,
          })
          instance.slider = {
            getBoundingClientRect: jest.fn(() => ({
              left: 0,
              width: 0,
            })),
          }

          instance.UNSAFE_componentWillReceiveProps({
            minValue: 0,
            maxValue: 100,
            viewportWidth: 320,
            activeRefinements: [
              {
                key: 'TOPSHOP_UK_CATEGORY',
                title: 'Category',
                values: {
                  key: '3496006',
                  label: 'Joni Jeans',
                  seoUrl:
                    '/en/tsuk/category/N-dgl?Nf=nowPrice%7CBTWN+30.0+45.0&Nrpp=24&siteId=%2F12556',
                },
              },
              {
                key: 'NOWPRICE',
                title: 'Price',
                values: [
                  {
                    key: 'NOWPRICE30.045.0',
                    label: '',
                    lowerBound: '30.0',
                    upperBound: '45.0',
                  },
                ],
              },
            ],
          })
          expect(instance.state.minHandle).toMatchObject({ value: 30, left: 0 })
          expect(instance.state.maxHandle).toMatchObject({ value: 45, left: 0 })
        })
        it('should reset the slider if is closed on mobile', () => {
          const { instance } = renderComponent({
            ...initialProps,
            isShown: true,
          })
          instance.slider = {
            getBoundingClientRect: jest.fn(() => ({
              left: 0,
              width: 0,
            })),
          }

          instance.UNSAFE_componentWillReceiveProps({
            minValue: 10,
            maxValue: 100,
            viewportWidth: 320,
            activeRefinements: [],
            isShown: false,
          })
          expect(instance.state.minHandle).toMatchObject({ value: 10, left: 0 })
        })
      })
    })
  })

  describe('@events', () => {
    const currentTarget = {
      getElementsByClassName: jest.fn(() => [
        {
          getBoundingClientRect: jest.fn(() => ({ left: 0 })),
        },
      ]),
    }

    const getMockHandlerPosition = jest.fn(() => ({ pageX: 0, pageY: 0 }))
    // const setMockHandlerPosition = (pageX = 0, pageY = 0) =>
    //  getMockHandlerPosition.mockReturnValueOnce({ pageX, pageY })

    const getEvent = (eventName) =>
      /^touch/.test(eventName)
        ? { currentTarget, changedTouches: [getMockHandlerPosition()] }
        : { currentTarget, ...getMockHandlerPosition() }

    // const assertSliderSnapshot = ({ wrapper, getTreeFor }) => {
    //  expect(getTreeFor(wrapper.find('.Slider'))).toMatchSnapshot()
    // }

    beforeEach(() => {
      currentTarget
        .getElementsByClassName()[0]
        .getBoundingClientRect.mockClear()
      getMockHandlerPosition.mockClear()
    })

    describe('handle press', () => {
      describe('sets active .Slider-handle', () => {
        const getHandler = (wrapper, handlerType) =>
          wrapper.find(`.Slider-handle--${handlerType}`)
        const eventTests = ['touchstart', 'mousedown']

        eventTests.forEach((eventName) => {
          it(`on ${eventName}`, () => {
            const { wrapper } = renderComponent(initialProps)
            const handleTypes = ['minHandle', 'maxHandle']

            handleTypes.forEach((handlerType) => {
              getHandler(wrapper, handlerType).simulate(
                eventName,
                getEvent(eventName)
              )
              expect(
                getHandler(wrapper, handlerType).hasClass('is-active')
              ).toBe(true)
            })
          })
        })
      })

      describe('sets handler start offset', () => {
        const getHandler = (wrapper, handlerType) =>
          wrapper.find(`.Slider-handle--${handlerType}`)
        const eventTests = ['touchstart', 'mousedown']

        eventTests.forEach((eventName) => {
          it(`on ${eventName}`, () => {
            const { wrapper, instance } = renderComponent(initialProps)
            const handleConfigs = [
              {
                type: 'minHandle',
                targetRectLeft: 5,
                handlerPositionX: 15,
                expected: 10,
              },
              {
                type: 'maxHandle',
                targetRectLeft: 20,
                handlerPositionX: 30,
                expected: 10,
              },
            ]

            handleConfigs.forEach(
              ({ type, targetRectLeft, handlerPositionX, expected }) => {
                const event = {
                  currentTarget: {
                    getElementsByClassName: () => [
                      {
                        getBoundingClientRect: () => ({ left: targetRectLeft }),
                      },
                    ],
                  },
                  pageX: handlerPositionX,
                  pageY: 0,
                }
                getHandler(wrapper, type).simulate(eventName, event)
                expect(instance.handlerStartOffset).toBe(expected)
              }
            )
          })
        })
      })
    })

    describe('On Slider movement and release', () => {
      it('onHandleMove', () => {
        const { instance } = renderComponent(initialProps)
        const event = {
          pageX: 15,
          pageY: 0,
        }
        // SetTheHandler
        instance.state.activeHandle = 'minHandle'
        instance.state.maxHandle = { value: 109, left: 150 }
        instance.state.minHandle = { value: 10, left: 0 }
        instance.width = 170
        instance.onHandleMove(event)
        expect(instance.state.minHandle).toMatchObject({
          left: 15.299999999999999,
          value: 9,
        })
      })

      it('onHandleRelease', () => {
        initialProps.onChangeFinished = jest.fn()
        const { instance } = renderComponent(initialProps)
        instance.state.activeHandle = 'minHandle'
        instance.onHandleRelease()
        expect(instance.state.activeHandle).toEqual(null)
        expect(instance.props.onChangeFinished).toHaveBeenCalled()
      })
    })
  })

  describe('@elements', () => {
    it('.Slider updates instance and state on ref', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      const instanceProperties = [...sliderProperties, 'state']
      const before = pick(instanceProperties, instance)

      instance.icon = { getBoundingClientRect: () => ({ width: 10 }) }
      wrapper
        .find('.Slider')
        .getElement()
        .ref(sliderNode)

      const after = pick(instanceProperties, instance)
      expect({ before, after }).toMatchSnapshot()
    })

    it('.Slider-handle sets handle on ref', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      wrapper
        .find('.Slider-handle--minHandle')
        .getElement()
        .ref('min')
      wrapper
        .find('.Slider-handle--maxHandle')
        .getElement()
        .ref('max')
      expect([instance.minHandle, instance.maxHandle]).toEqual(['min', 'max'])
    })

    it('.Slider-icon sets icon on ref', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      wrapper
        .find('.Slider-icon')
        .first()
        .getElement()
        .ref('min')
      expect(instance.icon).toBe('min')
    })
  })
})
