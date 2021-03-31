import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import SavePaymentDetailsCheckbox from './SavePaymentDetailsCheckbox'
import { setSavePaymentDetailsEnabled } from '../../../../actions/common/checkoutActions'
import { isFeatureSavePaymentDetailsEnabled } from '../../../../selectors/featureSelectors'
import { isSavePaymentDetailsEnabled } from '../../../../selectors/checkoutSelectors'
import { getCurrentPaymentConfig } from '../../../../selectors/paymentMethodSelectors'

const shouldShowCheckbox = (state) => {
  if (!isFeatureSavePaymentDetailsEnabled(state)) return false

  const { canSavePaymentAsDefault } = getCurrentPaymentConfig(state)

  return canSavePaymentAsDefault
}

const mapStateToProps = (state) => ({
  shouldShow: shouldShowCheckbox(state),
  savePaymentDetailsEnabled: isSavePaymentDetailsEnabled(state),
})

const mapDispatchToProps = {
  onSavePaymentDetailsChange: setSavePaymentDetailsEnabled,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class SavePaymentDetailsCheckboxContainer extends Component {
  static propTypes = {
    onSavePaymentDetailsChange: PropTypes.func.isRequired,
    savePaymentDetailsEnabled: PropTypes.bool.isRequired,
    shouldShow: PropTypes.bool.isRequired,
  }

  render() {
    const {
      onSavePaymentDetailsChange,
      savePaymentDetailsEnabled,
      shouldShow,
    } = this.props

    if (!shouldShow) return null

    return (
      <SavePaymentDetailsCheckbox
        onSavePaymentDetailsChange={onSavePaymentDetailsChange}
        savePaymentDetailsEnabled={savePaymentDetailsEnabled}
      />
    )
  }
}

export default SavePaymentDetailsCheckboxContainer
