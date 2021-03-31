import testComponentHelper from 'test/unit/helpers/test-component'
import PaymentSummary from '../PaymentSummary'

const context = {
  l: (value) => {
    return value
  },
  p: (value) => {
    return `£${value}`
  },
}

const renderComponent = testComponentHelper(PaymentSummary)

describe('<PaymentSummary />', () => {
  it('should render as expected when all props have been specified', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          method: 'Visa',
          cardNumber: '************1111',
          price: '52.00',
          isCardType: true,
          type: 'VISA',
        },
        {
          method: 'Gift Card',
          cardNumber: '************1234',
          isCardType: true,
          price: '10.00',
          remainingBalance: '42.00',
          type: 'GCARD',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
  it('should render the total visa amount to be paid for order partially covered with gift card', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          method: 'Visa',
          cardNumber: '************1111',
          isCardType: true,
          price: '52.00',
          priceAfterDiscount: '32.00',
          type: 'VISA',
        },
        {
          method: 'Gift Card',
          cardNumber: '************1234',
          isCardType: true,
          price: '10.00',
          remainingBalance: '0.00',
          type: 'GCARD',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
  it('should render the total paypal amount to be paid for order partially covered with gift card', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          method: 'Paypal',
          isCardType: false,
          cardNumber: '',
          price: '52.00',
          priceAfterDiscount: '32.00',
          type: 'PYPAL',
        },
        {
          method: 'Gift Card',
          cardNumber: '************1234',
          isCardType: true,
          price: '10.00',
          remainingBalance: '0.00',
          type: 'GCARD',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
  it('should render the total klarna amount to be paid for order partially covered with gift card', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          method: 'Klarna',
          isCardType: false,
          cardNumber: '',
          price: '52.00',
          priceAfterDiscount: '32.00',
          type: 'KLRNA',
        },
        {
          method: 'Gift Card',
          cardNumber: '************1234',
          isCardType: true,
          price: '10.00',
          remainingBalance: '0.00',
          type: 'GCARD',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
  it('should render the total account card amount to be paid for order partially covered with gift card', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          cardNumber: '************0005',
          isCardType: true,
          method: 'Account Card',
          price: '8.45',
          type: 'ACCNT',
        },
        {
          method: 'Gift Card',
          cardNumber: '************1234',
          isCardType: true,
          price: '10.00',
          remainingBalance: '0.00',
          type: 'GCARD',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
  it('should only render the gift card amount paid if order total is covered by gift card', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          method: 'Gift Card',
          cardNumber: '************1234',
          isCardType: true,
          price: '52.00',
          remainingBalance: '0.00',
          type: 'GCARD',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
  it('should render the gift card remaining amount', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          method: 'Gift Card',
          cardNumber: '************1234',
          isCardType: true,
          price: '10.00',
          remainingBalance: '42.00',
          type: 'GCARD',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
  it('should not render the gift card remaining amount if no gift card is used', () => {
    const props = {
      totalOrderPrice: '52.00',
      payments: [
        {
          method: 'Visa',
          cardNumber: '************1111',
          isCardType: true,
          price: '52.00',
          type: 'VISA',
        },
      ],
    }
    const { getTree } = renderComponent(props, context)
    expect(getTree()).toMatchSnapshot()
  })
})
