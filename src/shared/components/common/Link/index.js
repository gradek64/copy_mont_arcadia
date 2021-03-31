import React from 'react'
import PropTypes from 'prop-types'
import { Link as RRLink } from 'react-router'

/* eslint-disable jsx-a11y/anchor-has-content */
export default function Link({
  isExternal = false,
  to,
  onlyActiveOnIndex = false,
  ...restProps
}) {
  if (isExternal) return <a {...restProps} href={to} />

  return <RRLink {...restProps} to={to} onlyActiveOnIndex={onlyActiveOnIndex} />
}

Link.propTypes = {
  ...RRLink.propTypes,
  children: PropTypes.node.isRequired,
  isExternal: PropTypes.bool,
  onlyActiveOnIndex: PropTypes.bool,
}
