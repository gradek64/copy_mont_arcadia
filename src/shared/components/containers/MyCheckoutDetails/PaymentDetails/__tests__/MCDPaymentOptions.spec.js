import MCDPaymentOptions, {
  mapStateToProps,
  mergeProps,
} from '../MCDPaymentOptions'

// mocks
import { paymentMethodsList } from '../../../../../../../test/mocks/paymentMethodsMocks'

describe('<MCDPaymentOptions />', () => {
  describe('@wrapper', () => {
    it('should wrap `PaymentOptions` component', () => {
      expect(MCDPaymentOptions.WrappedComponent.name).toBe('PaymentOptions')
    })
  })

  describe('mapStateToProps', () => {
    it('should get optionTypes from state', () => {
      const state = {
        paymentMethods: paymentMethodsList,
        forms: {
          account: {
            myCheckoutDetails: {
              deliveryAddressMCD: {
                fields: {
                  country: {
                    value: 'United Kingdom',
                  },
                },
              },
              billingAddressMCD: {
                fields: {
                  country: {
                    value: 'United Kingdom',
                  },
                },
              },
              paymentCardDetailsMCD: {
                fields: {
                  paymentType: {
                    value: 'VISA',
                  },
                },
              },
            },
          },
        },
      }
      const { optionTypes } = mapStateToProps(state)

      expect(optionTypes).toEqual(['CARD', 'ACCNT', 'PYPAL', 'MPASS', 'KLRNA'])
    })

    it('should return user selectedOptionType (forms first)', () => {
      const state = {
        paymentMethods: paymentMethodsList,
        forms: {
          account: {
            myCheckoutDetails: {
              paymentCardDetailsMCD: {
                fields: {
                  paymentType: {
                    value: 'PYPAL',
                  },
                },
              },
            },
          },
        },
      }
      const { selectedOptionType } = mapStateToProps(state)
      expect(selectedOptionType).toEqual('PYPAL')
    })
    it('should return user selectedOptionType (account if forms does not exists)', () => {
      const state = {
        paymentMethods: paymentMethodsList,
        forms: {},
        account: {
          user: {
            creditCard: {
              type: 'ACCNT',
              cardNumberHash: 'qdVaNzj/8PFhXEw3GAWQ23mrDgSc058p',
              cardNumberStar: '************4444',
              expiryMonth: '11',
              expiryYear: '2017',
            },
          },
        },
      }
      const { selectedOptionType } = mapStateToProps(state)
      expect(selectedOptionType).toEqual('ACCNT')
    })
    it('should return CARD as selectedOptionType if payment method does not exists', () => {
      const state = {
        paymentMethods: paymentMethodsList,
        forms: {},
        account: {
          user: {
            creditCard: {
              type: 'NOOOO',
              cardNumberHash: 'qdVaNzj/8PFhXEw3GAWQ23mrDgSc058p',
              cardNumberStar: '************4444',
              expiryMonth: '11',
              expiryYear: '2017',
            },
          },
        },
      }
      const { selectedOptionType } = mapStateToProps(state)
      expect(selectedOptionType).toEqual('CARD')
    })
  })

  describe('mergeProps', () => {
    const defaultProps = {
      optionTypes: ['CARD', 'ACCNT', 'PYPAL', 'MPASS', 'ALIPY', 'CUPAY'],
      selectedOptionType: 'CARD',
    }
    const { optionEditorProps } = mergeProps(defaultProps)

    it('should set default optionEditorProps', () => {
      expect(optionEditorProps.EditorForCard).toBeDefined()
      expect(optionEditorProps.EditorForAccnt).toBeDefined()
    })
    it('should set EditorForCard to CardPaymentMethod with isPaymentCard and noCVV by default', () => {
      const EditorForCard = optionEditorProps.EditorForCard()
      expect(EditorForCard.props.isPaymentCard).toBe(true)
      expect(EditorForCard.props.noCVV).toBe(true)
    })
    it('should set EditorForAccnt to CardPaymentMethod with noCVV by default', () => {
      const EditorForAccnt = optionEditorProps.EditorForAccnt()
      expect(EditorForAccnt.props.noCVV).toBe(true)
    })
  })
})
