import React from 'react'
import PropTypes from 'prop-types'

export default function PaymentMethodPreviewEditable(props) {
  const {
    PaymentMethodOptions,
    PaymentMethodPreview,
    onEnableEditingClick,
    isEditingEnabled,
  } = props

  return (
    <div className="MyCheckoutDetails-preview">
      {isEditingEnabled ? (
        <PaymentMethodOptions />
      ) : (
        <PaymentMethodPreview onChangeButtonClick={onEnableEditingClick} />
      )}
    </div>
  )
}

PaymentMethodPreviewEditable.propTypes = {
  PaymentMethodOptions: PropTypes.func.isRequired, // editable payment methods
  PaymentMethodPreview: PropTypes.func.isRequired,
  isEditingEnabled: PropTypes.bool,
  onEnableEditingClick: PropTypes.func,
}
