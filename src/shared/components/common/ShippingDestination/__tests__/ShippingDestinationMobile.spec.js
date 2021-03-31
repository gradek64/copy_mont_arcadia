import React from 'react'
import { shallow } from 'enzyme'
import testComponentHelper, {
  buildComponentRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import ShippingDestinationMobile from '../ShippingDestinationMobile'
import TopSectionItemLayout from '../../../containers/TopNavMenu/TopSectionItemLayout'
import { Link } from 'react-router'
import { compose } from 'ramda'
import { updateShippingDestination } from '../../../../actions/common/shippingDestinationActions'
import { analyticsGlobalNavClickEvent } from '../../../../analytics/tracking/site-interactions'

jest.mock('../../../../analytics/tracking/site-interactions')
jest.mock('../../../../actions/common/shippingDestinationActions')

describe('<ShippingDestinationMobile />', () => {
  const defaultProps = {
    language: 'en',
    shippingDestination: 'France',
    toggleTopNavMenu: jest.fn(),
    resetCategoryHistory: jest.fn(),
    clearInfinityPage: jest.fn(),
  }
  const renderComponent = testComponentHelper(
    ShippingDestinationMobile.WrappedComponent
  )
  describe('@renders', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should render in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should call l with change-your-shipping-destination', () => {
      const wrapper = shallow(
        <ShippingDestinationMobile.WrappedComponent {...defaultProps} />,
        {
          context: {
            l: jest.fn().mockImplementation((x) => x),
          },
        }
      )
      expect(wrapper.context().l).toHaveBeenCalledWith(
        'change-your-shipping-destination'
      )
    })

    it('should render the `Link` component', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      expect(wrapper.find(Link)).toHaveLength(1)
    })

    it('should render the `TopSectionItemLayout` component', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      expect(wrapper.find(TopSectionItemLayout)).toHaveLength(1)
    })

    it('should display language code and country name when more than 1 language', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      const topSectionItemLayout = wrapper.find(TopSectionItemLayout)
      expect(topSectionItemLayout.prop('text')).toMatchSnapshot()
    })

    it('should display country name only when only 1 language available', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        shippingDestination: 'United Kingdom',
      })
      const topSectionItemLayout = wrapper.find(TopSectionItemLayout)
      expect(topSectionItemLayout.prop('text')).toMatchSnapshot()
    })

    it('should display "Europe" when shippingDestination is equal to "default"', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        shippingDestination: 'default',
      })
      const topSectionItemLayout = wrapper.find(TopSectionItemLayout)
      expect(topSectionItemLayout.prop('text')).toMatchSnapshot()
    })

    describe('@events', () => {
      beforeEach(jest.clearAllMocks)
      describe('when the Link is clicked', () => {
        it('calls toggleTopNavMenu', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          expect(defaultProps.toggleTopNavMenu).not.toHaveBeenCalled()
          wrapper.find(Link).simulate('click')
          expect(defaultProps.toggleTopNavMenu).toHaveBeenCalledTimes(1)
        })

        it('calls resetCategoryHistory', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          expect(defaultProps.resetCategoryHistory).not.toHaveBeenCalled()
          wrapper.find(Link).simulate('click')
          expect(defaultProps.resetCategoryHistory).toHaveBeenCalled()
        })

        it('calls clearInfinityPage', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          expect(defaultProps.clearInfinityPage).not.toHaveBeenCalled()
          wrapper.find(Link).simulate('click')
          expect(defaultProps.clearInfinityPage).toHaveBeenCalled()
        })

        it('calls analyticsGlobalNavClickEvent', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          expect(analyticsGlobalNavClickEvent).not.toHaveBeenCalled()
          wrapper.find(Link).simulate('click')
          expect(analyticsGlobalNavClickEvent).toHaveBeenCalled()
        })
      })
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      beforeEach(jest.clearAllMocks)
      const state = {
        config: {
          country: 'United Kingdom',
        },
        routing: {
          location: {
            query: {
              currentCountry: 'France',
            },
          },
        },
        shippingDestination: {
          destination: 'Japan',
        },
      }
      const mountComponent = buildComponentRender(
        compose(
          mountRender,
          withStore(state)
        ),
        ShippingDestinationMobile
      )

      it('calls the updateShippingDestination with no arguments', () => {
        updateShippingDestination.mockReturnValue({ type: 'mocked type' })
        mountComponent()
        expect(updateShippingDestination).toHaveBeenCalledTimes(1)
        expect(updateShippingDestination).toHaveBeenCalledWith()
      })
    })
  })
})
