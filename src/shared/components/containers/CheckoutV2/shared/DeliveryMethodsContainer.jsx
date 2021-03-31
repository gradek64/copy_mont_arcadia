import { connect } from 'react-redux'

// selectors
import {
  getSelectedDeliveryMethods,
  getDeliveryCountry,
  getSelectedDeliveryOptionFromBasket,
  getDeliveryDate,
  getSavedAddresses,
  isGuestOrder,
} from '../../../../selectors/checkoutSelectors'
import {
  getDDPDefaultName,
  isDDPActiveBannerEnabled,
  isDDPPromotionEnabled,
  showDDPPromo,
  isDDPOrder,
} from '../../../../selectors/ddpSelectors'
import { isFeatureDDPEnabled } from '../../../../selectors/featureSelectors'
import { getBrandName } from '../../../../selectors/configSelectors'

// actions
import {
  selectDeliveryOption,
  selectDeliveryType,
} from '../../../../actions/common/checkoutActions'
import withRestrictedActionDispatch from '../../../../lib/restricted-actions'

// components
import DeliveryMethods from './DeliveryMethods/DeliveryMethods'

const mapStateToProps = (state) => ({
  deliveryMethods: getSelectedDeliveryMethods(state),
  brandName: getBrandName(state),
  ddpDefaultName: getDDPDefaultName(state),
  isDDPActiveBannerEnabled: isDDPActiveBannerEnabled(state),
  isDDPEnabled: isFeatureDDPEnabled(state),
  isDDPPromoEnabled: isDDPPromotionEnabled(state),
  isDDPOrder: isDDPOrder(state),
  showDDPPromo: showDDPPromo(state),
  deliveryCountry: getDeliveryCountry(state),
  selectedDeliveryOptionFromBasket: getSelectedDeliveryOptionFromBasket(state),
  deliveryDate: getDeliveryDate(state),
  savedAddresses: getSavedAddresses(state),
  isGuestOrder: isGuestOrder(state),
})

const mapDispatchToProps = {
  onDeliveryMethodChange: selectDeliveryType,
  onDeliveryOptionsChange: selectDeliveryOption,
}

export default withRestrictedActionDispatch({
  selectDeliveryType,
  selectDeliveryOption,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeliveryMethods)
)
