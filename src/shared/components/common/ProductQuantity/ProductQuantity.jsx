import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FeatureCheck from '../FeatureCheck/FeatureCheck'
import Select from '../FormComponents/Select/Select'
import { range, isEmpty } from 'ramda'

export default class ProductQuantity extends Component {
  static propTypes = {
    activeItem: PropTypes.object.isRequired,
    onSelectQuantity: PropTypes.func.isRequired,
    selectedQuantity: PropTypes.number,
    className: PropTypes.string,
  }
  static contextTypes = {
    l: PropTypes.func,
  }
  static defaultProps = {
    selectedQuantity: 1,
    className: '',
  }

  getQuantityOptions = (maxQuantity = 10) => {
    const quantities = range(1, maxQuantity + 1)
    return quantities.map((currentQuantity) => {
      return {
        value: currentQuantity,
        label: currentQuantity,
        disabled: false,
      }
    })
  }

  render() {
    const { l } = this.context
    const {
      activeItem,
      onSelectQuantity,
      selectedQuantity,
      className,
    } = this.props
    return (
      <FeatureCheck flag="FEATURE_PDP_QUANTITY">
        <div className={`ProductQuantity ${className}`}>
          <Select
            className="ProductQuantity-quantities Select--inlineLabel"
            selectContainerClassName="ProductQuantity-selectContainer"
            onChange={(evt) => onSelectQuantity(parseInt(evt.target.value, 10))}
            options={this.getQuantityOptions(activeItem.quantity)}
            label={l`Qty`}
            name="productQuantity"
            value={`${selectedQuantity}`}
            isDisabled={isEmpty(activeItem)}
          />
        </div>
      </FeatureCheck>
    )
  }
}
