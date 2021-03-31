import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

function CheckoutTitle({ children, separator, subheader }) {
  const componentName = 'CheckoutTitle'
  const className = classNames(componentName, {
    [`${componentName}--separator`]: separator,
    [`${componentName}--subheader`]: subheader,
  })
  return <div className={className}>{children}</div>
}

CheckoutTitle.propTypes = {
  children: PropTypes.any,
  separator: PropTypes.bool,
}

export default CheckoutTitle
