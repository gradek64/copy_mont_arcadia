import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const WishListIcon = ({ isSelected, isAdding, modifier, id }) => (
  <i
    id={id}
    className={cn('WishListIcon', {
      'is-selected': isSelected,
      'is-adding': isAdding,
      [`WishListIcon--${modifier}`]: modifier,
    })}
  />
)

WishListIcon.propTypes = {
  isSelected: PropTypes.bool,
  isAdding: PropTypes.bool,
  modifier: PropTypes.oneOf(['plp', 'pdp', 'quickview', 'bundle', 'minibag']),
}

WishListIcon.defaultProps = {
  isSelected: false,
  isAdding: false,
}

export default WishListIcon
