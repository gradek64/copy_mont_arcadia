import testComponentHelper from 'test/unit/helpers/test-component'

import PaymentMethodPreview from '../PaymentMethodPreview'
import { paymentMethodsList } from '../../../../../../test/mocks/paymentMethodsMocks'

describe('<PaymentMethodPreview />', () => {
  const renderComponent = testComponentHelper(PaymentMethodPreview)
  let requiredProps
  beforeEach(() => {
    requiredProps = {
      paymentMethod: paymentMethodsList[0],
      paymentDetails: {
        cardNumberStar: '************4444',
        expiryMonth: '11',
        expiryYear: '19',
      },
      onClickChangeButton: jest.fn(),
    }
  })

  describe('@renders', () => {
    it('should render default state correctly', () => {
      expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
    })

    it('should render `ConfirmCVV` component if `CARD` type', () => {
      const { wrapper } = renderComponent({ ...requiredProps })
      expect(wrapper.find('.PaymentMethodPreviewV1-detailsLine').length).toBe(2)
    })

    it('should render `ConfirmCVV` component if `OTHER_CARD` type', () => {
      const modifiedRequiredProps = {
        ...requiredProps,
        paymentMethod: paymentMethodsList[5],
      }
      const { wrapper } = renderComponent({ ...modifiedRequiredProps })
      expect(wrapper.find('.PaymentMethodPreviewV1-detailsLine').length).toBe(0)
    })

    it('does not show the log into message if it is ApplePay', () => {
      const modifiedRequiredProps = {
        ...requiredProps,
        paymentMethod: {
          type: 'OTHER',
          value: 'APPLE',
        },
      }
      const { wrapper } = renderComponent({ ...modifiedRequiredProps })
      expect(wrapper.find('.PaymentMethodPreviewV1-detailsCol').text()).toEqual(
        ''
      )
    })
  })

  describe('@events', () => {
    it('should call `onChange` prop when button is clicked', () => {
      const modifiedRequiredProps = {
        ...requiredProps,
        paymentMethod: paymentMethodsList[5],
      }
      const onChangeMock = jest.fn()
      const event = {}
      const { wrapper } = renderComponent({
        ...modifiedRequiredProps,
        onChangeButtonClick: onChangeMock,
      })
      wrapper.find('button').prop('onClick')(event)
      expect(onChangeMock).toHaveBeenCalledWith(event)
    })
  })
})
