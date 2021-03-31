import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

if (process.browser) require('./WishlistLimitInfo.css')

const WishlistLimitInfo = ({ withMarginTop }, { l }) => {
  const outerClassName = cn('WishlistLimitInfo-outerWrapper', {
    'WishlistLimitInfo-outerWrapper--withMarginTop': withMarginTop,
  })
  return (
    <div className={outerClassName}>
      <div className="WishlistLimitInfo-container">
        <p className="WishlistLimitInfo-text">
          {l`You have reached the limit of products allowed in your Wishlist. To add more products, please delete items from your list.`}
        </p>
      </div>
    </div>
  )
}

WishlistLimitInfo.propTypes = {
  withMarginTop: PropTypes.bool,
}

WishlistLimitInfo.defaultProps = {
  withMarginTop: false,
}

WishlistLimitInfo.contextTypes = {
  l: PropTypes.func,
}

export default WishlistLimitInfo
