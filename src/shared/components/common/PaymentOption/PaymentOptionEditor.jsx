import React from 'react'
import PropTypes from 'prop-types'
import { KLARNA } from '../../../constants/paymentTypes'
import KlarnaForm from '../../containers/CheckoutV2/Klarna/KlarnaForm'
import CardPaymentMethod from '../../containers/CheckoutV2/shared/PaymentDetails/PaymentMethods/CardPaymentMethod'

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

const EditorForCard = () => (
  <CardPaymentMethod
    isPaymentCard
    formCardPath={cardPath}
    formCardErrorPath={cardErrorPath}
    formCardName={cardName}
  />
)
const EditorForNOOP = () => null
const EditorForAccnt = (
  <CardPaymentMethod
    formCardPath={cardPath}
    formCardErrorPath={cardErrorPath}
    formCardName={cardName}
  />
)
const EditorForKlarna = KlarnaForm

function showLoginNotice(props) {
  return !['CARD', 'ACCNT'].includes(props.type)
}

function getEditor(props) {
  const {
    type,
    EditorForCard,
    EditorForAccnt,
    EditorForKlarna,
    EditorForNOOP,
  } = props

  if (type === KLARNA) return EditorForKlarna
  if (type === 'CARD') return EditorForCard
  if (type === 'ACCNT') return EditorForAccnt

  return EditorForNOOP
}

function PaymentOptionEditor(props, context) {
  const { l } = context
  const { label, getEditor, showLoginNotice, type } = props
  const Editor = getEditor(props)

  return (
    <div className="PaymentOptionEditor">
      {showLoginNotice(props) && (
        <p className="PaymentOptionEditor-loginNotice">
          {type !== KLARNA &&
            l`You will be asked to log onto ${label} to confirm your next order`}
        </p>
      )}
      <Editor />
    </div>
  )
}

PaymentOptionEditor.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  getEditor: PropTypes.func,
  showLoginNotice: PropTypes.func,
  EditorForCard: PropTypes.func,
  EditorForAccnt: PropTypes.func,
  EditorForKlarna: PropTypes.func,
  EditorForNOOP: PropTypes.func,
  /* eslint-enable */
}

PaymentOptionEditor.defaultProps = {
  getEditor,
  showLoginNotice,
  EditorForNOOP,
  EditorForCard,
  EditorForAccnt,
  EditorForKlarna,
}

PaymentOptionEditor.contextTypes = {
  l: PropTypes.func,
}

export default PaymentOptionEditor
