import React from 'react'
import PropTypes from 'prop-types'
import { PrivacyGuard } from '../../../lib/privacy-guard'
import { lastFourCharsOf } from '../../../lib/string-utils'
import { GCARD } from '../../../../shared/constants/paymentTypes'
import GiftCardsRemainingBalance from './GiftCardsRemainingBalance'

export default function PaymentSummary(props, context) {
  const { totalOrderPrice, payments } = props
  const { l, p } = context
  const paymentHasGiftCards = payments.some(
    (paymentMethod) => paymentMethod.type === GCARD
  )
  return (
    <article className="PaymentSummary">
      <header className="PaymentSummary-header">
        <h1 className="PaymentSummary-headerText qa-heading">{l`Payment details`}</h1>
      </header>
      <div className="PaymentSummary-body">
        <table className="PaymentSummary-table">
          <thead className="PaymentSummary-tableHead qa-thead">
            <tr className="PaymentSummary-tableRow qa-row PaymentSummary-totalRow">
              <th className="PaymentSummary-tableColumn qa-column">{l`Total Cost`}</th>
              <th className="PaymentSummary-tableColumn PaymentSummary-tableColumnRight PaymentSummary-totalPrice qa-column">
                {p(totalOrderPrice)}
              </th>
            </tr>
          </thead>
          <tbody className="qa-tbody">
            {payments.map((payment, i) => (
              <tr
                key={i} // eslint-disable-line react/no-array-index-key
                className="PaymentSummary-tableRow qa-row"
              >
                <td className="PaymentSummary-tableColumn qa-column">
                  <PrivacyGuard>
                    <span>{payment.method}</span>
                  </PrivacyGuard>
                  {payment.isCardType && (
                    <PrivacyGuard>
                      <span>
                        **** **** **** {lastFourCharsOf(payment.cardNumber)}
                      </span>
                    </PrivacyGuard>
                  )}
                </td>
                <td className="PaymentSummary-tableColumn PaymentSummary-tableColumnRight qa-column">
                  <PrivacyGuard>
                    <span>
                      {p(payment.priceAfterDiscount || payment.price)}
                    </span>
                  </PrivacyGuard>
                </td>
              </tr>
            ))}
            {paymentHasGiftCards && (
              <GiftCardsRemainingBalance payments={payments} />
            )}
          </tbody>
        </table>
      </div>
    </article>
  )
}

PaymentSummary.contextTypes = {
  l: PropTypes.func,
  p: PropTypes.func,
}

PaymentSummary.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string,
      cardNumber: PropTypes.string,
      price: PropTypes.string,
      type: PropTypes.string.isRequired,
    })
  ),
  totalOrderPrice: PropTypes.string,
}
