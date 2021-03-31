import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import DDPMessage from './DDPRenewal/DDPMessage'
import DDPEspot from './DDPRenewal/DDPEspot'
import DDPTitle from './DDPRenewal/DDPHeaderContent'
import DDPRenewalCta from './DDPRenewal/DDPRenewalCta'
import DDPMoreDetailsLink from './DDPRenewal/DDPMoreDetailsLink'
import DDPTermsAndConditions from './DDPRenewal/DDPTermsAndConditions'

import { getDDPEndDate } from '../../../../../lib/dates'

const DDPRenewalExpiry = ({
  // Properties
  ddpSku,
  ddpProductName,
  ddpEndDate,
  showDDPSavings,
  hasDDPExpired,
  ddpSavingsValue,
  ddpFormattedPrice,
  ddpExpressDeliveryPrice,
  withMoreDetailsLink,
  storeCode,
  withOuterDDPTitleAndSeparator,
  isMyAccount,
  isMyAccountDetail,
  // Components
  DDPIcon,

  // Functions / Actions
  addToBag,
  getDDPRenewalEspots,
  openModal,
  l,
}) => {
  const isContentCentered = isMyAccount || isMyAccountDetail

  // new end date is one year in the future
  const newEndDate = getDDPEndDate(ddpEndDate)

  // Differentiate text between for users
  // where ddp has expired and where it hasn't
  const headerText = hasDDPExpired
    ? l`DDP expired title ${ddpProductName}`
    : l`DDP expiring title ${ddpProductName} ${ddpEndDate}`
  const continueSavingMessage = hasDDPExpired
    ? l`DDP Renewal Msg ${newEndDate}`
    : l`DDP Extend Msg ${newEndDate}`
  const buttonText = hasDDPExpired
    ? l`DDP Button Renew ${ddpFormattedPrice}`
    : l`DDP Button Extend ${ddpFormattedPrice}`

  // Don't show total savings to users who have saved less
  // than £5.00 (Logic in selector), instead show express delivery
  // cost
  const savingsMessage = showDDPSavings
    ? l`DDP Savings Msg ${ddpSavingsValue}`
    : l`DDP Express Saving ${ddpExpressDeliveryPrice}`

  const containerClass = classNames('DDPRenewal-container', {
    'DDPRenewal-container--centered': isContentCentered,
  })

  const termsClass = classNames('DDPRenewal-terms', {
    'DDPRenewal-terms--centered': isContentCentered,
  })

  const moreDetailsClass = classNames('DDPRenewal-moreDetails', {
    'DDPRenewal-moreDetails--centered': isContentCentered,
  })

  const ddpRenewalClass = classNames('DDPRenewal', {
    'DDPRenewal-myAccountExpiry': isMyAccount,
    'DDPRenewal-myAccountDetailsExpiry': isMyAccountDetail,
  })

  const footerSectionLinkClass = classNames({
    [termsClass]: !withMoreDetailsLink,
    [moreDetailsClass]: withMoreDetailsLink,
  })

  const renderTermsLink = () => {
    if (withMoreDetailsLink) return <DDPMoreDetailsLink storeCode={storeCode} />
    return (
      <DDPTermsAndConditions
        buttonText={l`Terms & Conditions`}
        openModal={openModal}
      />
    )
  }

  return (
    <div className={ddpRenewalClass}>
      {withOuterDDPTitleAndSeparator && (
        <div className="DDPRenewal-withOuterDDPTitleAndSeparator">
          <p className="DDPRenewal-withOuterDDPTitleAndSeparatorTitle">
            {ddpProductName}
          </p>
        </div>
      )}
      <div className={containerClass}>
        <DDPTitle
          isContentCentered={isContentCentered}
          headerText={headerText}
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
              message={continueSavingMessage}
            />
            <DDPMessage isContentCentered={isContentCentered}>
              <DDPEspot
                hasDDPExpired={hasDDPExpired}
                getDDPRenewalEspots={getDDPRenewalEspots}
              />
            </DDPMessage>
            <DDPRenewalCta
              isContentCentered={isContentCentered}
              buttonText={buttonText}
              clickHandler={() => addToBag(ddpSku)}
            />
          </div>
          <span className={footerSectionLinkClass}>{renderTermsLink()}</span>
        </div>
      </div>
    </div>
  )
}

DDPRenewalExpiry.propTypes = {
  // Properties
  ddpSku: PropTypes.string.isRequired,
  ddpProductName: PropTypes.string.isRequired,
  showDDPSavings: PropTypes.bool.isRequired,
  hasDDPExpired: PropTypes.bool.isRequired,
  ddpSavingsValue: PropTypes.string.isRequired,
  ddpFormattedPrice: PropTypes.string.isRequired,
  ddpExpressDeliveryPrice: PropTypes.string.isRequired,
  ddpEndDate: PropTypes.string,
  storeCode: PropTypes.string.isRequired,
  withMoreDetailsLink: PropTypes.bool,
  withOuterDDPTitleAndSeparator: PropTypes.bool,
  isMyAccount: PropTypes.bool,
  isMyAccountDetail: PropTypes.bool,

  // Components
  DDPIcon: PropTypes.element.isRequired,

  // Actions
  addToBag: PropTypes.func.isRequired,
  getDDPRenewalEspots: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,

  // Other
  l: PropTypes.func.isRequired,
}

DDPRenewalExpiry.defaultProps = {
  ddpEndDate: '', // if DDP has expired, no end date is provided
  withMoreDetailsLink: false,
  withOuterDDPTitleAndSeparator: false,
  isMyAccount: false,
  isMyAccountDetail: false,
}

export default DDPRenewalExpiry
