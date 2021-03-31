import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const DDPHeaderContent = ({ isContentCentered, headerText, DDPIcon }) => {
  const titleContainerClass = classNames('DDPRenewal-titleContainer', {
    'DDPRenewal-titleContainer--centered': isContentCentered,
  })

  return (
    <div className={titleContainerClass}>
      {DDPIcon}
      <h3 className="DDPRenewal-title">{headerText}</h3>
    </div>
  )
}

DDPHeaderContent.propType = {
  headerText: PropTypes.string.isRequired,
  DDPIcon: PropTypes.element.isRequired,
  isContentCentered: PropTypes.bool,
}

DDPHeaderContent.defaultProps = {
  isContentCentered: false,
}

export default DDPHeaderContent
