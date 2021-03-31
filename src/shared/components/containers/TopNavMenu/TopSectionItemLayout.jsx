import React from 'react'
import PropTypes from 'prop-types'

const TopSectionItemLayout = ({ leftIcon, text, rightIcon, expanded }) => {
  const borderBottomModifierClass = expanded
    ? 'ListItemLink--noBottomBorder'
    : ''
  return (
    <div
      className={`TopSectionItemLayout ListItemLink is-active ${borderBottomModifierClass}`}
    >
      <div className="TopSectionItemLayout-leftIconWrapper">{leftIcon}</div>
      <div className="TopSectionItemLayout-textWrapper">{text}</div>
      {!!rightIcon && rightIcon}
    </div>
  )
}

TopSectionItemLayout.propTypes = {
  leftIcon: PropTypes.object.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  rightIcon: PropTypes.object,
  expanded: PropTypes.bool,
}

TopSectionItemLayout.defaultProps = {
  rightIcon: undefined,
  expanded: false,
}

export default TopSectionItemLayout
