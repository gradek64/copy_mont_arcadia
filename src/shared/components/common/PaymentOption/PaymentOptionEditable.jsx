import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { omit } from 'ramda'

// Components
import PaymentOption from './PaymentOption'
import PaymentOptionEditor from './PaymentOptionEditor'

export function showEditor(props) {
  return props.isChecked
}

class PaymentOptionEditable extends Component {
  render() {
    const {
      type,
      label,
      showEditor,
      optionEditorProps,
      PaymentOption,
      PaymentOptionEditor,
    } = this.props

    const option = omit(
      [
        'showEditor',
        'optionEditorProps',
        'PaymentOption',
        'PaymentOptionEditor',
      ],
      this.props
    )

    return (
      <PaymentOption {...option}>
        {showEditor(this.props) && (
          <PaymentOptionEditor
            type={type}
            label={label}
            {...optionEditorProps}
          />
        )}
      </PaymentOption>
    )
  }
}

PaymentOptionEditable.propTypes = {
  ...PaymentOption.propTypes,
  showEditor: PropTypes.func,
  PaymentOption: PropTypes.func,
  PaymentOptionEditor: PropTypes.func,
}

PaymentOptionEditable.defaultProps = {
  showEditor,
  PaymentOption,
  PaymentOptionEditor,
}

export default PaymentOptionEditable
