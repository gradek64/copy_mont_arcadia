import React from 'react'
import PropTypes from 'prop-types'

import Espot from '../../../containers/Espot/Espot'
import SandBox from '../../../containers/SandBox/SandBox'

import espotsDesktopConstants from '../../../../constants/espotsDesktop'
import espotsMobileConstants from '../../../../constants/espotsMobile'
import cmsConsts from '../../../../constants/cmsConsts'

const OrderSummaryEspot = ({
  isMobile,
  isFeatureMobileCheckoutEspotEnabled,
}) => {
  if (isMobile) {
    if (isFeatureMobileCheckoutEspotEnabled) {
      return (
        <div className="row" data-espot={espotsMobileConstants.checkout[0]}>
          <div className="col-12">
            <div className="ProductDetail-cmsContent">
              <SandBox
                cmsPageName={espotsMobileConstants.checkout[0]}
                contentType={cmsConsts.ESPOT_CONTENT_TYPE}
                isInPageContent
                shouldGetContentOnFirstLoad
              />
            </div>
          </div>
        </div>
      )
    }
  } else {
    return (
      <div data-espot={espotsDesktopConstants.orderSummary.discountIntro}>
        <Espot identifier={espotsDesktopConstants.orderSummary.discountIntro} />
      </div>
    )
  }
  return null
}

OrderSummaryEspot.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isFeatureMobileCheckoutEspotEnabled: PropTypes.bool,
}

OrderSummaryEspot.defaultProps = {
  isFeatureMobileCheckoutEspotEnabled: false,
}

export default OrderSummaryEspot
