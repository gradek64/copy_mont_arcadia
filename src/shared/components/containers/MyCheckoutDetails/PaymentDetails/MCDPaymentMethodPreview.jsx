import { connect } from 'react-redux'

// components
import PaymentMethodPreview from '../../../common/PaymentMethodPreview/PaymentMethodPreview'

// selectors
import { selectPaymentMethodForStoredPaymentDetails } from '../../../../selectors/paymentMethodSelectors'
import { selectStoredPaymentDetails } from '../../../../selectors/common/accountSelectors'

export const mapStateToProps = (state) => ({
  paymentDetails: selectStoredPaymentDetails(state),
  paymentMethod: selectPaymentMethodForStoredPaymentDetails(state),
})

export default connect(mapStateToProps)(PaymentMethodPreview)
