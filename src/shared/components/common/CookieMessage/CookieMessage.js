import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classnames from 'classnames'
import { replace, add, lt, isEmpty, pipe, isNil, lensPath, view } from 'ramda'
import cookieLinks from './links.json'
import Button from '../Button/Button'
import { isCookieManagerEnabled } from '../../../selectors/featureSelectors'

@connect(
  (state) => ({
    brandName: state.config.brandName,
    region: state.config.region,
    envCookieMessage: state.config.envCookieMessage,
    isCookieManagerEnabled: isCookieManagerEnabled(state),
  }),
  {}
)
class CookieMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cookieID: `${this.props.brandName}-cookie-message=`,
      daysToExpiry: 60,
      showMessage: false,
    }
  }

  static propTypes = {
    brandName: PropTypes.string,
    region: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    // Environment variable to switch cookie message on and off
    const cookieEnvIsTrue = this.props.envCookieMessage

    // Do not display cookie message in the US region
    const regionIsNotUS = this.props.region !== 'us'

    if (
      cookieEnvIsTrue &&
      regionIsNotUS &&
      !this.props.isCookieManagerEnabled
    ) {
      this.readCookie(this.state.cookieID, this.getDocumentCookie())
    }
  }

  getDocumentCookie = () => document.cookie || ''

  readCookie = (cookieID, cookie) => {
    this.setState({
      showMessage: pipe(
        this.findCookieMessage,
        this.getExpiryDateTime,
        this.getCurrentDateTime,
        this.hasCookieMessageExpired
      )(cookieID, cookie),
    })
  }

  findCookieMessage = (cookieID, cookie) => ({
    cookieID,
    cookieMessage: isNil(cookie)
      ? []
      : cookie.split(';').filter((string) => string.search(cookieID) >= 0),
  })

  getExpiryDateTime = (args) => ({
    ...args,
    expiryDate: isEmpty(args.cookieMessage)
      ? []
      : replace(args.cookieID, '', args.cookieMessage[0]),
  })

  hasCookieMessageExpired = ({ currentDate, expiryDate, cookieMessage }) =>
    isEmpty(cookieMessage) ? true : lt(expiryDate, currentDate)

  acceptCookie = ({ daysToExpiry, cookieID }) => {
    this.setState({
      showMessage: pipe(
        this.convertDaysToMilliseconds,
        this.getCurrentDateTime,
        this.determineExpiryDate,
        this.createCookieMessage
      )({ daysToExpiry, cookieID }),
    })
  }

  convertDaysToMilliseconds = ({ daysToExpiry, cookieID }) => ({
    cookieID,
    daysToExpiry: daysToExpiry * 24 * 60 * 60 * 1000,
  })

  getCurrentDateTime = (args) => {
    const date = new Date()
    return {
      ...args,
      currentDate: date.getTime(),
    }
  }

  determineExpiryDate = ({ currentDate, daysToExpiry, cookieID }) => ({
    cookieID,
    expiryDate: add(currentDate, daysToExpiry),
  })

  createCookieMessage = ({ cookieID, expiryDate }) => {
    const date = new Date()
    date.setTime(expiryDate)
    document.cookie = `${cookieID}${expiryDate}; expires=${date.toGMTString()}; path=/`
    // return false to hide cookie message
    return false
  }

  getCookiePolicyLink = (brandName, region) => {
    const pathToLink = lensPath([brandName, region])
    return view(pathToLink, cookieLinks)
  }

  render() {
    const {
      context: { l },
      state: { daysToExpiry, cookieID, showMessage },
      props: { brandName, region, isCookieManagerEnabled },
      getCookiePolicyLink,
    } = this

    const CookieMessageClass = classnames('CookieMessage', {
      'CookieMessage--show': showMessage,
    })

    return isCookieManagerEnabled ? (
      <div id="consent_blackbar" />
    ) : (
      <div className={CookieMessageClass}>
        <div className="CookieMessage-content">
          <div className="CookieMessage-message">
            <span>
              {l`We use cookies to give you the best experience possible. Click accept to continue shopping or find out more in our cookie policy`}{' '}
              <Link to={getCookiePolicyLink(brandName, region)}>
                {' '}
                {l`here`}
              </Link>
            </span>
          </div>
          <div className="CookieMessage-button">
            <Button
              clickHandler={() => this.acceptCookie({ daysToExpiry, cookieID })}
              className="Button Button Button--secondary"
            >
              {l`ACCEPT AND CLOSE`}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default CookieMessage
