import testComponentHelper from 'test/unit/helpers/test-component'
import OrderCompleteBasket from '../OrderCompleteBasket'
import SimpleTotals from '../../SimpleTotals/SimpleTotals'
import OrderProducts from '../../OrderProducts/OrderProducts'

const initialProps = {
  discountInfo: [],
  orderCompleted: {
    deliveryMethod: 'Standard UK Delivery',
    deliveryCost: '2.99',
    deliveryPrice: '3.00',
  },
  orderSubtotal: '18.00',
  isDDPStandaloneOrderCompleted: false,
  isMobile: false,
}

describe('<OrderCompleteBasket />', () => {
  const renderComponent = testComponentHelper(OrderCompleteBasket)
  const component = renderComponent(initialProps)
  const { wrapper } = component

  describe('@render', () => {
    describe('Desktop', () => {
      it('should match desktop', () => {
        expect(component.getTree()).toMatchSnapshot()
      })
      it('should show checkout bag on the side', () => {
        expect(wrapper.find('.OrderCompleteBasket-myBag').exists()).toBeTruthy()
      })
    })
    describe('Mobile', () => {
      describe('We have a `deliveryCost` prop', () => {
        const component = renderComponent({
          ...initialProps,
          isMobile: true,
        })
        const { wrapper } = component

        it('should match mobile', () => {
          expect(component.getTree()).toMatchSnapshot()
        })
        it('should show header and rest of components', () => {
          expect(
            wrapper.find('.OrderCompleteBasket-subheader').exists()
          ).toBeTruthy()
          expect(wrapper.find(OrderProducts).exists()).toBeTruthy()
          expect(wrapper.find(SimpleTotals).exists()).toBeTruthy()
        })
      })

      describe('`deliveryCost` prop is undefined', () => {
        const { deliveryPrice } = initialProps.orderCompleted
        const component = renderComponent({
          ...initialProps,
          isMobile: true,
          orderCompleted: {
            ...initialProps.orderCompleted,
            deliveryCost: undefined,
          },
          orderSubtotal: '18.01',
        })
        const { wrapper } = component
        it('`deliveryPrice` should be passed down instead', () => {
          expect(component.getTree()).toMatchSnapshot()
          expect(wrapper.find(SimpleTotals).props().shippingInfo.cost).toBe(
            deliveryPrice
          )
        })
      })
    })
  })
})
