import React from 'react'

import AddressFormDetailsContainer from '../AddressFormDetailsContainer/AddressFormDetailsContainer'

const BillingDetailsForm = () => {
  return (
    <AddressFormDetailsContainer
      addressType="billingMCD"
      label="Billing Details"
    />
  )
}

export default BillingDetailsForm
