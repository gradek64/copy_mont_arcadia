import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import QubitReact from 'qubit-react/wrapper'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// components
import QuickViewOrderSummary from '../../../common/QuickViewOrderSummary/QuickViewOrderSummary'
import CollectFromStore from '../../../common/CollectFromStore/CollectFromStore'
import HomeDelivery from './HomeDelivery'
import StoreDelivery from './StoreDelivery'
import DeliveryOptionsContainer from '../shared/DeliveryOptionsContainer'
import TotalCost from '../shared/TotalCost'
import OrderSummaryEspot from './OrderSummaryEspot'
import CountrySelect from '../../../common/FormComponents/CountrySelect/CountrySelect'
import Separator from '../../../common/Separator/Separator'

// actions
import {
  selectDeliveryLocation,
  setDeliveryAsBilling,
  setDeliveryAsBillingFlag,
  copyDeliveryValuesToBillingForms,
  validateForms,
  setShowCollectFromStoreModal,
} from '../../../../actions/common/checkoutActions'
import { showModal } from '../../../../actions/common/modalActions'
import { openMiniBag } from '../../../../actions/common/shoppingBagActions'
import { touchedMultipleFormFields } from '../../../../actions/common/formActions'
import { isMobile } from '../../../../selectors/viewportSelectors'
import { sendEvent } from '../../../../actions/common/googleAnalyticsActions'

// selectors
import {
  getDeliveryPageFormNames,
  getOrderCost,
  hasSelectedStore,
  selectedDeliveryLocationTypeEquals,
  shouldShowCollectFromStore,
  getCheckoutOrderSummaryShippingCountry,
} from '../../../../selectors/checkoutSelectors'
import {
  isDDPOrder,
  isDDPStandaloneOrder,
} from '../../../../selectors/ddpSelectors'
import {
  isFeatureMobileCheckoutEspotEnabled,
} from '../../../../selectors/featureSelectors'
import { validateDDPForCountry } from '../../../../../shared/actions/common/ddpActions'

import analyticsDecorator from '../../../../../client/lib/analytics/analytics-decorator'

const mapStateToProps = (state) => ({
  isDDPStandaloneOrder: isDDPStandaloneOrder(state),
  formNames: getDeliveryPageFormNames(state),
  totalCost: getOrderCost(state),
  isMobile: isMobile(state),
  isHomeDeliverySelected: selectedDeliveryLocationTypeEquals(state, 'HOME'),
  hasSelectedStore: hasSelectedStore(state),
  hasOrderSummary: !isEmpty(state.checkout.orderSummary),
  shippingCountry: getCheckoutOrderSummaryShippingCountry(state),
  isDDPOrder: isDDPOrder(state),
  shouldShowCollectFromStore: shouldShowCollectFromStore(state),
  isFeatureMobileCheckoutEspotEnabled: isFeatureMobileCheckoutEspotEnabled(
    state
  ),
})

const mapDispatchToProps = {
  selectDeliveryLocation,
  showModal,
  openMiniBag,
  setDeliveryAsBilling,
  setDeliveryAsBillingFlag,
  touchedMultipleFormFields,
  copyDeliveryValuesToBillingForms,
  validateForms,
  sendEvent,
  validateDDPForCountry,
  setShowCollectFromStoreModal,
}

class DeliveryContainer extends Component {
  static propTypes = {
    totalCost: PropTypes.number,
    isMobile: PropTypes.bool,
    isHomeDeliverySelected: PropTypes.bool,
    hasOrderSummary: PropTypes.bool,
    isDDPStandaloneOrder: PropTypes.bool.isRequired,
    // actions
    selectDeliveryLocation: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    openMiniBag: PropTypes.func.isRequired,
    setDeliveryAsBilling: PropTypes.func.isRequired,
    setDeliveryAsBillingFlag: PropTypes.func.isRequired,
    sendEvent: PropTypes.func.isRequired,
    isDDPOrder: PropTypes.bool.isRequired,
    shouldShowCollectFromStore: PropTypes.bool,
    isFeatureMobileCheckoutEspotEnabled: PropTypes.bool,
  }

