import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { numbers } from '../../../constants/customerCareNumbers'

const mapStateToProps = (state) => ({
  brandCode: state.config.brandCode,
})

const CustomerServiceNumber = ({ brandCode }) => {
  const brandNumbers = numbers[brandCode]
  return <a href={`tel:+44 ${brandNumbers.uk}`}>{`(+44)${brandNumbers.uk}`}</a>
}

CustomerServiceNumber.propTypes = {
  brandCode: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(CustomerServiceNumber)
