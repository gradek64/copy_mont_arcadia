import { path, pathOr } from 'ramda'

const getSavedAddresses = (state) => {
  const addressId = pathOr(
    -1,
    ['account', 'user', 'deliveryDetails', 'addressDetailsId'],
    state
  )
  const savedAddresses = pathOr(
    [],
    ['checkout', 'orderSummary', 'savedAddresses'],
    state
  )
  if (savedAddresses.length > 0) {
    return state.checkout.orderSummary.savedAddresses
  } else if (addressId !== -1) {
    const address = state.account.user.deliveryDetails.address
    const nameAndPhone = state.account.user.deliveryDetails.nameAndPhone

    return [
      {
        id: state.account.user.deliveryDetails.addressDetailsId,
        addressName: `${address.city}, ${address.postcode}, ${address.country}`,
        selected: true,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        postcode: address.postcode,
        country: address.country,
        title: nameAndPhone.title,
        firstName: nameAndPhone.firstName,
        lastName: nameAndPhone.lastName,
        telephone: nameAndPhone.telephone,
      },
    ]
  }
  return []
}

const getIsNewAddressFormVisible = (state) => {
  return pathOr(false, ['addressBook', 'isNewAddressFormVisible'], state)
}

const getDefaultCountry = (state) => {
  const accountCountry = path(
    ['account', 'user', 'deliveryDetails', 'address', 'country'],
    state
  )
  const brandCountry = path(['config', 'country'], state)
  return accountCountry || brandCountry
}

const getHasFoundAddress = (findAddressForm) => {
  return !!path(['fields', 'findAddress', 'value'], findAddressForm)
}

const getHasSelectedAddress = (addressForm) => {
  return !!path(['fields', 'address1', 'value'], addressForm)
}

export {
  getSavedAddresses,
  getIsNewAddressFormVisible,
  getDefaultCountry,
  getHasFoundAddress,
  getHasSelectedAddress,
}
