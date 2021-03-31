import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import DDPMessage from './DDPRenewal/DDPMessage'
import DDPTitle from './DDPRenewal/DDPHeaderContent'
import DDPMoreDetailsLink from './DDPRenewal/DDPMoreDetailsLink'

const DDPRenewalActive = ({
  // Properties
  ddpProductName,
  ddpEndDate,
  showDDPSavings,
  ddpSavingsValue,
  ddpExpressDeliveryPrice,
  isContentCentered,
  storeCode,
  withOuterDDPTitleAndSeparator,
  isMyAccount,
  isMyAccountDetail,
  // Components
  DDPIcon,
  // functions
  l,
}) => {
  // Don't show total savings to users who have saved less
  // than £5.00 (Logic in selector), instead show express delivery
  // cost
  const savingsMessage = showDDPSavings
    ? l`DDP Savings Msg ${ddpSavingsValue}`
    : l`DDP Express Saving ${ddpExpressDeliveryPrice}`

  const moreDetailsClass = classNames('DDPRenewal-moreDetails', {
    'DDPRenewal-moreDetails--centered': isContentCentered,
  })

  const ddpRenewalClass = classNames('DDPRenewal', 'DDPRenewal-active', {
    'DDPRenewal-myAccountActive': isMyAccount,
    'DDPRenewal-myAccountDetailsActive': isMyAccountDetail,
  })

  return (
    <div className={ddpRenewalClass}>
      {withOuterDDPTitleAndSeparator && (
        <div className="DDPRenewal-withOuterDDPTitleAndSeparator">
          <p className="DDPRenewal-withOuterDDPTitleAndSeparatorTitle">
            {ddpProductName}
          </p>
        </div>
      )}
      <div className="DDPRenewal-container">
        <DDPTitle
          isContentCentered={isContentCentered}
          headerText={`Your ${ddpProductName} is active.`}
          DDPIcon={DDPIcon}
        />
        <div className="DDPRenewal-bodyContainer">
          <div className="DDPRenewal-messageContainer">
            <DDPMessage
              isContentCentered={isContentCentered}
              message={savingsMessage}
            />
            <DDPMessage
              isContentCentered={isContentCentered}
              message={l`Expires on the  ${ddpEndDate}`}
            />
          </div>
          <span className={moreDetailsClass}>
            <DDPMoreDetailsLink storeCode={storeCode} />
          </span>
        </div>
      </div>
    </div>
  )
}

DDPRenewalActive.propTypes = {
  // Properties
  ddpProductName: PropTypes.string.isRequired,
  showDDPSavings: PropTypes.bool.isRequired,
  ddpSavingsValue: PropTypes.string.isRequired,
  ddpExpressDeliveryPrice: PropTypes.string.isRequired,
  ddpEndDate: PropTypes.string.isRequired,
  storeCode: PropTypes.string.isRequired,
  withOuterDDPTitleAndSeparator: PropTypes.bool,
  isContentCentered: PropTypes.bool,
  isMyAccount: PropTypes.bool,
  isMyAccountDetail: PropTypes.bool,
  // Components
  DDPIcon: PropTypes.element.isRequired,

  // Actions
  l: PropTypes.func.isRequired,
}

DDPRenewalActive.defaultProps = {
  isContentCentered: false,
  withOuterDDPTitleAndSeparator: false,
  isMyAccount: false,
  isMyAccountDetail: false,
}

export default DDPRenewalActive
