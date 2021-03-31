import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// components
import AddressPreviewEditable from '../../../common/AddressPreviewEditable/AddressPreviewEditable'
import DeliveryAddressPreview from './DeliveryAddressPreview'
import DeliveryAddressForm from './DeliveryAddressForm'
import DeliveryDetailsForm from './DeliveryDetailsForm'

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
  DetailsForm: DeliveryDetailsForm,
  AddressForm: DeliveryAddressForm,
  AddressPreview: DeliveryAddressPreview,
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  AddressPreviewEditable
)
