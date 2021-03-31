import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { isMobile } from '../../../../selectors/viewportSelectors'
import {
  isStoreOrParcelDelivery,
  isDeliveryStoreChoiceAccepted,
  getSelectedStoreDetails,
  getSelectedDeliveryLocationType,
} from '../../../../selectors/checkoutSelectors'

// actions
import { showModal, closeModal } from '../../../../actions/common/modalActions'
import { setStoreUpdating } from '../../../../actions/common/checkoutActions'
import { searchStoresCheckout } from '../../../../actions/components/UserLocatorActions'

// components
import Button from '../../../common/Button/Button'
import DeliveryDetailsForm from './DetailsForm/DeliveryDetailsForm'
import UserLocatorInput from '../../../common/UserLocatorInput/UserLocatorInput'
import CollectFromStore from '../../../common/CollectFromStore/CollectFromStore'
import Form from '../../../common/FormComponents/Form/Form'
import CheckoutPrimaryTitle from '../shared/CheckoutPrimaryTitle'

const mapStateToProps = (state) => ({
  isMobile: isMobile(state),
  isStoreUpdating: state.checkout.storeUpdating,
  isStoreOrParcelDelivery: isStoreOrParcelDelivery(state),
  isDeliveryStoreChoiceAccepted: isDeliveryStoreChoiceAccepted(state),
  storeDetails: getSelectedStoreDetails(state),
  selectedDeliveryLocationType: getSelectedDeliveryLocationType(state),
})

const mapDispatchToProps = {
  showModal,
  closeModal,
  setStoreUpdating,
  searchStoresCheckout,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class StoreDeliveryContainer extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    isStoreUpdating: PropTypes.bool,
    isStoreOrParcelDelivery: PropTypes.bool,
    isDeliveryStoreChoiceAccepted: PropTypes.bool,
    storeDetails: PropTypes.object,
    searchStoresCheckout: PropTypes.func.isRequired,
    setStoreUpdating: PropTypes.func.isRequired,
    selectedDeliveryLocationType: PropTypes.string.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    if (this.showStoreLocatorModalOnMount()) {
      this.openCollectFromStoreModal()
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.storeOrParcelDeliveryHasJustBeenSelected(props)) {
      this.openCollectFromStoreModal()
    }
  }

  isDeliveryStoreChosen() {
    return !!this.props.storeDetails && this.props.isDeliveryStoreChoiceAccepted
  }

  storeOrParcelDeliveryHasJustBeenSelected(props) {
    const { isMobile, isStoreUpdating, isStoreOrParcelDelivery } = props

    return !isMobile && isStoreOrParcelDelivery && isStoreUpdating
  }

  showStoreLocatorModalOnMount() {
    const { isMobile, isStoreOrParcelDelivery } = this.props

    return !isMobile && isStoreOrParcelDelivery && !this.isDeliveryStoreChosen()
  }

  showStoreLocatorForm() {
    const { isMobile, isStoreUpdating, isStoreOrParcelDelivery } = this.props

    return (
      (isMobile && isStoreOrParcelDelivery && isStoreUpdating) ||
      (isMobile && isStoreOrParcelDelivery && !this.isDeliveryStoreChosen())
    )
  }

  showSelectedStoreDetails() {
    const {
      isStoreUpdating,
      isStoreOrParcelDelivery,
      isDeliveryStoreChoiceAccepted,
    } = this.props

    return (
      !isStoreUpdating &&
      isStoreOrParcelDelivery &&
      this.isDeliveryStoreChosen() &&
      isDeliveryStoreChoiceAccepted
    )
  }

  get getDeliveryToAnother() {
    return `Deliver to another ${this.deliveryStoreTypeLabel}`
  }

  get storeSelectionButtonLabel() {
    const prefix = this.props.isDeliveryStoreChoiceAccepted
      ? 'Change'
      : 'Choose'
    return `${prefix} ${this.deliveryStoreTypeLabel}`
  }

  get deliveryStoreTypeLabel() {
    if (this.props.selectedDeliveryLocationType === 'STORE') {
      return 'store'
    }

    if (this.props.selectedDeliveryLocationType === 'PARCELSHOP') {
      return 'shop'
    }

    return ''
  }

  goToDeliveryStoreLocator = (event) => {
    event.preventDefault()
    this.props.searchStoresCheckout()
  }

  changeStore = () => {
    const { isMobile, setStoreUpdating } = this.props

    setStoreUpdating(true)

    if (!isMobile) {
      this.openCollectFromStoreModal()
    }
  }

  openCollectFromStoreModal() {
    const { showModal } = this.props
    showModal(<CollectFromStore />, { mode: 'storeLocator' })
  }

  componentWillUnmount() {
    this.props.closeModal()
  }

  render() {
    const { l } = this.context
    const { storeDetails: store, isMobile } = this.props

    if (!this.props.isStoreOrParcelDelivery) {
      return null
    }

    return (
      <article className="StoreDeliveryContainer">
        {this.showStoreLocatorForm() && (
          <Form
            className="StoreDeliveryContainer-searchForm"
            onSubmit={this.goToDeliveryStoreLocator}
          >
            <UserLocatorInput
              selectedCountry="United Kingdom"
              submitHandler={this.goToDeliveryStoreLocator}
            />
          </Form>
        )}

        {this.showSelectedStoreDetails() && (
          <article className="StoreDeliveryContainer-address">
            <div className="StoreDeliveryContainer-titleContainer">
              <CheckoutPrimaryTitle title="Collection Point" />
              <button
                className="StoreDeliveryContainer-changeStoreCTA"
                onClick={this.changeStore}
              >
                CHANGE
              </button>
            </div>
            <div className="StoreDeliveryContainer-addressLines">
              {store.storeName && (
                <p className="StoreDeliveryContainer-storeName">
                  {store.storeName}
                </p>
              )}
              {store.address1 && (
                <p className="StoreDeliveryContainer-addressLine">
                  {store.address1}
                </p>
              )}
              {store.address2 && (
                <p className="StoreDeliveryContainer-addressLine">
                  {store.address2}
                </p>
              )}
              {store.city && (
                <p className="StoreDeliveryContainer-addressLine">
                  {store.city}
                </p>
              )}
              {store.postcode && (
                <p className="StoreDeliveryContainer-addressLine">
                  {store.postcode}
                </p>
              )}
            </div>
          </article>
        )}

        {!isMobile &&
          !this.showSelectedStoreDetails() && (
            <div className="StoreDeliveryContainer-changeStoreBtnContainer">
              <Button
                className="StoreDeliveryContainer-changeStoreCTA"
                clickHandler={this.changeStore}
              >
                {l(this.storeSelectionButtonLabel)}
              </Button>
            </div>
          )}

        {this.showSelectedStoreDetails() && (
          <div className="StoreDeliveryContainer-yourDetailsContainer">
            <DeliveryDetailsForm isCollection />
          </div>
        )}
      </article>
    )
  }
}

export default StoreDeliveryContainer
