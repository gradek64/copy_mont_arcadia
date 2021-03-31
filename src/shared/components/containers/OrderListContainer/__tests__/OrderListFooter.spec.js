import OrderListFooter from '../OrderListFooter'
import CustomerServiceNumber from '../../../common/CustomerServiceNumber/CustomerServiceNumber'
import testComponentHelper from 'test/unit/helpers/test-component'

describe('OrderListTagline', () => {
  const renderComponent = testComponentHelper(OrderListFooter)
  const initialProps = {
    displayText: 'I am the coolest displayText',
    historyRequest: 'I am the coolest historyRequest',
    contact: 'I am the coolest contact',
  }

  const { wrapper } = renderComponent({
    ...initialProps,
  })

  it('should render with correct text', () => {
    expect(wrapper.find('.OrderList-customerMessage-limit').text()).toEqual(
      initialProps.displayText
    )
    expect(
      wrapper
        .find('.OrderList-customerMessage-contact')
        .text()
        .includes(`${initialProps.historyRequest}`)
    )
    expect(
      wrapper
        .find('.OrderList-customerMessage-contact')
        .text()
        .includes(`${initialProps.contact}`)
    )
  })

  it('should render CustomerServiceNumber ', () => {
    expect(wrapper.find(CustomerServiceNumber)).toHaveLength(1)
  })
})
