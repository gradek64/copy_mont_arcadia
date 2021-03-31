import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutCTA from '../CheckoutCTA'

describe('<CheckoutCTA />', () => {
  const initialProps = {
    copy: 'Checkout cta',
    action: jest.fn(),
    type: '',
  }

  const renderComponent = testComponentHelper(CheckoutCTA)

  it('should render the button with the default style', () => {
    const { wrapper, getTree } = renderComponent(initialProps)
    const link = wrapper.find('.CheckoutCTA').props().className
    expect(link).toEqual('CheckoutCTA')
    expect(getTree()).toMatchSnapshot()
  })
})
