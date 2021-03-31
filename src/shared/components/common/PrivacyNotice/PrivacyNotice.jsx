import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { path } from 'ramda'

// selectors
import { getRegion } from '../../../selectors/common/configSelectors'
import { getBrandName } from '../../../selectors/configSelectors'

const PrivacyPolicyUrls = require('./PrivacyPolicyUrls.json')

// NOTE: this will be refactor when will have PrivacyPolicy Endpoint
const getPrivacyPolicyUrlForRegionAndBrand = (brandName, region) => {
  return path([brandName, region], PrivacyPolicyUrls)
}

@connect(
  (state) => ({
    brandName: getBrandName(state),
    region: getRegion(state),
  }),
  {}
)
class PrivacyNotice extends PureComponent {
  static contextTypes = {
    l: PropTypes.func,
  }

  static propTypes = {
    brandName: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    privacyMessage: PropTypes.string,
    privacyNoticeUrlText: PropTypes.string,
    showPrivacyMessageForUs: PropTypes.bool,
  }

  static defaultProps = {
    showPrivacyMessageForUs: false,
  }

  clickHandler(event) {
    event.preventDefault()
    const privacyNoticeWindow = window.open(event.target.href, '')

    // If a new window could not be opened for some reason, fall back
    // to displaying the privacy notice in the current window.
    if (!privacyNoticeWindow) {
      window.location.assign(event.target.href)
    }
  }

  render() {
    const { l } = this.context
    const {
      brandName,
      region,
      privacyMessage,
      privacyNoticeUrlText,
      showPrivacyMessageForUs,
    } = this.props

    if (region === 'us' && !showPrivacyMessageForUs) return null

    return (
      <div className="PrivacyNotice">
        {privacyMessage || l`privacyNoticeBeforeLink`}
        <Link
          to={getPrivacyPolicyUrlForRegionAndBrand(brandName, region)}
          onClick={this.clickHandler}
        >
          {privacyNoticeUrlText || l`privacyNoticeUrlText`}
        </Link>
        .
      </div>
    )
  }
}

export default PrivacyNotice
