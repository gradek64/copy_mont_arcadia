const paymentValidationSchema = {
  STANDARD: {
    cardNumber: {
      length: 16,
      message: 'A 16 digit card number is required',
    },
    cvv: {
      length: 3,
      message: '3 digits required',
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
      message: '4 digits required',
    },
    expiryDate: 'MM/YY',
    startDate: null,
  },
}

export default paymentValidationSchema
