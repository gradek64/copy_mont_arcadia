import testComponentHelper from 'test/unit/helpers/test-component'
import PaymentDetails, { mapStateToProps } from '../PaymentDetails'
import Select from '../../../common/FormComponents/Select/Select'

const userMock = {
  exists: true,
  email: 'test373653@test.com',
  title: 'Ms',
  firstName: '3D.',
  lastName: 'AUTHORIZED',
  userTrackingId: 1365367,
  basketItemCount: 0,
  creditCard: {
    type: 'VISA',
    cardNumberHash: 'tjOBl4zzS+toHslPB+u0Z0x24+iMu0Qb',
    cardNumberStar: '************1152',
    expiryMonth: '02',
    expiryYear: '2018',
  },
  deliveryDetails: {
    addressDetailsId: 1158878,
    nameAndPhone: {
      title: 'Ms',
      firstName: '3D.',
      lastName: 'AUTHORIZED',
      telephone: '0123456789',
    },
    address: {
      address1: 'Flat 4, Rowan Court, Garnies Close',
      address2: '',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'SE15 6PE',
    },
  },
  billingDetails: {
    addressDetailsId: 1238489,
    nameAndPhone: {
      title: 'Ms',
      firstName: '3D.',
      lastName: 'AUTHORIZED',
      telephone: '0123456789',
    },
    address: {
      address1: 'Flat 4, Rowan Court, Garnies Close',
      address2: '',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'SE15 6PE',
    },
  },
  version: '1.6',
}

const formMock = {
  fields: {
    type: { value: 'VISA' },
    expiryMonth: { isDirty: false },
    expiryYear: { isDirty: false },
  },
}

const mockFormError = {
  fields: {
    type: { value: 'VISA' },
    expiryMonth: { isDirty: false },
    expiryYear: { isDirty: true },
  },
}

const paymentSchema = ['type', 'cardNumber', 'expiryMonth', 'expiryYear']
const paymentMethods = [
  {
    value: 'VISA',
    type: 'CARD',
    label: 'Visa',
    description: 'Pay with VISA',
  },
  {
    value: 'MCARD',
    type: 'CARD',
    label: 'MasterCard',
    description: 'Pay with MasterCard',
  },
]
const otherPaymentsMethods = [
  {
    value: 'PYPAL',
    type: 'OTHER',
    label: 'Paypal',
    description: 'Pay with Paypal',
  },
]
const expiryYears = []
const expiryMonths = []
const errors = {}

const mockProps = {
  user: userMock,
  form: formMock,
  paymentMethods,
  paymentSchema,
  expiryMonths,
  expiryYears,
  errors,
}

const setFieldCallBack = jest.fn()
const setBlurCallBack = jest.fn()
const mockCallback = {
  setField: jest.fn(() => setFieldCallBack),
  touchedField: jest.fn(() => setBlurCallBack),
  resetFormPartial: jest.fn(),
  getPaymentMethods: jest.fn(),
}

describe('<PaymentDetails/>', () => {
  const renderComponent = testComponentHelper(PaymentDetails.WrappedComponent)
  // const generateProps = () => { return { ...mockProps } }
  beforeEach(() => {
    mockCallback.getPaymentMethods.mockClear()
    mockCallback.resetFormPartial.mockClear()
    mockCallback.setField.mockClear()
    mockCallback.touchedField.mockClear()
    setFieldCallBack.mockClear()
  })

  describe('@renders', () => {
    it('in default state (no validations error)', () => {
      expect(
        renderComponent({ ...mockCallback, ...mockProps }).getTree()
      ).toMatchSnapshot()
    })

    it('without payments methods', () => {
      expect(
        renderComponent({
          ...mockCallback,
          ...mockProps,
          paymentMethods: undefined,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with other type of payments', () => {
      expect(
        renderComponent({
          ...mockCallback,
          ...mockProps,
          paymentMethods: otherPaymentsMethods,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with expire validation message', () => {
      expect(
        renderComponent({
          ...mockCallback,
          ...mockProps,
          form: mockFormError,
          errors: { expiryMonth: 'Enter a valid Year' },
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('mapStateToProps', () => {
    let variedPaymentMethods
    let mockState
    let expectedPaymentMethods

    beforeEach(() => {
      variedPaymentMethods = [
        ...paymentMethods,
        ...otherPaymentsMethods,
        {
          value: 'ALIPY',
          type: 'OTHER',
          label: 'AliPay',
          description: 'Check out with your AliPay account',
          billingCountry: ['China'],
        },
        {
          value: 'ALIPY2',
          type: 'OTHER',
          label: 'AliPay2',
          description: 'Check out with your AliPay2 account',
          deliveryCountry: ['China'],
        },
        {
          value: 'ALIPY3',
          type: 'OTHER',
          label: 'AliPay3',
          description: 'Check out with your AliPay3 account',
          billingCountry: ['China'],
          deliveryCountry: ['China'],
        },
        {
          value: 'KLRNA',
          type: 'OTHER',
          threshold: 0,
          label: 'not hot',
          description: 'not hot',
          billingCountry: ['United Kingdom'],
          deliveryCountry: ['United Kingdom'],
        },
      ]

      mockState = {
        config: {
          paymentSchema,
        },
        paymentMethods: variedPaymentMethods,
        account: {
          user: userMock,
        },
        siteOptions: {
          expiryMonths,
          expiryYears,
        },
      }

      expectedPaymentMethods = [
        ...paymentMethods,
        ...otherPaymentsMethods,
        {
          value: 'KLRNA',
          type: 'OTHER',
          threshold: 0,
          label: 'not hot',
          description: 'not hot',
          billingCountry: ['United Kingdom'],
          deliveryCountry: ['United Kingdom'],
        },
      ]
    })

    it('filters out payment methods that do not apply to the billing and delivery countries set', () => {
      const result = mapStateToProps(mockState)

      expect(result).toEqual({
        paymentSchema,
        paymentMethods: expectedPaymentMethods,
        expiryYears,
        expiryMonths,
      })
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      it('call resetFormPartial if user exist', () => {
        const props = {
          paymentSchema,
          user: userMock,
          ...mockCallback,
          form: formMock,
        }
        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(instance.props.resetFormPartial).toBeCalled()
      })
      it('does not call setCardInfo if not user', () => {
        const { instance } = renderComponent({
          user: undefined,
          ...mockCallback,
          form: formMock,
        })
        instance.componentDidMount()
        expect(instance.props.resetFormPartial).not.toBeCalled()
      })
    })

    describe('@events', () => {
      const props = {
        paymentSchema,
        user: userMock,
        ...mockCallback,
        form: formMock,
        paymentMethods: otherPaymentsMethods,
      }
      it('onChange', () => {
        const { wrapper, instance } = renderComponent(props)
        expect(instance.props.setField).toBeCalledWith('type')
        expect(setFieldCallBack).not.toHaveBeenCalled()
        wrapper.find(Select).simulate('change')
        expect(setFieldCallBack).toHaveBeenCalledTimes(1)
      })
      it('onBlur', () => {
        const { wrapper, instance } = renderComponent(props)
        expect(instance.props.touchedField).toBeCalledWith('type')
        expect(setBlurCallBack).not.toHaveBeenCalled()
        wrapper.find(Select).simulate('blur')
        expect(setBlurCallBack).toHaveBeenCalledTimes(1)
      })
    })
  })
})
