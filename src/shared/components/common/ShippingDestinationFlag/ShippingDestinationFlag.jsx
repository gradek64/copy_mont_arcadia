import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { camelCaseify } from '../../../lib/string-utils'

const ShippingDestinationFlag = ({ shippingDestination }) => {
  const flagClassNames = classnames('FlagIcons', {
    [`FlagIcons--${camelCaseify(shippingDestination)}`]: shippingDestination,
  })

  return <span className={flagClassNames} />
}

ShippingDestinationFlag.propTypes = {
  shippingDestination: PropTypes.string.isRequired,
}

export default ShippingDestinationFlag
