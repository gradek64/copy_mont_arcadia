export function getDefaultAddress() {
  return {
    address1: null,
    address2: null,
    city: null,
    state: null,
    country: null,
    postcode: null,
  }
}

export function getDefaultNameAndPhone() {
  return {
    title: '',
    firstName: null,
    lastName: null,
    telephone: null,
  }
}

export function getDefaultPaymentOptions() {
  return {
    paymentType: '',
    cardNumber: '',
    expiryDate: '',
    expiryMonth: '',
    expiryYear: '',
    startMonth: '',
    startYear: '',
    cvv: '',
  }
}

export function isUserCreditCard(user) {
  // note: if `user === null` then (typeof user === 'object') returns true
  return !!(typeof user === 'object' && user.creditCard && user.creditCard.type)
}
