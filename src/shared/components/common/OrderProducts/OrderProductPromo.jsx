import PropTypes from 'prop-types'
import React from 'react'

export const DiscountText = ({ discountText, hasDiscountText }) => {
  if (!discountText || !hasDiscountText) return null

  return <p className={'OrderProductPromo-link'}>{discountText}</p>
}

DiscountText.propTypes = {
  discountText: PropTypes.string,
  hasDiscountText: PropTypes.bool,
}

const OrderProductPromo = (props) => {
  const { promoId = '', promoTitle = '', discountText = '' } = props.product
  const { hasDiscountText } = props

  // TODO: On legacy desktop, unfulfilled promotions have a link to a PLP for that promotion.
  // There is no routing in Monty currently to allow this.
  // A PLP response for a promo can be obtained CoreAPI using a promoId, so a route should be made on Monty
  // and this component updated to link to that route.

  if (promoTitle && promoId && discountText) {
    // Unfulfilled promotion: Show information about promo and the promo title
    // Later: Make a link to the promo PLP page
    return (
      <div className={'OrderProductPromo OrderProductPromo--eligible'}>
        <DiscountText
          discountText={discountText}
          hasDiscountText={hasDiscountText}
        />
        <a className={'OrderProductPromo-link'}>{promoTitle}</a>
      </div>
    )
  } else if (discountText) {
    // Fulfilled promotion: Just show promo title
    return (
      <div className={'OrderProductPromo OrderProductPromo--applied'}>
        <DiscountText
          discountText={discountText}
          hasDiscountText={hasDiscountText}
        />
        <a className={'OrderProductPromo-link'}>{promoTitle}</a>
      </div>
    )
    // eslint-disable-next-line no-else-return
  } else {
    return null
  }
}

OrderProductPromo.propTypes = {
  product: PropTypes.shape({
    promotionDisplayURL: PropTypes.string,
    promoTitle: PropTypes.string,
    discountText: PropTypes.string,
  }),
}

export default OrderProductPromo
