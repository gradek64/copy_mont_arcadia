import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Image from '../../../../../common/Image/Image'

const DDPIcon = ({ ddpAdded, ddpLogoSrc }) => {
  const className = classnames({
    'DDPAdded-image': ddpAdded,
    'DDPRenewal-image': !ddpAdded,
  })
  return <Image className={className} src={ddpLogoSrc} />
}

DDPIcon.propTypes = {
  ddpLogoSrc: PropTypes.string.isRequired,
  ddpAdded: PropTypes.bool,
}

DDPIcon.defaultProps = {
  ddpAdded: false,
}

export default DDPIcon
