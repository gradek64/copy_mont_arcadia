import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ToolTip extends Component {
  static propTypes = {
    children: PropTypes.object,
    arrowCentered: PropTypes.bool,
  }

  render() {
    const { arrowCentered } = this.props

    return (
      <div className="ToolTip">
        <div
          className={`ToolTip-content${arrowCentered ? ' is-centered' : ''}`}
        >
          {this.props.children}
        </div>
      </div>
    )
  }
}
