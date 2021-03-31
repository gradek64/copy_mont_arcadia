// Imports
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Components
import Button from '../../../common/Button/Button'
import OrderProductNotification from '../../../common/OrderProductNotification/OrderProductNotification'

const nextButtonContainerClass = (isOutOfStock, pathname, isMobile) =>
  classnames({
    'DeliveryCTAProceed-nextButtonContainer': pathname === '/checkout/delivery',
    'DeliveryCTAProceed-nextButtonContainer--hasError':
      isOutOfStock && isMobile && pathname === '/checkout/delivery',
  })

const nextButton = (isMobile) =>
  classnames(
    {
      'DeliveryCTAProceed-nextButton': isMobile,
    },
    {
      'DeliveryCTAProceed-nextButton--desktop': !isMobile,
    }
  )

const DeliveryCTAProceed = (props, { l }) => {
  const {
    nextButtonHidden,
    isActive,
    isDisabled,
    nextHandler,
    isMobile,
    isOutOfStock,
    pathname,
  } = props

  return (
    !nextButtonHidden && (
      <div
        className={nextButtonContainerClass(isOutOfStock, pathname, isMobile)}
      >
        <Button
          className={nextButton(isMobile)}
          clickHandler={nextHandler}
          isActive={isActive}
          isDisabled={isDisabled}
        >
          {l`Proceed to Payment`}
        </Button>
        {isOutOfStock && (
          <OrderProductNotification
            boldMessage={l`Some items are no longer available.`}
            message={l`Please review your bag.`}
            hasError
          />
        )}
      </div>
    )
  )
}

DeliveryCTAProceed.contextTypes = {
  l: PropTypes.func,
}

export default DeliveryCTAProceed
