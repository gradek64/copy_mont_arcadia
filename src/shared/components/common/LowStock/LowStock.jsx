import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { CSSTransition } from 'react-transition-group'

const LowStock = (
  { activeItem, stockThreshold, isFeaturePdpQuantity },
  context
) => {
  const { l } = context
  const { quantity } = activeItem
  const lowStockValue = stockThreshold === 0 ? 3 : stockThreshold
  const shouldRenderBanner = !(
    !quantity ||
    quantity === 0 ||
    quantity > lowStockValue
  )

  const Banner = (
    <div
      className={cn('LowStock', {
        'LowStock-withQuantity': isFeaturePdpQuantity,
      })}
    >{l`Only ${quantity} left in stock`}</div>
  )

  return (
    <div
      className={cn('LowStock-container ', {
        'LowStock-container-withQuantity': isFeaturePdpQuantity,
        'LowStock-container--show': shouldRenderBanner,
      })}
    >
      {isFeaturePdpQuantity && shouldRenderBanner && Banner}
      {!isFeaturePdpQuantity && (
        <CSSTransition
          in={shouldRenderBanner}
          timeout={600}
          classNames="LowStock-animation"
          unmountOnExit
        >
          {Banner}
        </CSSTransition>
      )}
    </div>
  )
}

LowStock.propTypes = {
  activeItem: PropTypes.object.isRequired,
  stockThreshold: PropTypes.number.isRequired,
  isFeaturePdpQuantity: PropTypes.bool,
}

LowStock.defaultProps = {
  stockThreshold: 3,
  isFeaturePdpQuantity: true,
}

LowStock.contextTypes = {
  l: PropTypes.func.isRequired,
}

export default LowStock
