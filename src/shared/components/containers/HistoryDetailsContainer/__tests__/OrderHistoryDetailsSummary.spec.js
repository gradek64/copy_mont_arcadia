import testComponentHelper from 'test/unit/helpers/test-component'
import OrderHistoryDetailsSummary from '../OrderHistoryDetailsSummary'

describe('<OrderHistoryDetailsSummary />', () => {
  const renderComponent = testComponentHelper(OrderHistoryDetailsSummary)
  const initialProps = {}

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with deliveryPrice', () => {
      expect(
        renderComponent({
          ...initialProps,
          deliveryPrice: '4.00',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with totalOrderPrice', () => {
      expect(
        renderComponent({
          ...initialProps,
          totalOrderPrice: '25.00',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with totalOrderPrice and deliveryPrice', () => {
      expect(
        renderComponent({
          ...initialProps,
          totalOrderPrice: '25.00',
          deliveryPrice: '4.00',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('should not display the deliveryPrice if it is a DDP Order', () => {
      expect(
        renderComponent({
          ...initialProps,
          isDDPOrder: true,
          totalOrderPrice: '25.00',
          deliveryPrice: '4.00',
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
