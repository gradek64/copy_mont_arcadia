import PropTypes from 'prop-types'
import React from 'react'

// components
import ButtonLink from '../../../../common/ButtonLink/ButtonLink'
import Price from '../../../../common/Price/Price'

const GiftCard = ({ cardNumber, amountUsed, onRemove }, { l }) => {
  return (
    <div className="GiftCard">
      <div className="GiftCard-row">
        <span className="GiftCard-number">
          {`${l('Gift card number')}: ${cardNumber}`}
        </span>
        <span className="GiftCard-amountUsed">
          -<Price price={amountUsed} />
        </span>
      </div>
      <ButtonLink className="GiftCard-remove" clickHandler={onRemove}>
        {l`Remove this gift card`}
      </ButtonLink>
    </div>
  )
}

GiftCard.propTypes = {
  cardNumber: PropTypes.string.isRequired,
  amountUsed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onRemove: PropTypes.func,
}

GiftCard.defaultProps = {
  onRemove: () => {},
}

GiftCard.contextTypes = {
  l: PropTypes.func,
}

export default GiftCard
