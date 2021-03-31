import React from 'react'
import PropTypes from 'prop-types'

// Components
import CheckoutBagSide from '../CheckoutBagSide/CheckoutBagSide'
import SimpleTotals from '../SimpleTotals/SimpleTotals'
import OrderProducts from '../OrderProducts/OrderProducts'

const OrderCompleteBasket = (
  {
    discountInfo,
    isDDPStandaloneOrderCompleted,
    isMobile,
    orderCompleted,
    orderSubtotal,
  },
  { l }
) => {
  const {
    deliveryMethod,
    deliveryCost,
    deliveryPrice,
    orderLines,
  } = orderCompleted

  const shippingPrice = deliveryCost || deliveryPrice
  const shippingInfo = {
    cost: shippingPrice,
    label: deliveryMethod,
  }
  const priceInfo = {
    subTotal: orderSubtotal,
  }

  return (
    <div className="OrderCompleteBasket">
      {isMobile ? (
        <div>
          <div className="OrderCompleteBasket-subheader">
            <h3 className="OrderCompleteBasket-subheaderTitle">{l`Your order`}</h3>
          </div>
          <OrderProducts
            canModify={false}
            products={orderLines}
            hasDiscountText
          />
          <SimpleTotals
            className="OrderCompleteBasket-totals"
            shippingInfo={shippingInfo}
            priceInfo={priceInfo}
            discounts={discountInfo}
            isDDPStandaloneOrder={isDDPStandaloneOrderCompleted}
          />
        </div>
      ) : (
        <div className="OrderCompleteBasket-myBag sessioncamhidetext">
          <CheckoutBagSide
            showDiscounts
            canModify={false}
            orderProducts={orderLines}
          />
        </div>
      )}
    </div>
  )
}

OrderCompleteBasket.propTypes = {
  isDDPStandaloneOrderCompleted: PropTypes.bool.isRequired,
  orderCompleted: PropTypes.object.isRequired,
  orderSubtotal: PropTypes.string.isRequired,
  discountInfo: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ).isRequired,
  isMobile: PropTypes.bool.isRequired,
}

OrderCompleteBasket.contextTypes = {
  l: PropTypes.func,
}

export default OrderCompleteBasket
