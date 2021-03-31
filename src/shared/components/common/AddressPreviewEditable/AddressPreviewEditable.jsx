import React from 'react'
import PropTypes from 'prop-types'

export default function AddressPreviewEditable(props) {
  const {
    DetailsForm,
    AddressForm,
    AddressPreview,
    onEnableEditingClick,
    isEditingEnabled,
  } = props

  return (
    <div>
      {isEditingEnabled ? (
        <div>
          <DetailsForm />
          <AddressForm />
        </div>
      ) : (
        <AddressPreview onChangeButtonClick={onEnableEditingClick} />
      )}
    </div>
  )
}

AddressPreviewEditable.propTypes = {
  DetailsForm: PropTypes.func.isRequired,
  AddressForm: PropTypes.func.isRequired,
  AddressPreview: PropTypes.func.isRequired,
  isEditingEnabled: PropTypes.bool,
  onEnableEditingClick: PropTypes.func,
}
