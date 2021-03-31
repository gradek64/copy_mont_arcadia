import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureStore from '../../../../../lib/configure-store'
import SavePaymentDetailsCheckbox from '../SavePaymentDetailsCheckbox'
import SavePaymentDetailsCheckboxContainer from '../SavePaymentDetailsCheckboxContainer'
import { CLEARPAY, VISA } from '../../../../../constants/paymentTypes'

describe('SavePaymentDetailsCheckboxContainer', () => {
  const render = ({ state = {} }) => {
    const store = configureStore(state)
    return mount(
      <Provider store={store}>
        <SavePaymentDetailsCheckboxContainer />
      </Provider>,
      {
        context: {
          l: (x) => x,
        },
        childContextTypes: {
          l: PropTypes.func,
        },
      }
    )
  }

  const getState = ({
    featureFlag = true,
    checkboxEnabled = true,
    clearPaySelected = false,
  } = {}) => ({
    features: {
      status: {
        FEATURE_SAVE_PAYMENT_DETAILS: featureFlag,
      },
    },
    checkout: {
      savePaymentDetails: checkboxEnabled,
    },
    forms: {
      checkout: {
        billingCardDetails: {
          fields: {
            paymentType: {
              value: clearPaySelected ? CLEARPAY : VISA,
            },
          },
        },
      },
    },
  })

  it('should render checkbox when the feature flag status is true', () => {
    const state = getState()

    const wrapper = render({ state })

    const checkboxComponent = wrapper.find(SavePaymentDetailsCheckbox)
    expect(checkboxComponent.exists()).toBe(true)
    expect(checkboxComponent.prop('onSavePaymentDetailsChange')).toEqual(
      expect.any(Function)
    )
    expect(checkboxComponent.prop('savePaymentDetailsEnabled')).toEqual(true)
  })

  it('should not render checkbox when the feature flag status is false', () => {
    const state = getState({ featureFlag: false })

    const wrapper = render({ state })

    const checkboxComponent = wrapper.find(SavePaymentDetailsCheckbox)
    expect(checkboxComponent.exists()).toBe(false)
  })

  it('should not render checkbox if ClearPay is selected payment method', () => {
    const state = getState({ clearPaySelected: true })

    const wrapper = render({ state })

    const checkboxComponent = wrapper.find(SavePaymentDetailsCheckbox)
    expect(checkboxComponent.exists()).toBe(false)
  })
})
