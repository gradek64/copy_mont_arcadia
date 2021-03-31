import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

@connect((state) => ({
  montyVisualIndicatorVisible: state.debug.montyVisualIndicatorVisible,
}))
class MontyVisualIndicator extends Component {
  static propTypes = {
    montyVisualIndicatorVisible: PropTypes.bool,
  }

  render() {
    const { montyVisualIndicatorVisible } = this.props
    if (!montyVisualIndicatorVisible) return null
    return (
      <div className="MontyVisualIndicator">
        <span className="MontyVisualIndicator-lozenge" />
      </div>
    )
  }
}

export default MontyVisualIndicator
