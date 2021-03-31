import PropTypes from 'prop-types'
import React from 'react'
import Checkbox from '../../../common/FormComponents/Checkbox/Checkbox'

function SavePaymentDetailsCheckbox(props, { l }) {
  const { onSavePaymentDetailsChange, savePaymentDetailsEnabled } = props
  return (
    <div className="SavePaymentDetailsCheckbox">
      <Checkbox
        className="SavePaymentDetails-checkbox"
        checked={{ value: savePaymentDetailsEnabled }}
        onChange={() => onSavePaymentDetailsChange(!savePaymentDetailsEnabled)}
        name="SavePaymentDetails"
      >
        <span>{l`Save payment details for future purchases?`}</span>
      </Checkbox>
    </div>
  )
}

SavePaymentDetailsCheckbox.propTypes = {
  onSavePaymentDetailsChange: PropTypes.func.isRequired,
  savePaymentDetailsEnabled: PropTypes.bool.isRequired,
}

SavePaymentDetailsCheckbox.contextTypes = {
  l: PropTypes.func,
}

export default SavePaymentDetailsCheckbox
