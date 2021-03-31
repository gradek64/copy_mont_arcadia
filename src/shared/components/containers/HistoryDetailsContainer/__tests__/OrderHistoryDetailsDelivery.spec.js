import testComponentHelper from 'test/unit/helpers/test-component'
import OrderHistoryDetailsDelivery from '../OrderHistoryDetailsDelivery'

describe('<OrderHistoryDetailsDelivery />', () => {
  const renderComponent = testComponentHelper(OrderHistoryDetailsDelivery)
  const initialProps = {}

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with deliveryMethod', () => {
      expect(
        renderComponent({
          ...initialProps,
          deliveryMethod: 'Collect from Store',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with deliveryCarrier', () => {
      expect(
        renderComponent({
          ...initialProps,
          deliveryCarrier: 'Carrier',
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
