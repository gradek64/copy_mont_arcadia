import React from 'react'
import PropTypes from 'prop-types'

import Espot from '../../../../Espot/Espot'

const DDPEspot = ({ hasDDPExpired, getDDPRenewalEspots }) => {
  if (process.browser) {
    getDDPRenewalEspots()
  }
  const identifier = hasDDPExpired
    ? 'ddp_renewal_expired'
    : 'ddp_renewal_expiring'

  return (
    <div data-espot={identifier}>
      <Espot identifier={identifier} isResponsive />
    </div>
  )
}

DDPEspot.propTypes = {
  getDDPRenewalEspots: PropTypes.func.isRequired,
  hasDDPExpired: PropTypes.bool,
}

DDPEspot.defaultProps = {
  hasDDPExpired: false,
}

export default DDPEspot
