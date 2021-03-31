// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Components
import SimpleTotals from '../../../common/SimpleTotals/SimpleTotals'
import PaymentButtonContainer from '../shared/PaymentButtonContainer'
import TermsAndConditions from './TermsAndConditions'
import RecaptchaTermsAndConditions from './RecaptchaTermsAndConditions'
import PayPalSmartButtons from '../PayPal/PayPalSmartButtons'

const PaymentBtnWithTC = ({
  brandName,
  isGuestOrder,
  isDDPStandaloneOrder,
  shippingInfo,
  priceInfo,
  discounts,
  formNames,
  formErrors,
  isGuestRecaptchaEnabled,
  paypalSmartButtons,
}) => {
  return (
    <div className="PaymentBtnWithTC-termsConditionPayBtnWrapper">
      <SimpleTotals
        isDDPStandaloneOrder={isDDPStandaloneOrder}
        shippingInfo={shippingInfo}
        priceInfo={priceInfo}
        discounts={discounts}
      />
      <div className="PaymentBtnWithTC-payNowButtonContainer">
        <TermsAndConditions isGuestOrder={isGuestOrder} brandName={brandName} />
        {paypalSmartButtons ? (
          <PayPalSmartButtons
            brandName={brandName}
            isGuestOrder={isGuestOrder}
          />
        ) : (
          <PaymentButtonContainer
            className="PaymentBtnWithTC-paynow"
            formNames={formNames}
            formErrors={formErrors}
          />
        )}
        {isGuestRecaptchaEnabled && <RecaptchaTermsAndConditions />}
      </div>
    </div>
  )
}

PaymentBtnWithTC.propTypes = {
  isDDPStandaloneOrder: PropTypes.bool.isRequired,
  shippingInfo: PropTypes.object.isRequired,
  priceInfo: PropTypes.object.isRequired,
  discounts: PropTypes.array.isRequired,
  formNames: PropTypes.array.isRequired,
  formErrors: PropTypes.object.isRequired,
  isGuestOrder: PropTypes.bool,
  isGuestRecaptchaEnabled: PropTypes.bool,
  paypalSmartButtons: PropTypes.bool,
}

PaymentBtnWithTC.defaultProps = {
  isGuestOrder: false,
  isGuestRecaptchaEnabled: false,
  paypalSmartButtons: false,
}

export default PaymentBtnWithTC
