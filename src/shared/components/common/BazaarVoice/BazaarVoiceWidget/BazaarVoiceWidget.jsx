import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import loadBazaarVoiceApi from '../../../../lib/load-bazaar-voice-api'
import { isFeatureBazaarVoiceEnabled } from '../../../../selectors/featureSelectors'
import { scrollElementIntoView } from '../../../../lib/scroll-helper'

@connect((state) => ({
  location: state.routing.location,
  brandName: state.config.brandName,
  bazaarVoiceId: state.config.bazaarVoiceId,
  bazaarVoiceEnabled: isFeatureBazaarVoiceEnabled(state),
}))
class BazaarVoiceWidget extends Component {
  static propTypes = {
    lineNumber: PropTypes.string,
    productId: PropTypes.number,
    brandName: PropTypes.string,
    bazaarVoiceId: PropTypes.string,
    location: PropTypes.object,
    summaryOnly: PropTypes.bool,
    containerOnly: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  componentDidMount() {
    if (this.props.bazaarVoiceEnabled) {
      this.loadBazaar()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.bazaarVoiceEnabled &&
      ((this.props &&
        prevProps &&
        this.props.summaryOnly !== prevProps.summaryOnly) ||
        this.props.containerOnly !== prevProps.containerOnly ||
        this.props.lineNumber !== prevProps.lineNumber)
    ) {
      this.loadBazaar()
    }
  }

  shouldScrollToReviews = () =>
    this.props.location && this.props.location.hash === '#BVReviews'

  scrollToBazaar = (id) => {
    const element = document.getElementById(id)
    scrollElementIntoView(element)
  }

  loadBazaar = () => {
    const { brandName, bazaarVoiceId, lineNumber, productId } = this.props
    loadBazaarVoiceApi(brandName, bazaarVoiceId, () => {
      // eslint-disable-next-line no-undef
      $BV.configure('global', {
        submissionContainerUrl: `${window.location.protocol}//${
          window.location.host
        }/review/${productId}`,
        submissionReturnUrl: window.location.href,
      })
      // eslint-disable-next-line no-undef
      $BV.ui('rr', 'show_reviews', {
        productId: lineNumber,
      })
    }).then(() => {
      if (this.shouldScrollToReviews()) {
        this.scrollToBazaar('BVRRContainer')
      }
    })
  }

  render() {
    const {
      className,
      containerOnly,
      summaryOnly,
      bazaarVoiceEnabled,
    } = this.props
    return bazaarVoiceEnabled ? (
      <div className={`BazaarVoice ${className}`}>
        {!containerOnly && <div id="BVRRSummaryContainer" />}
        {!summaryOnly && <div id="BVRRContainer" />}
      </div>
    ) : null
  }
}

export default BazaarVoiceWidget
