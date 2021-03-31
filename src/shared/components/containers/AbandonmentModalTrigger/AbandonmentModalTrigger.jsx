import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isMobile } from '../../../selectors/viewportSelectors'
import { isShoppingBagEmpty } from '../../../selectors/shoppingBagSelectors'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import { abandonmentEspotErrored } from '../../../selectors/espotSelectors'
import { showModal } from '../../../actions/common/modalActions'
import { getAbandonmentModalEspot } from '../../../actions/common/espotActions'
import Espot from '../Espot/Espot'
import throttle from 'lodash.throttle'
import { isLoggedIn } from '../../../selectors/common/accountSelectors'
import { setItem, getItem } from '../../../../client/lib/cookie/utils'

/*
 * We trigger showModal, populated with espot content
 * when a user moves their mouse towards the top of the page
 * indicating theyre about to close the window
 */
export class AbandonmentModalTrigger extends Component {
  constructor(props) {
    super(props)
    this.throttledMousePositionCheck = throttle(this.mousePositionCheck, 300)
  }

  static propTypes = {
    hasShoppingBagItems: PropTypes.bool,
    isMobile: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isFeatureAbandonmentModalEnabled: PropTypes.bool,
    getAbandonmentModalEspot: PropTypes.func,
    espot: PropTypes.string.isRequired,
    abandonmentEspotErrored: PropTypes.bool,
  }

  componentDidMount() {
    this.addListener()
  }

  componentDidUpdate() {
    this.addListener()
  }

  componentWillUnmount() {
    this.removeListener()
  }

  addListener = () => {
    if (this.shouldAddListener()) {
      document.addEventListener('mousemove', this.throttledMousePositionCheck)
      this.props.getAbandonmentModalEspot(this.props.espot)
    }
  }

  shouldAddListener = () => {
    return (
      this.props.isFeatureAbandonmentModalEnabled &&
      this.props.hasShoppingBagItems &&
      !this.props.isMobile &&
      !this.props.isLoggedIn &&
      !getItem('hasSeenAbandonmentModal')
    )
  }

  mousePositionCheck = (event) => {
    if (event.clientY < 10 && !getItem('hasSeenAbandonmentModal')) {
      this.triggerModal()
    }
  }

  removeListener = () =>
    document.removeEventListener('mousemove', this.throttledMousePositionCheck)

  triggerModal = () => {
    const { espot, showModal, abandonmentEspotErrored } = this.props
    const signupEspot = <Espot identifier={espot} />

    // The call to the espot EP may sometimes hit a HTTP 440. If so, we catch it and check the status of it before showing the modal.
    if (!abandonmentEspotErrored) {
      showModal(signupEspot, { mode: 'noBleed' })
      setItem('hasSeenAbandonmentModal', true)
    }

    this.removeListener()
  }

  render() {
    return null
  }
}

export default connect(
  (state) => ({
    isMobile: isMobile(state),
    isLoggedIn: isLoggedIn(state),
    hasShoppingBagItems: !isShoppingBagEmpty(state),
    isFeatureAbandonmentModalEnabled: isFeatureEnabled(
      state,
      'FEATURE_ABANDONMENT_MODAL'
    ),
    abandonmentEspotErrored: abandonmentEspotErrored(state),
  }),
  {
    showModal,
    getAbandonmentModalEspot,
  }
)(AbandonmentModalTrigger)