  static defaultProps = {
    isDDPStandaloneOrder: false,
    bagContainsOnlyDDPProduct: false,
    formNames: [],
    formErrors: {},
    totalCost: undefined,
    isMobile: false,
    isHomeDeliverySelected: false,
    hasSelectedStore: false,
    hasOrderSummary: false,
    redirectTo: browserHistory ? browserHistory.push : () => {},
    isDDPOrder: false,
    shouldShowCollectFromStore: false,
    isFeatureMobileCheckoutEspotEnabled: false,
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  state = {
    isScrollToFirstErrorActive: true,
  }

  componentDidMount() {
    if (window) window.scrollTo(0, 0)
    const {
      sendEvent,
    } = this.props
    sendEvent('Checkout', 'Delivery', 'Delivery Options')
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isDDPOrder && this.props.isDDPOrder) {
      const { validateDDPForCountry, shippingCountry } = this.props
      validateDDPForCountry(shippingCountry)
    }
    if (
      !prevProps.shouldShowCollectFromStore &&
      this.props.shouldShowCollectFromStore
    ) {
      this.openCollectFromStoreModal()
    }
  }

  onChangeDeliveryLocation = (deliveryLocation) => {
    const {
      isMobile,
      selectDeliveryLocation,
      setDeliveryAsBilling,
      setDeliveryAsBillingFlag,
      shouldShowCollectFromStore,
    } = this.props

    const isHomeDeliverySelected =
      deliveryLocation.deliveryLocationType === 'HOME'

    setDeliveryAsBilling(isHomeDeliverySelected)
    // DES:1820 - Always set to true
    setDeliveryAsBillingFlag(true)
    selectDeliveryLocation(deliveryLocation)

    if (!isHomeDeliverySelected && !isMobile && shouldShowCollectFromStore) {
      this.openCollectFromStoreModal()
    }
  }

  openCollectFromStoreModal = () => {
    const { showModal, setShowCollectFromStoreModal } = this.props

    setShowCollectFromStoreModal(false)
    showModal(<CollectFromStore />, { mode: 'storeLocator' })
  }

  setScrollToFirstErrorActive = () => {
    this.setState({ isScrollToFirstErrorActive: false })
  }

  render() {
    const { l, p } = this.context
    const {
      isDDPStandaloneOrder,
      totalCost,
      isHomeDeliverySelected,
      isMobile,
      hasOrderSummary,
      openMiniBag,
      isFeatureMobileCheckoutEspotEnabled,
    } = this.props

    if (!hasOrderSummary) {
      return null
    }

    return (
      <section className="DeliveryContainer DeliveryContainer--v2">
        <Helmet title={l`Delivery Options`} />
        <QuickViewOrderSummary
          isMobile={isMobile}
          openMiniBag={openMiniBag}
          totalCost={p(totalCost)}
          l={l}
        />
        {isMobile && <TotalCost totalCost={p(totalCost)} />}
        <QubitReact
          id="qubit-show-delivery-country"
          CountrySelect={CountrySelect}
        >
          {null}
        </QubitReact>
        <div className="DeliveryContainer-contentV2">
          <Separator/>
          {!isDDPStandaloneOrder && (
            <DeliveryOptionsContainer
              onChangeDeliveryLocation={this.onChangeDeliveryLocation}
              setScrollToFirstErrorActive={this.setScrollToFirstErrorActive}
            />
          )}
          <Separator/>
          <OrderSummaryEspot
            isMobile={isMobile}
            isFeatureMobileCheckoutEspotEnabled={
              isFeatureMobileCheckoutEspotEnabled
            }
          />
          {isHomeDeliverySelected ? (
            <HomeDelivery />
          ) : (
            <StoreDelivery
              openCollectFromStoreModal={this.openCollectFromStoreModal}
              isScrollToFirstErrorActive={this.state.isScrollToFirstErrorActive}
            />
          )}
        </div>
      </section>
    )
  }
}

export default analyticsDecorator('delivery-details', { isAsync: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeliveryContainer)
)

export {
  DeliveryContainer as WrappedDeliveryContainer,
  mapStateToProps,
  mapDispatchToProps,
}
