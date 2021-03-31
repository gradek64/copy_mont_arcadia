import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  sendAnalyticsDisplayEvent,
  GTM_EVENT,
  GTM_TRIGGER,
} from '../../../analytics'
import { toggleMiniBag } from '../../../../shared/actions/common/shoppingBagActions'

const mapStateToProps = (state) => ({
  itemsCount: state.shoppingBag.totalItems,
  pageType: state.pageType,
})

const mapDispatchToProps = {
  onClick: toggleMiniBag,
  sendAnalyticsDisplayEvent,
}

const ShoppingCart = ({
  label,
  itemsCount,
  modifier,
  className,
  onClick,
  sendAnalyticsDisplayEvent,
  pageType,
}) => {
  const classNames = classnames('ShoppingCart', className, {
    [`ShoppingCart--${modifier}`]: modifier,
    'is-empty': !itemsCount,
  })

  return (
    <button
      className={classNames}
      onClick={() => {
        onClick()
        sendAnalyticsDisplayEvent(
          {
            bagDrawerTrigger: GTM_TRIGGER.BAG_ICON_CLICKED,
            openFrom: pageType,
          },
          GTM_EVENT.BAG_DRAWER_DISPLAYED
        )
      }}
    >
      {label && <span className="ShoppingCart-label">{label}</span>}
      <span className="ShoppingCart-icon">
        {itemsCount > 0 && (
          <span className="ShoppingCart-itemsCount">{itemsCount}</span>
        )}
      </span>
    </button>
  )
}

ShoppingCart.propTypes = {
  label: PropTypes.string,
  itemsCount: PropTypes.number,
  modifier: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  sendAnalyticsDisplayEvent: PropTypes.func.isRequired,
  pageType: PropTypes.string,
}

ShoppingCart.defaultProps = {
  label: undefined,
  itemsCount: 0,
  modifier: undefined,
  className: '',
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoppingCart)

export { ShoppingCart as WrappedShoppingCart }
