/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Image from '../../common/Image/Image'
import { connect } from 'react-redux'
import { showDebug } from '../../../actions/components/debugActions'
import { isDebugAllowed } from '../../../selectors/debugSelectors'

@connect(
  (state) => ({
    debugButtonVisible: isDebugAllowed(state),
  }),
  {
    showDebug,
  }
)
class DebugButton extends Component {
  static propTypes = {
    debugButtonVisible: PropTypes.bool,
    showDebug: PropTypes.func,
  }

  render() {
    const { debugButtonVisible, showDebug } = this.props
    if (!debugButtonVisible) return null
    return (
      <div className="DebugButton" onClick={showDebug}>
        <Image
          className="DebugButton-icon"
          src="/assets/common/images/debug-icon.png"
        />
        <a className="DebugButton-label">Debug</a>
      </div>
    )
  }
}

export default DebugButton
