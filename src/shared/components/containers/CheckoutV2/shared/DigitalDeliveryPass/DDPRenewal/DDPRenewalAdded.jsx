import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getDDPEndDate } from '../../../../../../lib/dates'

const DDPRenewalAdded = ({
  isMyAccount,
  isMyAccountDetail,
  productName,
  DDPIcon,
  ddpEndDate,
  l,
}) => {
  const newEndDate = getDDPEndDate(ddpEndDate)
  const ddpAddedOuterClass = classNames('DDPAdded-outer', {
    'DDPAdded-outer--myaccount': isMyAccount,
    'DDPAdded-outer--mydetails': isMyAccountDetail,
  })
  const ddpAddedClass = classNames('DDPAdded', {
    'DDPAdded--myaccount': isMyAccount,
    'DDPAdded--mydetails': isMyAccountDetail,
  })
  const ddpAddedMessage =
    isMyAccount || isMyAccountDetail
      ? l`Complete your purchase to enjoy free UK delivery until ${newEndDate}`
      : l`DDP Added Expiry Msg ${newEndDate}`

  const ddpAddedTitle =
    isMyAccount || isMyAccountDetail
      ? l`DDP Added Msg Title My Account ${productName}`
      : l`DDP Added Msg Title ${productName}`

  return (
    <div className={ddpAddedOuterClass}>
      {isMyAccountDetail && (
        <div className="DDPAdded-withOuterDDPTitleAndSeparator">
          <h4 className="DDPAdded-withOuterDDPTitleAndSeparatorTitle">
            {productName}
          </h4>
        </div>
      )}
      <div className={ddpAddedClass}>
        <div className="DDPAdded-icon">{DDPIcon}</div>
        <div className="DDPAdded-container">
          <div className="DDPAdded-titleContainer">
            <h3 className="DDPAdded-title">{ddpAddedTitle}</h3>
          </div>
          <div className="DDPAdded-messageContainer">
            <span className="DDPAdded-message">{ddpAddedMessage}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

DDPRenewalAdded.propTypes = {
  l: PropTypes.func.isRequired,
  DDPIcon: PropTypes.element.isRequired,
  productName: PropTypes.string.isRequired,
  ddpEndDate: PropTypes.string,
  isMyAccount: PropTypes.bool,
  isMyAccountDetail: PropTypes.bool,
}

DDPRenewalAdded.defaultProps = {
  ddpEndDate: '',
  isContentCentered: false,
  isMyAccount: false,
  isMyAccountDetail: false,
}

export default DDPRenewalAdded
