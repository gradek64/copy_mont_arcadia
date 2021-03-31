import testComponentHelper, {
  buildComponentRender,
  shallowRender,
  withStore,
} from 'test/unit/helpers/test-component'
import BillingAddressPreviewEditable from '../BillingAddressPreviewEditable'
import BillingAddressPreview from '../BillingAddressPreview'
import BillingAddressForm from '../BillingAddressForm'
import BillingDetailsForm from '../BillingDetailsForm'
import { paymentMethodsList } from '../../../../../../../test/mocks/paymentMethodsMocks'
import { compose } from 'ramda'
import { browserHistory } from 'react-router'

// mocks
jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

const defaultProps = {
  DetailsForm: BillingDetailsForm,
  AddressForm: BillingAddressForm,
  AddressPreview: BillingAddressPreview,
  onEnableEditingClick: jest.fn(() => ({ type: 'FOO' })),
  isEditingEnabled: true,
}

const renderComponent = testComponentHelper(
  BillingAddressPreviewEditable.WrappedComponent
)

describe('<BillingAddressPreviewEditable />', () => {
  describe('@renders', () => {
    describe('when in editing is enabled', () => {
      let props
      let wrapper

      beforeEach(() => {
        props = { ...defaultProps, isEditingEnabled: true }
        wrapper = renderComponent(props).wrapper
      })

      it('does not renders the address preview', () => {
        expect(wrapper.find(props.AddressPreview)).toHaveLength(0)
      })

      it('renders the personal details form', () => {
        expect(wrapper.find(props.DetailsForm)).toHaveLength(1)
      })

      it('renders the address details form', () => {
        expect(wrapper.find(props.AddressForm)).toHaveLength(1)
      })
    })

    describe('when editing is not enabled', () => {
      let props
      let wrapper

      beforeEach(() => {
        props = { ...defaultProps, isEditingEnabled: false }
        wrapper = renderComponent(props).wrapper
      })

      it('renders the address preview', () => {
        expect(wrapper.find(props.AddressPreview)).toHaveLength(1)
      })

      it('does not render the personal details form', () => {
        expect(wrapper.find(props.DetailsForm)).toHaveLength(0)
      })

      it('does not render the address details form', () => {
        expect(wrapper.find(props.AddressForm)).toHaveLength(0)
      })
    })
  })

  describe('@events', () => {
    describe('when the address preview change button is clicked', () => {
      it('results in `props.onEnableEditingClick()` being called', () => {
        const props = { ...defaultProps, isEditingEnabled: false }
        const wrapper = renderComponent(props).wrapper
        const preview = wrapper.find(props.AddressPreview)
        preview.prop('onChangeButtonClick')()
        expect(props.onEnableEditingClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('mapDispatchToProps', () => {
    it('onEnableEditingClick handler is wired into props correctly', () => {
      const defaultState = {
        paymentMethods: paymentMethodsList,
        account: {
          myCheckoutDetails: {
            editingEnabled: true,
          },
          user: {
            creditCard: { type: 'VISA', expiryMonth: '01', expiryYear: '2020' },
          },
        },
        siteOptions: {
          expiryMonths: [],
          expiryYears: [],
        },
      }
      const render = compose(
        shallowRender,
        withStore(defaultState)
      )
      const renderComponent = buildComponentRender(
        render,
        BillingAddressPreviewEditable
      )
      const { instance, store } = renderComponent({
        scrollSelector: '#test-element-selector-billing',
        user: {
          creditCard: {},
        },
      })
      expect(browserHistory.push).toHaveBeenCalledTimes(0)
      instance.dispatchProps.onEnableEditingClick()
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          {
            type: 'RESET_FORM',
            formName: 'deliveryAddressMCD',
            initialValues: {
              address1: null,
              address2: null,
              city: null,
              state: null,
              country: null,
              postcode: null,
              county: null,
              isManual: true,
            },
            key: null,
          },
          {
            type: 'RESET_FORM',
            formName: 'deliveryDetailsAddressMCD',
            initialValues: { telephone: null },
            key: null,
          },
          {
            type: 'RESET_FORM',
            formName: 'billingAddressMCD',
            initialValues: {
              address1: null,
              address2: null,
              city: null,
              state: null,
              country: null,
              postcode: null,
              county: null,
              isManual: true,
            },
            key: null,
          },
          {
            type: 'RESET_FORM',
            formName: 'billingDetailsAddressMCD',
            initialValues: {
              telephone: null,
            },
            key: null,
          },
          {
            type: 'SET_ADDRESS_MODE_TO_FIND',
          },
          {
            type: 'SET_MCD_INITIAL_FOCUS',
            initialFocus: '#test-element-selector-billing',
          },
        ])
      )
      expect(browserHistory.push).toHaveBeenCalledTimes(1)
      expect(browserHistory.push).toHaveBeenCalledWith(
        '/my-account/details/edit'
      )
    })
  })
})
