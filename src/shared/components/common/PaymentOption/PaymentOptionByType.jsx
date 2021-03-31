import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { omit } from 'ramda'
import PaymentOption from './PaymentOption'
import { getPaymentOptionByType } from '../../../selectors/paymentMethodSelectors'

function PaymentOptionByType(props) {
  const { PaymentOption } = props
  const p = omit(['PaymentOption'], props)
  return p.value ? <PaymentOption {...p} /> : null
}

PaymentOptionByType.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  type: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  PaymentOption: PropTypes.func,
  value: PropTypes.string,
  /* eslint-enable */
}

PaymentOptionByType.defaultProps = {
  PaymentOption,
}

const mapStateToProps = (state, props) => ({
  ...getPaymentOptionByType(state, props.type),
  ...props,
})

export default connect(mapStateToProps)(PaymentOptionByType)

export { PaymentOptionByType as WrappedPaymentOptionByType }
