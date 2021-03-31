import React from 'react'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import ShoppingBag from '../ShoppingBag'
import testComponentHelper from 'test/unit/helpers/test-component'
import OrderProducts from '../../OrderProducts/OrderProducts'
import SandBox from '../../../containers/SandBox/SandBox'
import QubitReact from 'qubit-react/wrapper'

const renderComponent = testComponentHelper(
  ShoppingBag.WrappedComponent.WrappedComponent
)

describe('<ShoppingBag />', () => {
  describe('Connected component', () => {
    it('should receive the correct props', () => {
      const initialState = {
        routing: {
          location: {
            pathname: '/checkout',
          },
        },
        features: {
          status: {
            FEATURE_BAG_SHOWS_DISCOUNT_TEXT: true,
          },
        },
      }

      const ShoppingBagComponent = ShoppingBag.WrappedComponent
      const container = shallow(
        <ShoppingBagComponent store={configureStore()(initialState)} />
      )

      expect(container).toBeTruthy()
      expect(container.prop('inCheckout')).toBe(true)
    })
  })

  describe('Render', () => {
    it('should match snapshot', () => {
      const props = {
        className: 'class',
        bagProducts: [],
        scrollMinibag: () => {},
        inCheckout: false,
      }

      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('renders OrderProducts', () => {
      const props = {
        className: 'class',
        bagProducts: [],
        scrollMinibag: () => {},
        inCheckout: false,
      }
      const { wrapper } = renderComponent(props)
      const OrderProductsComponent = wrapper.find(OrderProducts)
      expect(OrderProductsComponent).toHaveLength(1)
      expect(OrderProductsComponent.prop('allowMoveToWishlist')).toEqual(true)
    })

    it('renders SandBox when not in checkout, on a mobile', () => {
      const props = {
        bagProducts: [],
        scrollMinibag: () => {},
        inCheckout: false,
        isMobile: true,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(SandBox)).toHaveLength(1)
    })

    it('does not render SandBox when on desktop', () => {
      const props = {
        bagProducts: [],
        scrollMinibag: () => {},
        inCheckout: true,
        isMobile: false,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(SandBox)).toHaveLength(0)
    })

    it('does not render SandBox when in checkout', () => {
      const props = {
        bagProducts: [],
        scrollMinibag: () => {},
        isMobile: true,
        inCheckout: true,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(SandBox)).toHaveLength(0)
    })
    describe('@qubit', () => {
      const props = {
        className: 'class',
        bagProducts: [],
        scrollMinibag: () => {},
        inCheckout: false,
      }
      const { wrapper } = renderComponent(props)
      const qubitWrapper = wrapper.find(QubitReact)
      it('should render a qubit react wrapper for espot with correct id', () => {
        expect(qubitWrapper.at(0).props().id).toBe(
          'qubit-minibag-shopping-bag-espot'
        )
      })
    })
  })
})
