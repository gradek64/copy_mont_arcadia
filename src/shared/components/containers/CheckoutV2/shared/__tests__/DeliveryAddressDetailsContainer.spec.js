import testComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import DeliveryAddressDetailsContainer from '../DeliveryAddressDetailsContainer'
import { orderSummaryUkStandard } from '../../../../../../../test/mocks/orderSummary/uk-standard'

import DeliveryDetailsForm from '../DetailsForm/DeliveryDetailsForm'
import DeliveryAddressForm from '../AddressForm/DeliveryAddressForm'

const state = {
  checkout: {
    deliveryAndPayment: {
      deliveryEditingEnabled: false,
    },
    orderSummary: orderSummaryUkStandard,
  },
  viewport: { width: 320 },
}

const mockProps = {
  deliveryEditingEnabled: false,
  isHomeDelivery: false,
}

const $ = {
  root: 'DeliveryAddressDetailsContainer',
  addressPreview: 'Connect(DeliveryAddressPreviewContainer)',
  deliveryDetailsForm: DeliveryDetailsForm,
  deliveryAddressForm: DeliveryAddressForm,
}

const renderComponent = testComponentHelper(
  DeliveryAddressDetailsContainer.WrappedComponent
)

describe('<DeliveryAddressDetailsContainer />', () => {
  describe('@renders', () => {
    describe('home delivery', () => {
      const props = { ...mockProps, isHomeDelivery: true }

      describe('when in edit mode', () => {
        props.deliveryEditingEnabled = true
        const component = renderComponent(props)

        it('does not renders the address preview', () => {
          expect(component.wrapper.find($.addressPreview)).toHaveLength(0)
        })

        it('renders the personal details form', () => {
          expect(component.wrapper.find($.deliveryDetailsForm)).toHaveLength(1)
        })

        it('renders the address details form', () => {
          expect(component.wrapper.find($.deliveryAddressForm)).toHaveLength(1)
        })
      })

      describe('when not in edit mode', () => {
        props.deliveryEditingEnabled = false
        const component = renderComponent(props)

        it('renders the address preview', () => {
          expect(component.wrapper.find($.addressPreview)).toHaveLength(1)
        })

        it('does not render the personal details form', () => {
          expect(component.wrapper.find($.deliveryDetailsForm)).toHaveLength(0)
        })

        it('does not render the address details form', () => {
          expect(component.wrapper.find($.deliveryAddressForm)).toHaveLength(0)
        })
      })
    })

    describe('when not home delivery', () => {
      const props = { ...mockProps, isHomeDelivery: false }

      describe('when in edit mode', () => {
        props.deliveryEditingEnabled = true
        const component = renderComponent(props)

        it('renders nothing', () => {
          expect(component.wrapper.find($.root)).toHaveLength(0)
        })
      })

      describe('when not in edit mode', () => {
        props.deliveryEditingEnabled = false
        const component = renderComponent(props)

        it('renders nothing', () => {
          expect(component.wrapper.find($.root)).toHaveLength(0)
        })
      })
    })
  })

  describe('@connected', () => {
    const props = renderConnectedComponentProps(
      DeliveryAddressDetailsContainer,
      state
    )

    it('should correctly map state to props', () => {
      expect(props.deliveryEditingEnabled).toBe(
        state.checkout.deliveryAndPayment.deliveryEditingEnabled
      )
      expect(props.isHomeDelivery).toBe(true)
    })
  })
})
