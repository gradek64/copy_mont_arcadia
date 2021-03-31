import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class FixedHeightPage extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return <div className="FixedHeightPage">{this.props.children}</div>
  }
}
