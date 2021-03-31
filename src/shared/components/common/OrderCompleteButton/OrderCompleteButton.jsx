import React from 'react'
import PropTypes from 'prop-types'

// Components
import Button from '../Button/Button'
import Espot from '../../containers/Espot/Espot'

const OrderCompleteButton = (
  { buttonClickHandler, isDiscoverMoreEnabled, orderError },
  { l }
) => {
  return (
    <div className="OrderCompleteButton">
      <Button
        className="OrderCompleteButton-button"
        clickHandler={buttonClickHandler}
      >
        {orderError ? l`Go to Checkout` : l`Continue Shopping`}
      </Button>
      {isDiscoverMoreEnabled && (
        <div className="OrderCompleteButton-discoverMore">
          <Espot identifier="CONFIRMATION_DISCOVER_MORE" isResponsive />
        </div>
      )}
    </div>
  )
}

OrderCompleteButton.propTypes = {
  buttonClickHandler: PropTypes.func.isRequired,
  isDiscoverMoreEnabled: PropTypes.bool.isRequired,
  orderError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
}

OrderCompleteButton.contextTypes = {
  l: PropTypes.func,
}

export default OrderCompleteButton
