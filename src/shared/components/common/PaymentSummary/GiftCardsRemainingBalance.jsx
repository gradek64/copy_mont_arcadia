import React from 'react'
import PropTypes from 'prop-types'
import { PrivacyGuard } from '../../../lib'
import { lastFourCharsOf } from '../../../lib/string-utils'
import { GCARD } from '../../../constants/paymentTypes'

const GiftCardsRemainingBalance = ({ payments }, { p, l }) =>
  payments
    .filter((paymentMethod) => paymentMethod.type === GCARD)
    .map((payment, i) => (
      <tr
        key={i} /* eslint-disable-line react/no-array-index-key */
        className="PaymentSummary-tableRow qa-row"
      >
        <td className="PaymentSummary-tableColumn qa-column">
          <PrivacyGuard>
            <span>
              {l`Balance left on gift card`} **** **** ****{' '}
              {lastFourCharsOf(payment.cardNumber)}
            </span>
          </PrivacyGuard>
        </td>
        <td className="PaymentSummary-tableColumn PaymentSummary-tableColumnRight qa-column">
          <PrivacyGuard>
            <span>{p(payment.remainingBalance)}</span>
          </PrivacyGuard>
        </td>
      </tr>
    ))

GiftCardsRemainingBalance.propTypes = {
  payments: PropTypes.array.isRequired,
}

GiftCardsRemainingBalance.contextTypes = {
  l: PropTypes.func,
  p: PropTypes.func,
}

export default GiftCardsRemainingBalance
