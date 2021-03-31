import React from 'react'
import { connect } from 'react-redux'

// components
import PaymentOptions from '../../../common/PaymentOptions/PaymentOptions'
import CardPaymentMethod from '../../CheckoutV2/shared/PaymentDetails/PaymentMethods/CardPaymentMethod'

// selectors
import { getMCDAvailablePaymentMethodTypes } from '../../../../selectors/paymentMethodSelectors'
import { getUserSelectedPaymentOptionType } from '../../../../selectors/common/accountSelectors'

export const mapStateToProps = (state) => ({
  optionTypes: getMCDAvailablePaymentMethodTypes(state),
  selectedOptionType: getUserSelectedPaymentOptionType(state),
})

// Card Const
const cardPath = [
  'account',
  'myCheckoutDetails',
  'paymentCardDetailsMCD',
  'fields',
]
const cardErrorPath = [
  'forms',
  'account',
  'myCheckoutDetails',
  'paymentCardDetailsMCD',
  'errors',
]
const cardName = 'paymentCardDetailsMCD'

const optionEditorProps = {
  EditorForCard: () => (
    <CardPaymentMethod
      isPaymentCard
      noCVV
      formCardPath={cardPath}
      formCardErrorPath={cardErrorPath}
      formCardName={cardName}
    />
  ),
  EditorForAccnt: () => (
    <CardPaymentMethod
      noCVV
      formCardPath={cardPath}
      formCardErrorPath={cardErrorPath}
      formCardName={cardName}
    />
  ),
  EditorForKlarna: () => null,
}

export const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  optionEditorProps,
})

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(PaymentOptions)
