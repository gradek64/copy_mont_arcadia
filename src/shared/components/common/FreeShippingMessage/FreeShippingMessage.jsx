import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  getFreeDeliveryNudgeText,
  getFreeDeliveryText,
  getFreeExpressDeliveryText,
} from './FreeShippingMessage.StringHelpers'

import {
  calculateBagDiscount,
  getShoppingBagSubTotal,
  getDeliveryMessageThresholds,
} from '../../../selectors/shoppingBagSelectors'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import {
  getBrandCode,
  getCurrencyCode,
} from '../../../selectors/configSelectors'

@connect((state) => ({
  bagDiscounts: calculateBagDiscount(state),
  bagSubtotal: getShoppingBagSubTotal(state),
  brandCode: getBrandCode(state),
  currencyCode: getCurrencyCode(state),
  isFeatureThresholdNudgeMessageEnabled: isFeatureEnabled(
    state,
    'FEATURE_DELIVERY_THRESHOLD_NUDGE_MESSAGE'
  ),
  isFeatureFreeExpressDeliveryMessageEnabled: isFeatureEnabled(
    state,
    'FEATURE_FREE_EXPRESS_DELIVERY_MESSAGE'
  ),
  deliveryMessageThresholds: getDeliveryMessageThresholds(state),
}))
class FreeShippingMessage extends Component {
  static propTypes = {
    bagDiscounts: PropTypes.number.isRequired,
    bagSubtotal: PropTypes.number.isRequired,
    brandCode: PropTypes.string.isRequired,
    modifier: PropTypes.string,
    isFeatureThresholdNudgeMessageEnabled: PropTypes.bool,
    deliveryMessageThresholds: PropTypes.shape({
      nudgeMessageThreshold: PropTypes.number,
      standardDeliveryThreshold: PropTypes.number,
      expressDeliveryThreshold: PropTypes.number,
    }).isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }
  renderFreeExpressDeliveryMessage = () => {
    const { brandCode, modifier } = this.props
    const { l } = this.context
    const {
      qualifiedForFreeExpressDeliveryText,
      freeExpressDeliveryText,
    } = getFreeExpressDeliveryText(brandCode)
    return (
      <div
        className={`FreeShippingMessage FreeShippingMessage--${modifier} notranslate`}
      >
        <div className="FreeShippingMessage-success">
          <span className="FreeShippingMessage-line1 translate">
            {l(qualifiedForFreeExpressDeliveryText)}
          </span>
          <span className="FreeShippingMessage-line2 translate">
            {` ${l(freeExpressDeliveryText)}`}
          </span>
        </div>
      </div>
    )
  }

  renderFreeStandardDeliveryMessage = () => {
    const { brandCode, modifier } = this.props
    const { l } = this.context
    const {
      qualifiedForFreeDeliveryText,
      freeDeliveryText,
    } = getFreeDeliveryText(brandCode)
    return (
      <div
        className={`FreeShippingMessage FreeShippingMessage--${modifier} notranslate`}
      >
        <div className="FreeShippingMessage-success">
          <span className="FreeShippingMessage-line1 translate">
            {l(qualifiedForFreeDeliveryText)}
          </span>
          <span className="FreeShippingMessage-line2 translate">
            {` ${l(freeDeliveryText)}`}
          </span>
        </div>
      </div>
    )
  }

  renderFreeDeliveryNudgeRenderMessage = (
    standardDeliveryThreshold,
    subTotalAfterDiscount
  ) => {
    const { brandCode, modifier } = this.props
    const { l, p } = this.context
    const tillFreeDelivery = p(
      standardDeliveryThreshold - subTotalAfterDiscount
    )
    const {
      nudgeTextPartOne,
      nudgeTextPartTwo,
      nudgeTextPartThree,
    } = getFreeDeliveryNudgeText(l, brandCode, tillFreeDelivery)
    return (
      <div
        className={`FreeShippingMessage FreeShippingMessage--${modifier} notranslate`}
      >
        <div className="FreeShippingMessage-info">
          <strong className="translate">{nudgeTextPartOne} </strong>
          <span className="FreeShippingMessage-joining translate">
            {nudgeTextPartTwo}
          </span>
          <span className="FreeShippingMessage-deliveryText translate">
            {nudgeTextPartThree}
          </span>
        </div>
      </div>
    )
  }

  render() {
    const {
      bagDiscounts,
      bagSubtotal,
      isFeatureThresholdNudgeMessageEnabled,
      isFeatureFreeExpressDeliveryMessageEnabled,
      deliveryMessageThresholds,
    } = this.props

    const subTotalAfterDiscount = parseFloat(bagSubtotal) - bagDiscounts

    if (!Object.keys(deliveryMessageThresholds).length) return null

    const {
      nudgeMessageThreshold,
      standardDeliveryThreshold,
      expressDeliveryThreshold,
    } = deliveryMessageThresholds

    const isFreeDelivery = subTotalAfterDiscount >= standardDeliveryThreshold
    const isNearlyFreeDelivery =
      subTotalAfterDiscount >= nudgeMessageThreshold &&
      subTotalAfterDiscount < standardDeliveryThreshold
    const isFreeExpressDelivery =
      subTotalAfterDiscount >= expressDeliveryThreshold

    if (isFreeExpressDelivery && isFeatureFreeExpressDeliveryMessageEnabled) {
      return this.renderFreeExpressDeliveryMessage()
    } else if (isFreeDelivery) {
      return this.renderFreeStandardDeliveryMessage()
    } else if (isNearlyFreeDelivery && isFeatureThresholdNudgeMessageEnabled) {
      return this.renderFreeDeliveryNudgeRenderMessage(
        standardDeliveryThreshold,
        subTotalAfterDiscount
      )
    }

    return null
  }
}

export default FreeShippingMessage
