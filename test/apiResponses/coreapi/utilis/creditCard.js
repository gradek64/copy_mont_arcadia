const applePayToken = { paymentToken: 'testString' }

const cards = {
  VISA: '4444333322221111',
  MCARD: '5555555555554444',
  AMEX: '34343434343434',
  ACCNT: '6000082000000005',
  PYPAL: '0',
  MPASS: '0',
  KLARNA_UK: '0',
}

const paymentMethod = (method) => {
  return {
    expiryYear: '2021',
    expiryMonth: '12',
    cardNumber: cards[method],
    type: method,
  }
}

export const cardDataPayload = {
  expiryYear: '2021',
  expiryMonth: '12',
  cardNumber: '4444333322221111',
  type: 'VISA',
}

export default {
  paymentMethod,
  applePayToken,
}
