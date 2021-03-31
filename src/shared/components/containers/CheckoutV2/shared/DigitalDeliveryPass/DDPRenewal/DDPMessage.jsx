import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const DDPMessage = ({ isContentCentered, message, children }) => {
  const messageClass = classNames('DDPRenewal-message', {
    'DDPRenewal-message--centered': isContentCentered,
  })
  return (
    <span className={messageClass}>
      {message ? (
        // eslint-disable-next-line react/no-danger
        <span dangerouslySetInnerHTML={{ __html: message }} />
      ) : (
        children || ''
      )}
    </span>
  )
}

DDPMessage.propTypes = {
  children: PropTypes.element,
  message: PropTypes.string,
  isContentCentered: PropTypes.bool,
}

DDPMessage.defaultProps = {
  isContentCentered: false,
}

export default DDPMessage
