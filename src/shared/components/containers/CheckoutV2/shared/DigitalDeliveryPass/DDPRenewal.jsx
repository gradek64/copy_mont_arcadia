import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  getDDPDefaultName,
  ddpEndDate,
  isRenewingDDP,
  showDDPRenewal,
  showDDPSavings,
  hasDDPExpired,
  ddpSavingsValue,
  ddpExpressDeliveryPrice,
  ddpLogoSrc,
  ddpAddedLogoSrc,
  showActiveDDP,
  ddpActiveLogoSrc,
  showDDPRenewalWithinDefaultExpiringBoundaries,
} from '../../../../../selectors/ddpSelectors'
import {
  getDDPDefaultSku,
  getDDPDefaultSkuPrice,
} from '../../../../../selectors/siteOptionsSelectors'
import { getStoreCode } from '../../../../../selectors/configSelectors'

import DDPRenewalAdded from '../DigitalDeliveryPass/DDPRenewal/DDPRenewalAdded'
import DDPRenewalExpiry from '../DigitalDeliveryPass/DDPRenewalExpiry'
import DDPIcon from '../DigitalDeliveryPass/DDPRenewal/DDPIcon'
import DDPRenewalActive from '../DigitalDeliveryPass/DDPRenewalActive'

// Actions
import { addDDPToBag } from '../../../../../actions/common/ddpActions'
import {
  getDDPRenewalEspots,
  getDDPTermsAndConditions,
} from '../../../../../actions/common/espotActions'
import { showTAndCModal } from '../../../../../actions/common/modalActions'

const DDPRenewal = (
  {
    // props
    showDDPRenewal,
    isRenewingDDP,
    ddpProductName,
    getDDPDefaultSku,
    ddpEndDate,
    showDDPSavings,
    hasDDPExpired,
    ddpSavingsValue,
    ddpPrice,
    ddpExpressDeliveryPrice,
    ddpLogoSrc,
    ddpAddedLogoSrc,
    ddpActiveLogoSrc,
    withMoreDetailsLink,
    storeCode,
    withOuterDDPTitleAndSeparator,
    showActiveDDP,
    isMyAccount,
    isMyAccountDetail,
    showDDPRenewalWithinDefaultExpiringBoundaries,
    // Actions
    addToBag,
    getDDPRenewalEspots,
    showTAndCModal,
    getDDPTermsAndConditions,
  },
  { l, p }
) => {
  getDDPTermsAndConditions()

  const canShowActiveDDP = !isRenewingDDP && showActiveDDP && isMyAccountDetail

  const renderDDPRenewalExpiry = isMyAccount
    ? showDDPRenewalWithinDefaultExpiringBoundaries // Shows the DDPRenewalExpiry component 30 days prior and 30 days after expiry.
    : showDDPRenewal // Shows the DDPRenewalExpiry component 30 days prior and indefinitely after expiry.

  if (renderDDPRenewalExpiry) {
    return (
      <DDPRenewalExpiry
        isMyAccount={isMyAccount}
        isMyAccountDetail={isMyAccountDetail}
        ddpSku={getDDPDefaultSku.sku}
        ddpProductName={ddpProductName}
        ddpEndDate={ddpEndDate}
        showDDPSavings={showDDPSavings}
        hasDDPExpired={hasDDPExpired}
        ddpSavingsValue={p(ddpSavingsValue)}
        ddpFormattedPrice={p(ddpPrice)}
        ddpExpressDeliveryPrice={p(ddpExpressDeliveryPrice)}
        addToBag={addToBag}
        getDDPRenewalEspots={getDDPRenewalEspots}
        DDPIcon={<DDPIcon ddpLogoSrc={ddpLogoSrc} />}
        withMoreDetailsLink={withMoreDetailsLink}
        storeCode={storeCode}
        withOuterDDPTitleAndSeparator={withOuterDDPTitleAndSeparator}
        openModal={showTAndCModal}
        l={l}
      />
    )
  } else if (isRenewingDDP) {
    return (
      <DDPRenewalAdded
        isMyAccount={isMyAccount}
        isMyAccountDetail={isMyAccountDetail}
        productName={ddpProductName}
        DDPIcon={<DDPIcon ddpAdded ddpLogoSrc={ddpAddedLogoSrc} />}
        ddpEndDate={ddpEndDate}
        l={l}
      />
    )
  } else if (canShowActiveDDP) {
    return (
      <DDPRenewalActive
        ddpSku={getDDPDefaultSku.sku}
        ddpProductName={ddpProductName}
        ddpEndDate={ddpEndDate}
        showDDPSavings={showDDPSavings}
        hasDDPExpired={hasDDPExpired}
        ddpSavingsValue={p(ddpSavingsValue)}
        ddpFormattedPrice={p(ddpPrice)}
        ddpExpressDeliveryPrice={p(ddpExpressDeliveryPrice)}
        addToBag={addToBag}
        getDDPRenewalEspots={getDDPRenewalEspots}
        DDPIcon={<DDPIcon ddpLogoSrc={ddpActiveLogoSrc} />}
        isContentCentered={isMyAccountDetail}
        storeCode={storeCode}
        withOuterDDPTitleAndSeparator={withOuterDDPTitleAndSeparator}
        isMyAccount={isMyAccount}
        isMyAccountDetail={isMyAccountDetail}
        l={l}
      />
    )
  }
  return null
}

