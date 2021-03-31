import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ListItemLink extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const { className, children } = this.props
    return <div className={className}>{children}</div>
  }
}
