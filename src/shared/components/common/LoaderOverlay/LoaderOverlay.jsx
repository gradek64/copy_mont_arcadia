import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as loaderActions from '../../../actions/components/LoaderOverlayActions'
import Loader from '../../common/Loader/Loader'
import AccessibleText from '../../common/AccessibleText/AccessibleText'

@connect(
  (state) => ({
    loaderOpen: state.loaderOverlay.visible,
  }),
  loaderActions
)
class LoaderOverlay extends Component {
  static propTypes = {
    loaderOpen: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    loaderOpen: false,
    className: undefined,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const tabIndexes = document.querySelectorAll('[tabindex="-1"]')
    if (nextProps.loaderOpen === false && tabIndexes.length > 0) {
      tabIndexes[0].focus()
    } else if (nextProps.loaderOpen && this.loader) {
      this.loader.focus()
    }
  }

  render() {
    const { l } = this.context
    const { loaderOpen, className = '' } = this.props
    const loaderState = loaderOpen ? ' is-shown' : ''
    const loaderClass = `LoaderOverlay${loaderState}`

    return (
      <div
        className={`${loaderClass} ${className}`}
        aria-busy={loaderOpen}
      >
        <AccessibleText
          ref={(accessibleText) => {
            this.loader = accessibleText
          }}
        >
          {l`Content is loading, please wait.`}
        </AccessibleText>
        <Loader fillColor="#FFF" className="is-overlay" />
      </div>
    )
  }
}

export default LoaderOverlay
