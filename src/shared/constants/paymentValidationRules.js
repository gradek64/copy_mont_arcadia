const paymentValidationRules = {
  VISA: {
    cardNumber: {
      length: 16,
      message: 'A 16 digit card number is required',
    },
    cvv: {
      length: 3,
      message: 'A 3 digit CVV is required',
      messageV2: '3 digits required',
    },
    expiryDate: 'MM/YY',
    startDate: null,
  },
  MCARD: {
    cardNumber: {
      length: 16,
      message: 'A 16 digit card number is required',
    },
    cvv: {
      length: 3,
      message: 'A 3 digit CVV is required',
      messageV2: '3 digits required',
    },
    expiryDate: 'MM/YY',
    startDate: null,
  },
  AMEX: {
    cardNumber: {
      length: 15,
      message: 'A 15 digit card number is required',
    },
    cvv: {
      length: 4,
      message: 'A 4 digit CVV is required',
      messageV2: '4 digits required',
    },
    expiryDate: 'MM/YY',
    startDate: null,
  },
  SWTCH: {
    cardNumber: {
      length: 16,
      message: 'A 16 digit card number is required',
    },
    cvv: {
      length: 3,
      message: 'A 3 digit CVV is required',
      messageV2: '3 digits required',
    },
    expiryDate: 'MM/YY',
    startDate: null,
  },
  ACCNT: {
    cardNumber: {
      length: 16,
      message: 'A 16 digit card number is required',
    },
    cvv: {
      length: 3,
      message: 'A 3 digit CVV is required',
      messageV2: '3 digits required',
    },
    expiryDate: 'MM/YY',
    startDate: null,
  },
}

export default paymentValidationRules
