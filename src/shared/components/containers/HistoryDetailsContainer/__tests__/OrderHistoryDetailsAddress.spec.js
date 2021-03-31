import testComponentHelper from 'test/unit/helpers/test-component'
import OrderHistoryDetailsAddress from '../OrderHistoryDetailsAddress'

describe('<OrderHistoryDetailsAddress />', () => {
  const renderComponent = testComponentHelper(OrderHistoryDetailsAddress)
  const address = {
    name: 'Miss Kate',
    address1: 'address1',
    address2: 'address2',
    address3: 'address3',
    address4: 'address4',
    country: 'UK',
  }
  const initialProps = {
    address,
    type: 'shipping',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with className', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'OrderHistoryDetailsAddress--delivery',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with no address', () => {
      expect(
        renderComponent({
          ...initialProps,
          address: undefined,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with address and type shipping and deliveryMethod is "Collect from store" ', () => {
      expect(
        renderComponent({
          ...initialProps,
          address,
          deliveryMethod: 'Collect from store',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with address and type billing', () => {
      expect(
        renderComponent({
          ...initialProps,
          address,
          type: 'billing',
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
