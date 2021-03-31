import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

const CheckoutPrimaryTitle = ({ title, isAugmented }) => {
  const componentName = 'CheckoutPrimaryTitle'
  const className = classNames(componentName, {
    [`${componentName}-augmented`]: isAugmented,
  })
  return <div className={className}>{title}</div>
}

CheckoutPrimaryTitle.propTypes = {
  title: PropTypes.string.isRequired,
  isAugmented: PropTypes.bool,
}

CheckoutPrimaryTitle.defaultProps = {
  isAugmented: false,
}

export default CheckoutPrimaryTitle