DDPRenewal.propTypes = {
  // Properties
  showDDPRenewal: PropTypes.bool.isRequired,
  isRenewingDDP: PropTypes.bool.isRequired,
  ddpProductName: PropTypes.string.isRequired,
  getDDPDefaultSku: PropTypes.shape({
    sku: PropTypes.string.isRequired,
    default: PropTypes.bool.isRequired,
    unitPrice: PropTypes.number.isRequired,
    catentryId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timePeriod: PropTypes.string.isRequired,
  }).isRequired,
  ddpEndDate: PropTypes.string.isRequired,
  showDDPSavings: PropTypes.bool.isRequired,
  hasDDPExpired: PropTypes.bool.isRequired,
  ddpSavingsValue: PropTypes.number.isRequired,
  ddpPrice: PropTypes.number.isRequired,
  ddpExpressDeliveryPrice: PropTypes.number.isRequired,
  storeCode: PropTypes.string.isRequired,
  withMoreDetailsLink: PropTypes.bool,
  withOuterDDPTitleAndSeparator: PropTypes.bool,
  ddpLogoSrc: PropTypes.string.isRequired,
  ddpAddedLogoSrc: PropTypes.string.isRequired,
  ddpActiveLogoSrc: PropTypes.string.isRequired,
  showDDPRenewalWithinDefaultExpiringBoundaries: PropTypes.bool.isRequired,
  isMyAccount: PropTypes.bool,
  isMyAccountDetail: PropTypes.bool,

  // Actions
  addToBag: PropTypes.func.isRequired,
  getDDPRenewalEspots: PropTypes.func.isRequired,
  showTAndCModal: PropTypes.func.isRequired,
  getDDPTermsAndConditions: PropTypes.func.isRequired,
}

DDPRenewal.defaultProps = {
  ddpEndDate: '', // if DDP has expired, no end date is provided
  withMoreDetailsLink: false,
  withOuterDDPTitleAndSeparator: false,
  isMyAccount: false,
  isMyAccountDetail: false,
}

DDPRenewal.contextTypes = {
  l: PropTypes.func.isRequired,
  p: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  showDDPRenewal: showDDPRenewal(state),
  isRenewingDDP: isRenewingDDP(state),
  getDDPDefaultSku: getDDPDefaultSku(state),
  ddpEndDate: ddpEndDate(state),
  showDDPSavings: showDDPSavings(state),
  hasDDPExpired: hasDDPExpired(state),
  ddpSavingsValue: ddpSavingsValue(state),
  ddpPrice: getDDPDefaultSkuPrice(state),
  ddpExpressDeliveryPrice: ddpExpressDeliveryPrice(state),
  ddpLogoSrc: ddpLogoSrc(state),
  ddpAddedLogoSrc: ddpAddedLogoSrc(state),
  ddpActiveLogoSrc: ddpActiveLogoSrc(state),
  ddpProductName: getDDPDefaultName(state),
  storeCode: getStoreCode(state),
  showActiveDDP: showActiveDDP(state),
  showDDPRenewalWithinDefaultExpiringBoundaries: showDDPRenewalWithinDefaultExpiringBoundaries(
    state
  ),
})

const mapDispatchToProps = {
  addToBag: addDDPToBag,
  getDDPRenewalEspots,
  showTAndCModal,
  getDDPTermsAndConditions,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DDPRenewal)
