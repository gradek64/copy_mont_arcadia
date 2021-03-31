import React from 'react'

import AddressFormDetails from '../../../../common/AddressFormDetails/AddressFormDetails'

const BillingDetailsForm = () => {
  return (
    <AddressFormDetails
      addressType="billingCheckout"
      titleHidden
      label="Billing address"
    />
  )
}

export default BillingDetailsForm
