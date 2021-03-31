import PropTypes from 'prop-types'

export const paymentMethod = PropTypes.shape({
  value: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
  validation: PropTypes.shape({
    cardNumber: PropTypes.shape({
      length: PropTypes.number.isRequired,
      message: PropTypes.string,
    }),
    cvv: PropTypes.shape({
      length: PropTypes.number.isRequired,
      message: PropTypes.string,
    }),
    expiryDate: PropTypes.string,
    startDate: PropTypes.string,
  }),
  billingCountry: PropTypes.arrayOf(PropTypes.string),
  deliveryCountry: PropTypes.arrayOf(PropTypes.string),
})
