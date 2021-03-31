import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PaymentOptionByType from '../PaymentOption/PaymentOptionByType'
import PaymentOptionEditable from '../PaymentOption/PaymentOptionEditable'
import {
  resetFormPartial,
  setFormField,
} from '../../../actions/common/formActions'
import {
  getMCDAvailablePaymentMethodTypes,
  getSelectedPaymentOptionType,
} from '../../../selectors/paymentMethodSelectors'

const mapStateToProps = (state, props) => ({
  optionTypes: props.optionTypes || getMCDAvailablePaymentMethodTypes(state),
  selectedOptionType:
    props.selectedOptionType || getSelectedPaymentOptionType(state),
})

const mapDispatchToProps = {
  setFormField,
  resetFormPartial,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class PaymentOptions extends Component {
  static propTypes = {
    optionTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedOptionType: PropTypes.string.isRequired,
    optionEditorProps: PropTypes.object,
    PaymentOptionByType: PropTypes.func,
  }

  static defaultProps = {
    PaymentOptionByType,
    optionEditorProps: {},
    PaymentOptionEditable,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  optionIsSelected(type) {
    return this.props.selectedOptionType === type
  }

  handleOptionChange = ({ target: { checked, value } }) => {
    const { resetFormPartial, setFormField } = this.props

    resetFormPartial('paymentCardDetailsMCD', {
      cardNumber: '',
      expiryMonth: '',
      expiryDate: '',
      expiryYear: '',
      cvv: '',
    })

    if (checked) {
      const selectedValue = value === 'CARD' ? 'VISA' : value
      setFormField('paymentCardDetailsMCD', 'paymentType', selectedValue)
    }
  }

  render() {
    const {
      optionTypes,
      PaymentOptionByType,
      optionEditorProps,
      PaymentOptionEditable,
    } = this.props

    const { l } = this.context

    return (
      <article className="PaymentOptions">
        <h3 className="PaymentOptions-heading">{l`Payment details`}</h3>
        <div className="PaymentOptions-list">
          {optionTypes.map((type) => (
            <PaymentOptionByType
              key={type}
              type={type}
              PaymentOption={PaymentOptionEditable}
              isChecked={this.optionIsSelected(type)}
              onChange={this.handleOptionChange}
              optionEditorProps={optionEditorProps}
            />
          ))}
        </div>
      </article>
    )
  }
}

export default PaymentOptions
