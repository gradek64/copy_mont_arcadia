import PropTypes from 'prop-types'
import React, { Component } from 'react'

import withRestrictedActionDispatch from '../../../lib/restricted-actions'
import Select from '../FormComponents/Select/Select'

import { changeDeliveryType } from '../../../actions/common/shoppingBagActions'

@withRestrictedActionDispatch({ changeDeliveryType })
class ShoppingBagDeliveryOptions extends Component {
  static propTypes = {
    shoppingBag: PropTypes.object.isRequired,
    changeDeliveryType: PropTypes.func.isRequired,
    isCFSIEnabled: PropTypes.bool.isRequired,
    isPUDOEnabled: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  onChangeHandler = (e) => {
    const { changeDeliveryType } = this.props
    const deliveryOptionId = e.target.value
    changeDeliveryType({ deliveryOptionId })
  }

  selectedValue = (deliveryOptions) => {
    const selectedDeliveryOption = deliveryOptions.find(
      (option) => option.selected === true
    )
    // scrAPI returns no selected option in EU
    return (
      selectedDeliveryOption &&
      selectedDeliveryOption.deliveryOptionId.toString()
    )
  }

  applicableOptions(options) {
    const { isCFSIEnabled, isPUDOEnabled } = this.props

    const excludeCFSIWhenDisabled = (option) =>
      !(!isCFSIEnabled && option.label.search(/(?:Store.*Today)/) !== -1)

    const excludePUDOWhenDisabled = (option) =>
      !(!isPUDOEnabled && option.label.search(/(?:ParcelShop.*)/) !== -1)

    const uiOption = (option) => ({
      value: option.deliveryOptionId,
      label: option.label,
      disabled: !option.enabled,
    })

    const orderByValue = (a, b) => {
      if (typeof a.value === 'number' && typeof b.value === 'number') {
        if (a.value < b.value) return -1
        if (a.value > b.value) return 1
      }

      return 0
    }

    return options
      .filter(excludeCFSIWhenDisabled)
      .filter(excludePUDOWhenDisabled)
      .map(uiOption)
      .sort(orderByValue)
  }

  render() {
    const { l } = this.context
    const {
      shoppingBag: { bag },
    } = this.props
    return (
      <div>
        {bag.deliveryOptions.length ? (
          <div className="ShoppingBagDeliveryOptions-select">
            <Select
              className="ShoppingBagDeliveryOptions-selectMenu"
              name="miniBagDeliveryType"
              value={this.selectedValue(bag.deliveryOptions)}
              onChange={this.onChangeHandler}
              options={this.applicableOptions(bag.deliveryOptions)}
            />
          </div>
        ) : (
          <p className="ShoppingBagDeliveryOptions-message">
            {l`There are no additional delivery options available`}
          </p>
        )}
      </div>
    )
  }
}

export default ShoppingBagDeliveryOptions
