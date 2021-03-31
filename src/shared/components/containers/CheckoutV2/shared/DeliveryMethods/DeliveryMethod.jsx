import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import { isNil } from 'ramda'
import { getDeliveryPriceText } from '../../../../../lib/checkout-utilities/delivery-options-utils'

const DeliveryMethod = (
  {
    deliveryType,
    selected,
    cost,
    label,
    additionalDescription,
    onChange,
    enabled,
    showDeliveryOptions,
    deliveryText,
  },
  { l, p }
) => {
  const className = classNames('DeliveryMethod', {
    'DeliveryMethod--disabled': !enabled,
    'DeliveryMethod-selected': selected,
    'DeliveryMethod-deliveryOptions': selected && showDeliveryOptions,
  })
  const storeStandardSelected = deliveryType === 'STORE_STANDARD'
  const priceVisible = storeStandardSelected || !isNil(cost)
  const priceLabel = getDeliveryPriceText({ cost }, { l, p })

  return (
    <div className={className}>
      <button
        className="DeliveryMethod-deliveryMethodButton"
        id={`delivery-method-${deliveryType.toLowerCase()}`}
        label={label}
        name="deliveryMethod DeliveryMethod-radioButton"
        onClick={enabled ? onChange : undefined}
      >
        <span className="DeliveryMethod-contentContainer">
          <span className="DeliveryMethod-content">
            <text className="DeliveryMethod-label">{label}</text>
            {additionalDescription && !deliveryText && (
              <text className="DeliveryMethod-description">
                {additionalDescription}
              </text>
            )}
            {deliveryText && (
              <text className="DeliveryMethod-description">{deliveryText}</text>
            )}
          </span>
          {priceVisible && (
            <text className="DeliveryMethod-price">{priceLabel}</text>
          )}
        </span>
      </button>
    </div>
  )
}

DeliveryMethod.propTypes = {
  deliveryType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  cost: PropTypes.string,
  additionalDescription: PropTypes.string,
  onChange: PropTypes.func,
  enabled: PropTypes.bool,
  deliveryText: PropTypes.string,
}

DeliveryMethod.defaultProps = {
  selected: false,
  enabled: true,
  additionalDescription: '',
  onChange: () => {},
}

DeliveryMethod.contextTypes = {
  l: PropTypes.func,
  p: PropTypes.func,
}

export default DeliveryMethod
