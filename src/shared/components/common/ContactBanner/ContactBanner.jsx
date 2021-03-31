import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Espot from '../../containers/Espot/Espot'
import { getContactBanner } from '../../../actions/common/espotActions'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

class ContactBanner extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired, // eslint-disable-line
    isContactBannerExperienceEnabled: PropTypes.bool.isRequired, // eslint-disable-line
    getContactBanner: PropTypes.func,
  }

  isEnabled(props = this.props) {
    return !props.isMobile && props.isContactBannerExperienceEnabled
  }

  componentDidMount() {
    if (this.isEnabled()) {
      this.props.getContactBanner()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.isEnabled() && this.isEnabled(nextProps)) {
      this.props.getContactBanner()
    }
  }

  render() {
    return this.isEnabled() ? <Espot identifier="CONTACT_BANNER" /> : null
  }
}

export default connect(
  (state) => ({
    isMobile: isMobile(state),
    isContactBannerExperienceEnabled: isFeatureEnabled(
      state,
      'FEATURE_CONTACT_BANNER'
    ),
  }),
  { getContactBanner }
)(ContactBanner)
