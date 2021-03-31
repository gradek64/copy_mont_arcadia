import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fireMarketingSlideUpClickEvent,
  showMarketingSlideUp,
  hideMarketingSlideUp,
  getMarketingSliderDismissedCookie,
} from '../../../actions/common/sessionUXActions'
import Drawer from '../Drawer/Drawer'
import {
  getNumberOfMarketingSliderClickEventsFired,
  isMarketingSlideUpActive,
  hasMarketingSliderBeenSeen,
} from '../../../selectors/sessionUXSelectors'
import Espot from '../../containers/Espot/Espot'
import espotsDesktop from '../../../constants/espotsDesktop'
import { getMarketingSlideUpEspot } from '../../../actions/common/espotActions'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import { isLoggedIn } from '../../../selectors/common/accountSelectors'
import { isRestrictedPath } from '../../../selectors/routingSelectors'
import { setItem } from '../../../../client/lib/cookie/utils'

const mapStateToProps = (state) => ({
  isFeatureMarketingSliderEnabled: isFeatureEnabled(
    state,
    'FEATURE_MARKETING_SLIDER'
  ),
  isLoggedIn: isLoggedIn(state),
  marketingSliderDismissed: hasMarketingSliderBeenSeen(state),
  isRestrictedPath: isRestrictedPath(state),
  numberOfClickEventsFired: getNumberOfMarketingSliderClickEventsFired(state),
  isMarketingSlideUpActive: isMarketingSlideUpActive(state),
})

const mapDispatchToProps = {
  getMarketingSlideUpEspot,
  fireMarketingSlideUpClickEvent,
  showMarketingSlideUp,
  hideMarketingSlideUp,
  getMarketingSliderDismissedCookie,
}

class MarketingSlideUp extends Component {
  static defaultProps = {
    areSideDrawersOpen: false,
  }

  static propTypes = {
    areSideDrawersOpen: PropTypes.bool,
    getMarketingSlideUpEspot: PropTypes.func,
    isFeatureMarketingSliderEnabled: PropTypes.bool,
    isRestrictedPath: PropTypes.bool,
    numberOfClickEventsFired: PropTypes.number,
    fireMarketingSlideUpClickEvent: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    isMarketingSlideUpActive: PropTypes.bool,
    marketingSliderDismissed: PropTypes.bool,
    showMarketingSlideUp: PropTypes.func,
    hideMarketingSlideUp: PropTypes.func,
  }

  isMarketingSliderActive = () =>
    this.props.isFeatureMarketingSliderEnabled &&
    !this.props.isLoggedIn &&
    !this.props.isRestrictedPath

  handleMarketingClickEvent = () => {
    this.checkIfSliderShouldBeActive()
    if (this.props.numberOfClickEventsFired === 3) {
      document.removeEventListener(
        'click',
        this.handleMarketingClickEvent,
        false
      )
    } else {
      this.props.fireMarketingSlideUpClickEvent()
    }
  }

  checkIfSliderShouldBeActive = () => {
    if (
      !this.props.marketingSliderDismissed &&
      this.isMarketingSliderActive() &&
      this.props.numberOfClickEventsFired === 2
    ) {
      setItem('marketingSliderDismissed', true)
      this.props.showMarketingSlideUp()
      this.props.getMarketingSliderDismissedCookie()
    }
  }

  handleMarketingSliderDismiss = () => {
    this.props.hideMarketingSlideUp()
  }

  componentDidMount() {
    this.props.getMarketingSliderDismissedCookie()
    if (this.isMarketingSliderActive()) {
      this.props.getMarketingSlideUpEspot()
      document.addEventListener('click', this.handleMarketingClickEvent, false)
    }
  }

  render() {
    const {
      areSideDrawersOpen,
      numberOfClickEventsFired,
      isMarketingSlideUpActive,
    } = this.props
    const MARKETING_SLIDE_UP_ESPOT =
      espotsDesktop.marketing_slide_up.MARKETING_SLIDE_UP_ESPOT
    const marketingSliderTriggerMet = numberOfClickEventsFired === 3
    return (
      <Drawer
        isOpen={
          this.isMarketingSliderActive() &&
          isMarketingSlideUpActive &&
          marketingSliderTriggerMet &&
          !areSideDrawersOpen
        }
        direction="bottom"
      >
        {marketingSliderTriggerMet &&
          this.props.isMarketingSlideUpActive &&
          !areSideDrawersOpen && (
            <div className="MarketingSlideUp">
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className="MarketingSlideUp-overlay"
                onClick={this.handleMarketingSliderDismiss}
              />
              <div className="MarketingSlideUp-content">
                <button
                  onClick={this.handleMarketingSliderDismiss}
                  className="MarketingSlideUp-closeButton"
                  aria-label="Close"
                >
                  x
                </button>
                <Espot identifier={MARKETING_SLIDE_UP_ESPOT} isResponsive />
              </div>
            </div>
          )}
      </Drawer>
    )
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketingSlideUp)
