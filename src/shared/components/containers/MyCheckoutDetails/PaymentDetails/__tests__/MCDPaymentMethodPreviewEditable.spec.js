import {
  buildComponentRender,
  shallowRender,
  withStore,
} from 'test/unit/helpers/test-component'
import MCDPaymentMethodPreviewEditable from '../MCDPaymentMethodPreviewEditable'

import { paymentMethodsList } from '../../../../../../../test/mocks/paymentMethodsMocks'
import { compose } from 'ramda'
import { browserHistory } from 'react-router'

// mocks
jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

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
  MCDPaymentMethodPreviewEditable
)

describe('<MCDPaymentMethodPreviewEditable />', () => {
  describe('@wrapper', () => {
    it('should wrap `PaymentMethodPreviewEditable` component', () => {
      expect(MCDPaymentMethodPreviewEditable.WrappedComponent.name).toBe(
        'PaymentMethodPreviewEditable'
      )
    })
  })

  describe('mapStateToProps', () => {
    it('should have `isEditingEnabled` prop set true', () => {
      const { instance } = renderComponent()
      expect(instance.stateProps.isEditingEnabled).toBe(true)
    })
    it('should have `isEditingEnabled` prop set false', () => {
      const editState = {
        ...defaultState,
      }
      editState.account.myCheckoutDetails.editingEnabled = false
      const render = compose(
        shallowRender,
        withStore(editState)
      )
      const renderComponent = buildComponentRender(
        render,
        MCDPaymentMethodPreviewEditable
      )
      const { instance } = renderComponent()
      expect(instance.stateProps.isEditingEnabled).toBe(false)
    })
  })

  describe('mapDispatchToProps', () => {
    it('onEnableEditingClick handler is wired into props correctly', () => {
      const { instance, store } = renderComponent({
        scrollSelector: '#test-element-selector-payment-method',
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
            initialFocus: '#test-element-selector-payment-method',
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
