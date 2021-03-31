import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// components
import PaymentMethodPreviewEditable from '../../../common/PaymentMethodPreviewEditable/PaymentMethodPreviewEditable'
import MCDPaymentMethodPreview from './MCDPaymentMethodPreview'
import MCDPaymentOptions from './MCDPaymentOptions'

// selectors
import { getMyCheckoutDetailsEditingEnabled } from '../../../../selectors/common/accountSelectors'

// actions
import {
  setMyCheckoutDetailsInitialFocus,
  resetMyCheckoutDetailsForms,
} from '../../../../actions/common/accountActions'

const mapStateToProps = (state) => ({
  isEditingEnabled: getMyCheckoutDetailsEditingEnabled(state),
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onEnableEditingClick: () => {
      dispatch(resetMyCheckoutDetailsForms(ownProps.user))
      dispatch(setMyCheckoutDetailsInitialFocus(ownProps.scrollSelector))
      browserHistory.push('/my-account/details/edit')
    },
  }
}

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  PaymentMethodPreview: MCDPaymentMethodPreview,
  PaymentMethodOptions: MCDPaymentOptions,
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  PaymentMethodPreviewEditable
)
