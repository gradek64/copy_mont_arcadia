import { equals } from 'ramda'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NotFound from '../NotFound/NotFound'
import { showModal } from '../../../actions/common/modalActions'
import { removeError } from '../../../actions/common/errorMessageActions'

import { isModalOpen } from '../../../selectors/modalSelectors'
import { getLocation } from '../../../selectors/routingSelectors'

@connect(
  (state) => ({
    error: state.errorMessage,
    modalOpen: isModalOpen(state),
    location: getLocation(state),
  }),
  { showModal, removeError }
)
class ErrorMessage extends Component {
  static propTypes = {
    modalOpen: PropTypes.bool,
    error: PropTypes.object,
    showModal: PropTypes.func,
    removeError: PropTypes.func,
    location: PropTypes.object,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.handleError()
  }

  UNSAFE_componentWillReceiveProps({ location, modalOpen }) {
    if (
      location !== this.props.location ||
      (!modalOpen && this.props.modalOpen)
    ) {
      this.props.removeError()
    }
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props

    if (!error) {
      return
    }

    const { error: prevError } = prevProps

    const errorHasChanged = !prevError || !equals(error, prevError)

    if (errorHasChanged) {
      this.handleError()
    }
  }

  reloadBrowser = () => {
    window.location.reload()
  }

  handleError = () => {
    const { error } = this.props
    if (error && error.isOverlay && error.statusCode !== 404) {
      this.props.showModal(this.renderErrorBody(), { type: 'alertdialog' })
    }
  }

  renderErrorBody = () => {
    const { l } = this.context
    const {
      error: { noReload, message, nativeError },
    } = this.props

    return (
      <div>
        <p>{message}</p>
        {!noReload ? (
          <button
            className="Button"
            onClick={this.reloadBrowser}
          >{l`Reload`}</button>
        ) : (
          ''
        )}
        {nativeError && this.renderStackTrace()}
      </div>
    )
  }

  renderStackTrace = () => {
    const { stack } = this.props.error.nativeError || {}
    if (stack) {
      return <div className="ErrorMessage-stackTrace">{stack}</div>
    }
  }

  renderStatusCodeError = () => {
    const errorPage = {
      404: <NotFound />,
      522: <NotFound />,
    }[this.props.error.statusCode]
    return (
      <div>
        {errorPage}
        {this.renderStackTrace()}
      </div>
    )
  }

  render() {
    const { error } = this.props
    if (!error || error.isOverlay) {
      return null
    }

    return (
      <div className="ErrorMessage">
        {error.statusCode
          ? this.renderStatusCodeError()
          : this.renderErrorBody()}
      </div>
    )
  }
}

export default ErrorMessage
