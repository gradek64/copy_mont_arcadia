import testComponentHelper from 'test/unit/helpers/test-component'
import RangeOption from '../RangeOption'
import Slider from '../../../../../common/Slider/Slider'
import { analyticsPlpClickEvent } from '../../../../../../analytics/tracking/site-interactions'
import { browserHistory } from 'react-router'

jest.mock('../../../../../../analytics/tracking/site-interactions', () => ({
  analyticsPlpClickEvent: jest.fn(),
}))

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

describe('<RangeOption />', () => {
  const initialProps = {
    updateOptionRange: jest.fn(),
    onChange: jest.fn(),
    options: [
      {
        maxValue: 100,
        minValue: 0,
      },
    ],
  }

  const renderComponent = testComponentHelper(RangeOption.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('on constructor', () => {
      it('state.reset set to false', () => {
        expect(renderComponent(initialProps).wrapper.state().reset).toBe(false)
      })
    })

    describe('on UNSAFE_componentWillReceiveProps', () => {
      it('state.reset toggles when selections is removed', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          selections: [5, 40],
        })

        expect(
          wrapper
            .find('.RangeOption')
            .first()
            .key()
        ).toBe('false')
        instance.UNSAFE_componentWillReceiveProps(initialProps)
        wrapper.update()
        expect(
          wrapper
            .find('.RangeOption')
            .first()
            .key()
        ).toBe('true')
        instance.UNSAFE_componentWillReceiveProps({
          ...initialProps,
          selections: [10, 60],
        })
        instance.UNSAFE_componentWillReceiveProps(initialProps)
        wrapper.update()
        expect(
          wrapper
            .find('.RangeOption')
            .first()
            .key()
        ).toBe('false')
      })

      it('should return null if props is equal to nextProps', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          instance.UNSAFE_componentWillReceiveProps({
            ...initialProps,
            children: undefined,
          })
        ).toBeNull()
      })
    })

    it('state.reset toggles when selections is empty', () => {
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        selections: [5, 40],
      })

      expect(
        wrapper
          .find('.RangeOption')
          .first()
          .key()
      ).toBe('false')
      instance.UNSAFE_componentWillReceiveProps({
        ...initialProps,
        selections: [],
      })
      wrapper.update()
      expect(
        wrapper
          .find('.RangeOption')
          .first()
          .key()
      ).toBe('true')
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it('onChangeFinished should call updateOptionRange', () => {
      const leftValue = 10
      const rightValue = 20
      const refinement = 'price'
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        refinement,
        updateOptionRange: jest.fn(),
        currentSortOptions: {
          navigationState:
            '/en/tsuk/category/jeans-6877054/slim-jeans-6906608/N-277yZdgl?Nrpp=24&siteId=%2F12556',
        },
      })
      expect(instance.props.updateOptionRange).not.toBeCalled()
      wrapper
        .find(Slider)
        .first()
        .simulate('changeFinished', leftValue, rightValue)
      expect(instance.props.updateOptionRange).toBeCalledWith(refinement, [
        leftValue,
        rightValue,
      ])
      expect(instance.props.updateOptionRange).toHaveBeenCalledTimes(1)
      expect(analyticsPlpClickEvent).toHaveBeenCalledWith(
        `price-${leftValue} to ${rightValue}`
      )
    })
    it('onChangeFinished should update the new url if Desktop view', () => {
      const refinement = 'price'
      const { instance } = renderComponent({
        ...initialProps,
        refinement,
        currentSortOptions: {
          navigationState:
            '/en/tsuk/category/jeans-6877054/joni-jeans-6906608/N-277yZdgl?Nrpp=24&siteId=%2F12556',
        },
        isMobile: false,
        updateOptionRange: jest.fn(),
      })
      instance.onAfterChange('price', [20, 55], undefined)
      expect(browserHistory.push).toHaveBeenCalledTimes(1)
      expect(browserHistory.push).toHaveBeenCalledWith(
        '/en/tsuk/category/jeans-6877054/joni-jeans-6906608/N-277yZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B20%2B55'
      )
    })
    it('onChangeFinished should call the refinementV2 action if Mobile View', () => {
      const refinement = 'price'
      const { instance } = renderComponent({
        ...initialProps,
        refinement,
        currentSortOptions: {
          navigationState:
            '/en/tsuk/category/jeans-6877054/joni-jeans-6906608/N-277yZdgl?Nrpp=24&siteId=%2F12556',
        },
        isMobile: true,
        updateOptionRange: jest.fn(),
        updateRefinements: jest.fn(),
      })
      instance.onAfterChange('price', [20, 55], undefined)
      expect(instance.props.updateRefinements).toHaveBeenCalledTimes(1)
      expect(instance.props.updateRefinements).toHaveBeenCalledWith(
        '/en/tsuk/category/jeans-6877054/joni-jeans-6906608/N-277yZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B20%2B55'
      )
    })
  })
})
