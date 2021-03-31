import PropTypes from 'prop-types'

const paymentDetails = PropTypes.shape({
  cardNumberStar: PropTypes.string,
  expiryMonth: PropTypes.string,
  expiryYear: PropTypes.string,
})

const orderDetails = PropTypes.shape({
  amount: PropTypes.string,
  billing: PropTypes.string,
  delivery: PropTypes.string,
})

const combinedPaymentMethod = PropTypes.shape({
  label: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.string),
})

export { orderDetails, combinedPaymentMethod, paymentDetails }
