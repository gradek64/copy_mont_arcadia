import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Button from '../../common/Button/Button'
import Image from '../../common/Image/Image'
import { sessionReset } from '../../../actions/common/sessionActions'
import { closeModal } from '../../../actions/common/modalActions'
import { connect } from 'react-redux'
import { removeItem } from '../../../../client/lib/cookie/utils'

@connect(
  (state) => ({
    isMyaccount: state.routing.location.pathname.startsWith('/my-account'),
    error: state.errorSession,
  }),
  {
    sessionReset,
    closeModal,
  }
)
class ErrorSession extends Component {
  static propTypes = {
    error: PropTypes.object,
    isMyaccount: PropTypes.bool,
    className: PropTypes.string,
    sessionReset: PropTypes.func.isRequired,
    redirectTo: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: {},
    isMyaccount: false,
    className: '',
    redirectTo:
      typeof browserHistory !== 'undefined' && 'push' in browserHistory
        ? browserHistory.push
        : () => {},
    removeItem,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  handleSession = () => {
    const {
      isMyaccount,
      sessionReset,
      redirectTo,
      closeModal,
      removeItem,
    } = this.props
    const redirectUrl = isMyaccount ? '/login' : '/'
    removeItem('authenticated')
    sessionReset()
    closeModal()
    redirectTo(redirectUrl)
  }

  render() {
    const { l } = this.context
    const { error, isMyaccount, className } = this.props
    if (!error.sessionExpired) {
      return null
    }
    return (
      <div className={`ErrorSession ErrorSession-container ${className || ''}`}>
        <div className="ErrorSession-content">
          <div className="ErrorSession-icon">
            <Image
              className="ErrorSession-errorImage"
              src={'/assets/{brandName}/images/error.svg'}
            />
          </div>
          <p className="ErrorSession-details">
            {l`Unfortunately your session has timed out.`}
          </p>
          <Button clickHandler={this.handleSession}>
            {isMyaccount ? (
              <span className="translate">{l`Login`}</span>
            ) : (
              <span className="translate">{l`Continue Shopping`}</span>
            )}
          </Button>
        </div>
      </div>
    )
  }
}

export default ErrorSession
