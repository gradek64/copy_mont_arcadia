import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import loadBazaarVoiceApi from '../../../../lib/load-bazaar-voice-api'
import analyticsDecorator from '../../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../../../shared/analytics'

@analyticsDecorator(GTM_CATEGORY.WRITE_REVIEW)
@connect((state) => ({
  bvToken: state.auth.bvToken,
  brandName: state.config.brandName,
  bazaarVoiceId: state.config.bazaarVoiceId,
}))
class BazaarVoiceReview extends Component {
  static propTypes = {
    bvToken: PropTypes.string,
    brandName: PropTypes.string,
    bazaarVoiceId: PropTypes.string,
  }

  componentDidMount() {
    const { brandName, bazaarVoiceId, bvToken } = this.props
    loadBazaarVoiceApi(brandName, bazaarVoiceId, () => {
      window.$BV.ui('submission_container', {
        userToken: bvToken,
        doLogin: (successCallback, successUrl) => {
          browserHistory.replace(
            `/login?return=${encodeURIComponent(successUrl)}`
          )
        },
      })
    })
  }

  render() {
    return (
      <div className="BVReview">
        <div id="BVSubmissionContainer" />
      </div>
    )
  }
}

export default BazaarVoiceReview
