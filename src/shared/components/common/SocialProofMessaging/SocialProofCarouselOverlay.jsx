import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Transition } from 'react-transition-group'
import { getSocialProofProductCount } from '../../../selectors/socialProofSelectors'
import { isMobile } from './../../../selectors/viewportSelectors'
import {
  getBrandCode,
  getSocialProofMaximumPDPMessageViewsPerSession,
} from '../../../selectors/configSelectors'
import { incrementSocialProofViewCounter } from '../../../lib/social-proof-utils'
import {
  getCarouselOverlayTitle,
  getCarouselOverlayTextNotMobile,
  getCarouselOverlayTextMobileAndDesktop,
} from './SocialProofCarouselOverlay.string-helpers'

const TRANSITION_START = 2000
const TRANSITION_END = 10000

@connect((state, { productId }) => ({
  brandCode: getBrandCode(state),
  isMobile: isMobile(state),
  carouselOverlayTitle: getCarouselOverlayTitle(getBrandCode(state)),
  carouselOverlayTextNotMobile: getCarouselOverlayTextNotMobile(
    getBrandCode(state)
  ),
  socialProofProductCount: getSocialProofProductCount(state, productId, 'PDP'),
  maximumPDPMessageViewsPerSession: getSocialProofMaximumPDPMessageViewsPerSession(
    state
  ),
}))
class SocialProofCarouselOverlay extends Component {
  state = {
    isVisible: false,
  }

  static propTypes = {
    brandCode: PropTypes.string.isRequired,
    isMobile: PropTypes.bool,
    socialProofProductCount: PropTypes.number,
    carouselOverlayTitle: PropTypes.string,
    carouselOverlayTextNotMobile: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  showMessage = () => {
    this.setState({ isVisible: true })

    this.animationEndTimeOut = setTimeout(() => {
      this.hideMessage()
    }, TRANSITION_END)
  }

  componentDidMount() {
    const { maximumPDPMessageViewsPerSession } = this.props

    this.animationStartTimeOut = setTimeout(() => {
      this.showMessage()

      if (maximumPDPMessageViewsPerSession) {
        incrementSocialProofViewCounter('PDP')
      }
    }, TRANSITION_START)
  }

  hideMessage = () => {
    this.setState({ isVisible: false })
  }

  componentWillUnmount() {
    if (this.animationStartTimeOut) {
      clearTimeout(this.animationStartTimeOut)
    }
    if (this.animationEndTimeOut) {
      clearTimeout(this.animationEndTimeOut)
    }
  }

  render() {
    const { l } = this.context

    const {
      brandCode,
      socialProofProductCount,
      carouselOverlayTitle,
      carouselOverlayTextNotMobile,
      isMobile,
    } = this.props

    return (
      <Transition
        classNames="SocialProofCarouselOverlay"
        in={this.state.isVisible}
        timeout={500}
      >
        {(state) => {
          if (state === 'exited') {
            return null
          }

          return (
            <div
              className={classNames(
                'SocialProofCarouselOverlay',
                `SocialProofCarouselOverlay-${state}`
              )}
            >
              <div className="SocialProofCarouselOverlay-container">
                {carouselOverlayTitle && (
                  <h4 className="SocialProofCarouselOverlay-title">
                    {l(carouselOverlayTitle)}
                  </h4>
                )}
                <p className="SocialProofCarouselOverlay-text">
                  {!isMobile &&
                    carouselOverlayTextNotMobile && (
                      <span className="SocialProofCarouselOverlay-textNotMobile">
                        {l(carouselOverlayTextNotMobile)}
                      </span>
                    )}
                  <span>
                    {getCarouselOverlayTextMobileAndDesktop(
                      l,
                      brandCode,
                      socialProofProductCount
                    )}
                  </span>
                </p>
                <button
                  className="SocialProofCarouselOverlay-close"
                  aria-label="Close"
                  onClick={this.hideMessage}
                />
              </div>
            </div>
          )
        }}
      </Transition>
    )
  }
}

export default SocialProofCarouselOverlay
