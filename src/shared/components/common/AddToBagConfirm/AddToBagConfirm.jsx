import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Button from '../Button/Button'
import { openMiniBag } from '../../../actions/common/shoppingBagActions'
import {
  sendAnalyticsDisplayEvent,
  GTM_EVENT,
  GTM_TRIGGER,
} from '../../../analytics'

import { closeModal } from '../../../actions/common/modalActions'
import { isModalOpen } from '../../../selectors/modalSelectors'

@connect(
  (state) => ({
    modalOpen: isModalOpen(state),
    pageType: state.pageType,
  }),
  { openMiniBag, sendAnalyticsDisplayEvent, closeModal }
)
class AddToBagConfirm extends Component {
  static propTypes = {
    openMiniBag: PropTypes.func,
    onClose: PropTypes.func,
    sendAnalyticsDisplayEvent: PropTypes.func.isRequired,
    pageType: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  goToShoppingBag = (evt) => {
    const {
      openMiniBag,
      onClose,
      sendAnalyticsDisplayEvent,
      pageType,
    } = this.props
    if (evt) evt.stopPropagation()
    if (onClose) onClose()
    openMiniBag()
    sendAnalyticsDisplayEvent(
      {
        bagDrawerTrigger: GTM_TRIGGER.PRODUCT_VIEW_BAG,
        openFrom: pageType,
      },
      GTM_EVENT.BAG_DRAWER_DISPLAYED
    )
  }

  goToCheckout = (evt) => {
    const { onClose, modalOpen, closeModal } = this.props
    if (evt) evt.stopPropagation()
    if (onClose) onClose()
    if (modalOpen) closeModal(false)
    browserHistory.push('/checkout')
  }

  render() {
    const { l } = this.context
    return (
      <div className="AddToBagConfirm">
        <Button
          className="AddToBagConfirm-viewBag Button--secondary Button--twoFifthWidth"
          clickHandler={this.goToShoppingBag}
        >{l`View bag`}</Button>
        <Button
          className="AddToBagConfirm-goToCheckout is-active Button--threeFifthWidth"
          clickHandler={this.goToCheckout}
        >{l`Checkout now`}</Button>
      </div>
    )
  }
}

export default AddToBagConfirm
