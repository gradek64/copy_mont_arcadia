import PropTypes from 'prop-types'
import React from 'react'
import Image from '../Image/Image'
import { paymentDetails } from '../../containers/CheckoutV2/shared/PaymentDetails/types'
import { paymentMethod } from '../../../constants/propTypes/paymentMethods'
import { KLARNA, APPLEPAY } from '../../../constants/paymentTypes'

const PaymentMethodPreview = (
  { paymentMethod, paymentDetails, onChangeButtonClick },
  { l }
) => {
  const showLogOntoMsg =
    paymentMethod.value !== KLARNA && paymentMethod.value !== APPLEPAY
  return (
    <div className="PaymentMethodPreviewV1">
      <h3 className="PaymentMethodPreviewV1-heading">{l`Payment details`}</h3>
      <section className="PaymentMethodPreviewV1-body">
        <Image
          className="PaymentMethodPreview-icon"
          src={
            paymentMethod.icon
              ? `/assets/common/images/${paymentMethod.icon}`
              : '/assets/{brandName}/images/credit-card.svg'
          }
        />
        <div className="PaymentMethodPreviewV1-detailsColWrapper">
          {paymentMethod.type === 'OTHER' ? (
            <div className="PaymentMethodPreviewV1-detailsCol">
              <p>{l(paymentMethod.label)}</p>
              <p>
                {showLogOntoMsg &&
                  l`You will be asked to log onto ${
                    paymentMethod.label
                  } to confirm your order`}
              </p>
            </div>
          ) : (
            <div className="PaymentMethodPreviewV1-detailsCol">
              <p className="PaymentMethodPreviewV1-detailsLine">
                {l`Card Number`}: {paymentDetails.cardNumberStar}
              </p>
              <p className="PaymentMethodPreviewV1-detailsLine">
                {l`Expiry Date`}: {paymentDetails.expiryMonth}/{
                  paymentDetails.expiryYear
                }
              </p>
            </div>
          )}
          <div className="PaymentMethodPreviewV1-buttonWrapper">
            <button
              className="Button Button--secondary PaymentMethodPreviewV1-button"
              onClick={onChangeButtonClick}
            >{l`Change`}</button>
          </div>
        </div>
      </section>
    </div>
  )
}

PaymentMethodPreview.propTypes = {
  paymentMethod: paymentMethod.isRequired,
  paymentDetails: paymentDetails.isRequired,
  onChangeButtonClick: PropTypes.func,
}

PaymentMethodPreview.defaultProps = {
  onChangeButtonClick: () => {},
}

PaymentMethodPreview.contextTypes = {
  l: PropTypes.func,
}

export default PaymentMethodPreview
