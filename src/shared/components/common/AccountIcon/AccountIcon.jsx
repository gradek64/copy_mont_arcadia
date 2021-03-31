import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  isUserAuthenticated,
  isUserPartiallyAuthenticated,
} from '../../../selectors/userAuthSelectors'
import { isFeatureRememberMeEnabled } from '../../../selectors/featureSelectors'

@connect(
  (state) => ({
    isUserAuthenticated: isUserAuthenticated(state),
    isUserPartiallyAuthenticated: isFeatureRememberMeEnabled(state)
      ? isUserPartiallyAuthenticated(state)
      : false,
  }),
  {}
)
class AccountIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    myAccountText: PropTypes.string,
    signInText: PropTypes.string,
    signOutText: PropTypes.string,
    popoverMenu: PropTypes.bool,
    // email: PropTypes.string
    isUserAuthenticated: PropTypes.bool,
    isUserPartiallyAuthenticated: PropTypes.bool,
  }

  static defaultProps = {
    className: undefined,
    myAccountText: '',
    signInText: undefined,
    signOutText: '',
    popoverMenu: false,
    // email: '',
    isUserAuthenticated: false,
    isUserPartiallyAuthenticated: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const {
      className,
      signInText,
      signOutText,
      myAccountText,
      popoverMenu,
      // email,
      isUserAuthenticated,
      isUserPartiallyAuthenticated,
    } = this.props
    const { l } = this.context

    const classNames = classnames('AccountIcon', className)
    const iconClasses = classnames('AccountIcon-icon', {
      'AccountIcon-icon--loggedIn':
        isUserAuthenticated || isUserPartiallyAuthenticated,
    })

    return (
      <div className={classNames}>
        {!isUserAuthenticated && !isUserPartiallyAuthenticated ? (
          <div className="AccountIcon-notLoggedInContainer">
            <Link
              className={`AccountIcon-link ${
                className ? `${className}--link` : ''
              }`}
              to="/login"
            >
              {signInText && (
                <span className="AccountIcon-label">{signInText}</span>
              )}
              <span className={iconClasses} />
            </Link>
          </div>
        ) : (
          <div className="AccountIcon-loggedInContainer">
            {signInText && (
              <span className="AccountIcon-label">{myAccountText}</span>
            )}
            <span className={iconClasses} />
            {popoverMenu && (
              <div className="AccountIcon-popover">
                <span className="AccountIcon-popoverButtonText">{l`Welcome back`}</span>
                {/* awaiting confirmation from brands whether to include something here - email? username?
                <span className="AccountIcon-popoverButtonText AccountIcon-popoverButtonEmail">
                  {email}
                </span> */}
                <Link
                  className="AccountIcon-popoverButton AccountIcon-popoverButtonMyAccount"
                  to={isUserPartiallyAuthenticated ? '/login' : '/my-account'}
                  onClick={this.onLeave}
                >
                  {myAccountText}
                </Link>
                <Link
                  className="AccountIcon-popoverButton AccountIcon-popoverButtonSignOut"
                  to="/logout"
                  onClick={this.onLeave}
                >
                  {signOutText}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default AccountIcon
