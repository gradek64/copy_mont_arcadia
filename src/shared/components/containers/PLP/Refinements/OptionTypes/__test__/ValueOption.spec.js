import testComponentHelper from 'test/unit/helpers/test-component'
import ValueOption from '../ValueOption'
import { browserHistory } from 'react-router'

jest.mock('../../../../../../analytics/tracking/site-interactions', () => ({
  analyticsPlpClickEvent: jest.fn(),
}))

describe('<ValueOption />', () => {
  const initialProps = {
    options: [
      {
        count: 3122,
        label: '34',
        seoUrl: '/test-url',
        type: 'VALUE',
        value: '34',
      },
      {
        count: 3123,
        label: '38',
        seoUrl: '/test-url',
        type: 'VALUE',
        value: '38',
        selectedFlag: true,
      },
    ],
    selections: [],
    isMobile: false,
    onChange: jest.fn(),
    type: 'valueType',
    refinement: 'waist size',
    updateRefinements: jest.fn(),
    sendAnalyticsFilterUsedEvent: jest.fn(),
    canonicalUrl: 'en/tsuk/category/',
  }

  const renderComponent = testComponentHelper(ValueOption.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('does not render value options if options is an empty array', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        options: [],
      })
      expect(wrapper.find('.ValueOption-link').length).toBe(0)
      expect(wrapper.find('.ValueOption-item').length).toBe(0)
      expect(wrapper.find('.ValueOption-checkbox').length).toBe(0)
    })

    it('does not render value option if an empty object', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        options: [
          {},
          {
            count: 3122,
            label: '34',
            seoUrl: '/test-url',
            type: 'VALUE',
            value: '34',
          },
          {
            count: 3122,
            label: '34',
            seoUrl: '/test-url',
            type: 'VALUE',
            value: '34',
          },
        ],
      })
      expect(wrapper.find('.ValueOption-link').length).toBe(2)
    })

    it('wraps filters with anchors', () => {
      const seoUrl = 'en/tsuk/category/product/seo/url'
      const { wrapper } = renderComponent({
        ...initialProps,
        options: [
          {
            count: 3122,
            label: '34',
            seoUrl,
            type: 'VALUE',
            value: '34',
          },
        ],
      })
      const anchor = wrapper.find('.ValueOption-link')
      expect(anchor.length).toBe(1)
      expect(anchor.first().prop('href')).toBe(seoUrl)
    })

    it('should not display the count within the link tag', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      const anchor = wrapper.find('.ValueOption-link')
      expect(anchor.find('ValueOption-count').exists()).toBe(false)
    })

    describe('isMobile is truthy', () => {
      const props = {
        ...initialProps,
        selections: ['38'],
        isMobile: true,
      }
      it('renders .ValueOption-item when isMobile is truthy', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find('.ValueOption-item').length).toBe(2)
        expect(wrapper.find('.ValueOption-checkbox').length).toBe(0)
      })
      it('.ValueOption-item has .is-selected class when `is-selected` is true', () => {
        const { wrapper } = renderComponent(props)
        expect(
          wrapper
            .find('.ValueOption-item')
            .at(1)
            .hasClass('is-selected')
        ).toBe(true)
      })

      it('should not display the count within the link tag', () => {
        const { wrapper } = renderComponent({
          ...props,
        })
        const anchor = wrapper.find('.ValueOption-link')
        expect(anchor.find('ValueOption-count').exists()).toBe(false)
      })
    })

    describe('isMobile is falsy', () => {
      it('renders .SizeOption-checkbox when isMobile is falsy', () => {
        const { wrapper } = renderComponent({ ...initialProps })
        expect(wrapper.find('.ValueOption-item').length).toBe(0)
        expect(wrapper.find('.ValueOption-checkbox').length).toBe(2)
      })
    })
  })

  describe('@events', () => {
    describe('isMobile is truthy', () => {
      it('prevents default on seo anchor click on mobile', () => {
        const preventDefault = jest.fn()
        const { wrapper } = renderComponent({ ...initialProps, isMobile: true })
        const anchor = wrapper.find('.ValueOption-link')
        expect(anchor.length).toBe(2)

        const e = { preventDefault }
        anchor.first().simulate('click', e)
        expect(preventDefault).toHaveBeenCalledTimes(1)
      })

      it('does not prevent default on seo anchor click on tablet / desktop', () => {
        const preventDefault = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          isMobile: false,
        })
        const anchor = wrapper.find('.ValueOption-link')
        expect(anchor.length).toBe(2)

        const e = { preventDefault }
        anchor.first().simulate('click', e)
        expect(preventDefault).toHaveBeenCalledTimes(0)
      })
    })

    describe('isMobile is falsey', () => {
      beforeEach(() => {
        jest.resetAllMocks()
      })

      it('should update browser url with new seoUrl', () => {
        const browserHistoryPushSpy = jest
          .spyOn(browserHistory, 'push')
          .mockImplementation(() => {})
        const props = {
          ...initialProps,
          isMobile: false,
          refinement: 'Colour',
          isValueSelected: jest.fn(() => true),
        }

        const { instance } = renderComponent(props)

        instance.onChange(
          'Colour',
          'Blue',
          '/en/tsuk/category/clothing-427/dresses-442/blue/N-85cZdepZdgl?Nrpp=24&siteId=%2F12556'
        )
        expect(browserHistoryPushSpy).toHaveBeenCalledTimes(1)
        expect(
          instance.props.sendAnalyticsFilterUsedEvent
        ).toHaveBeenCalledTimes(1)
      })

      it('should call updateRefinements when isMobile is true', () => {
        const props = {
          ...initialProps,
          isMobile: true,
          refinement: 'Colour',
          isValueSelected: jest.fn(() => true),
        }

        const { instance } = renderComponent(props)

        instance.onChange(
          'Colour',
          'Blue',
          '/en/tsuk/category/clothing-427/dresses-442/blue/N-85cZdepZdgl?Nrpp=24&siteId=%2F12556'
        )
        expect(instance.props.updateRefinements).toHaveBeenCalledTimes(1)
      })
      it('should call sendAnalyticsFilterUsedEvent when APPLY a filter', () => {
        const props = {
          ...initialProps,
          isMobile: false,
          refinement: 'Colour',
          isValueSelected: jest.fn(() => false),
        }

        const { instance } = renderComponent(props)

        instance.onChange(
          'Color',
          'Blue',
          '/en/tsuk/category/clothing-427/dresses-442/blue/N-85cZdepZdgl?Nrpp=24&siteId=%2F12556'
        )
        expect(
          instance.props.sendAnalyticsFilterUsedEvent
        ).toHaveBeenCalledTimes(1)
        expect(instance.props.sendAnalyticsFilterUsedEvent).toBeCalledWith({
          filterCategory: 'Color',
          filterOption: 'Blue',
          filterAction: 'apply',
        })
      })
      it('should call sendAnalyticsFilterUsedEvent when REMOVE a filter', () => {
        const props = {
          ...initialProps,
          isMobile: false,
          refinement: 'Colour',
          isValueSelected: jest.fn(() => true),
        }

        const { instance } = renderComponent(props)

        instance.onChange(
          'Color',
          'Blue',
          '/en/tsuk/category/clothing-427/dresses-442/blue/N-85cZdepZdgl?Nrpp=24&siteId=%2F12556'
        )
        expect(
          instance.props.sendAnalyticsFilterUsedEvent
        ).toHaveBeenCalledTimes(1)
        expect(instance.props.sendAnalyticsFilterUsedEvent).toBeCalledWith({
          filterCategory: 'Color',
          filterOption: 'Blue',
          filterAction: 'remove',
        })
      })
    })

    describe('@Methods', () => {
      describe('getCheckoutName()', () => {
        const { instance } = renderComponent(initialProps)
        it('should create a unique name if refinement is a string value', () => {
          const refinement = 'waist size'
          const label = '36'
          const expected = 'waistsize-36'
          expect(instance.getCheckoutName(refinement, label)).toEqual(expected)
        })

        it('should return a name if refinement is an object value', () => {
          const refinement = { name: 'waist size' }
          const label = '36'
          const expected = '36'
          expect(instance.getCheckoutName(refinement, label)).toEqual(expected)
        })
      })
    })
  })
})
