import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// components
import AddressPreviewEditable from '../../../common/AddressPreviewEditable/AddressPreviewEditable'
import BillingAddressPreview from './BillingAddressPreview'
import BillingAddressForm from './BillingAddressForm'
import BillingDetailsForm from './BillingDetailsForm'

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
  DetailsForm: BillingDetailsForm,
  AddressForm: BillingAddressForm,
  AddressPreview: BillingAddressPreview,
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  AddressPreviewEditable
)
