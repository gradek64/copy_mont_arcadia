import MCDPaymentMethodPreview, {
  mapStateToProps,
} from '../MCDPaymentMethodPreview'

describe('<MCDPaymentMethodPreview />', () => {
  const state = {
    account: {
      user: {
        creditCard: {
          type: 'VISA',
          cardNumberHash: 'qdVaNzj/8PFhXEw3GAWQ23mrDgSc058p',
          cardNumberStar: '************4444',
          expiryMonth: '11',
          expiryYear: '2017',
        },
      },
    },
    paymentMethods: [
      {
        value: 'VISA',
        type: 'CARD',
        label: 'Visa',
        description: 'Pay with VISA',
        icon: 'icon_visa.gif',
      },
      {
        value: 'MCARD',
        type: 'CARD',
        label: 'MasterCard',
        description: 'Pay with MasterCard',
        icon: 'icon_mastercard.gif',
      },
    ],
  }

  describe('@wrapper', () => {
    it('should wrap `PaymentMethodPreview` component', () => {
      expect(MCDPaymentMethodPreview.WrappedComponent.name).toBe(
        'PaymentMethodPreview'
      )
    })
  })

  describe('mapStateToProps', () => {
    it('should get paymentMethod from state', () => {
      const { paymentMethod, paymentDetails } = mapStateToProps(state)
      expect(paymentMethod).toEqual({
        description: 'Pay with VISA',
        icon: 'icon_visa.gif',
        label: 'Visa',
        type: 'CARD',
        value: 'VISA',
      })
      expect(paymentDetails).toEqual({
        cardNumberHash: 'qdVaNzj/8PFhXEw3GAWQ23mrDgSc058p',
        cardNumberStar: '************4444',
        expiryMonth: '11',
        expiryYear: '2017',
        type: 'VISA',
      })
    })
  })
})
