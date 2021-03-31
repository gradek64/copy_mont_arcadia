import OrderListTagline from '../OrderListTagline'
import testComponentHelper from 'test/unit/helpers/test-component'

describe('OrderListTagline', () => {
  const renderComponent = testComponentHelper(OrderListTagline)
  const initialProps = {
    tagline: 'I am the coolest tag line',
  }

  it('should render a tagline', () => {
    const { wrapper } = renderComponent({
      ...initialProps,
    })
    expect(wrapper.text()).toEqual(initialProps.tagline)
  })
})
