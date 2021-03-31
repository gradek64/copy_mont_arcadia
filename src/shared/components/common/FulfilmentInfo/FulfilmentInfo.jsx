import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { path } from 'ramda'
import {
  getFulfilmentStore,
  getSelectedStoreIdFromCookie,
} from '../../../actions/components/StoreLocatorActions'
import { getFulfilmentDetails } from '../../../lib/get-delivery-days/get-fulfilments'

import Loader from '../Loader/Loader'

@connect(
  (state) => ({
    brandName: state.config.brandName,
    selectedStore: state.storeLocator.selectedStore,
    selectedStoreSKU: state.storeLocator.selectedStoreSKU,
    selectedStoreId: state.storeLocator.selectedStoreId,
  }),
  { getFulfilmentStore, getSelectedStoreIdFromCookie }
)
class FulfilmentInfo extends Component {
  static propTypes = {
    siteId: PropTypes.number,
    getFindInStoreButton: PropTypes.func,
    selectedStore: PropTypes.object,
    selectedStoreSKU: PropTypes.string,
    getFulfilmentStore: PropTypes.func,
    getSelectedStoreIdFromCookie: PropTypes.func,
    selectedStoreId: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    activeProduct: PropTypes.object,
    brandName: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      calledStoreSearch: false,
    }
  }

  componentDidMount() {
    this.props.getSelectedStoreIdFromCookie()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedStoreId } = nextProps

    const getActiveSKU = path(['activeProduct', 'sku'])

    if (
      getActiveSKU(nextProps) &&
      selectedStoreId &&
      (getActiveSKU(nextProps) !== getActiveSKU(this.props) ||
        !this.state.calledStoreSearch)
    ) {
      this.setState({
        calledStoreSearch: true,
      })
      this.getSelectedStore(nextProps)
    }
  }

  getSelectedStore = (nextProps) => {
    const {
      siteId,
      activeProduct: { sku },
      selectedStoreId,
    } = nextProps
    this.props.getFulfilmentStore(
      {
        search: `?storeIds=${selectedStoreId}&brandPrimaryEStoreId=${siteId}&skuList=${sku}`,
      },
      true,
      sku
    )
  }

  getStoreName = () => {
    const { selectedStore } = this.props
    return (
      path(['brandName'], selectedStore) &&
      `${selectedStore.brandName} ${selectedStore.name}`
    )
  }

  getDescription() {
    const {
      selectedStore,
      siteId,
      getFindInStoreButton,
      brandName,
    } = this.props

    // Check to see if selectedStore not equal to current site
    const storeName =
      (path(['brandPrimaryEStoreId'], selectedStore) &&
        parseInt(selectedStore.brandPrimaryEStoreId, 10) !== siteId) ||
      (path(['brandName'], selectedStore) &&
        selectedStore.brandName.replace(/\s/g, '').toLowerCase() !== brandName)
        ? null
        : this.getStoreName()

    return storeName ? (
      <span>
        In stock at {getFindInStoreButton({ type: 'link', text: storeName })}
      </span>
    ) : (
      <span>
        Click to {getFindInStoreButton({ type: 'link', text: 'find in store' })}
      </span>
    )
  }

  render() {
    const {
      selectedStore,
      activeProduct,
      selectedStoreSKU,
      brandName,
    } = this.props

    const selectedFulfilmentStore =
      path(['brandName'], selectedStore) &&
      selectedStore.brandName.replace(/\s/g, '').toLowerCase() === brandName
        ? selectedStore
        : {}

    const { CFSiDay, expressDeliveryDay, parcelCollectDay } = activeProduct
      ? getFulfilmentDetails(activeProduct, selectedFulfilmentStore)
      : {}

    if (!(CFSiDay || expressDeliveryDay || parcelCollectDay) || !activeProduct)
      return null

    const description = this.getDescription()
    const showSpinner =
      this.state.calledStoreSearch && activeProduct.sku !== selectedStoreSKU

    const cfsIcon = `/assets/${brandName}/images/${
      CFSiDay === 'today' ? 'cfsi' : 'cfs'
    }.svg`
    const expressIcon = `/assets/${brandName}/images/express-delivery.svg`
    const parcelIcon = `/assets/${brandName}/images/parcelshop.svg`

    return (
      <div
        className={`FulfilmentInfo${
          showSpinner ? ' FulfilmentInfo--loading' : ''
        }`}
      >
        {showSpinner && (
          <div className="FulfilmentInfo-spinner">
            <Loader />
          </div>
        )}

        {CFSiDay && (
          <div
            className={`FulfilmentInfo-item FulfilmentInfo-cfsi${
              CFSiDay === 'today' ? ' FulfilmentInfo-today' : ''
            }`}
          >
            <img className="FulfilmentInfo-icon" src={cfsIcon} alt="" />
            <h5 className="FulfilmentInfo-title">Collect {CFSiDay}</h5>
            <p className="FulfilmentInfo-description">{description}</p>
          </div>
        )}

        {expressDeliveryDay && (
          <div className="FulfilmentInfo-item FulfilmentInfo-expressShipping">
            <img className="FulfilmentInfo-icon" src={expressIcon} alt="" />
            <h5 className="FulfilmentInfo-title">
              Delivered {expressDeliveryDay}
            </h5>
            <p className="FulfilmentInfo-description">with Express Shipping</p>
          </div>
        )}

        {parcelCollectDay && (
          <div className="FulfilmentInfo-item FulfilmentInfo-parcelCollect">
            <img className="FulfilmentInfo-icon" src={parcelIcon} alt="" />
            <h5 className="FulfilmentInfo-title">Collect {parcelCollectDay}</h5>
            <p className="FulfilmentInfo-description">
              From a Parcel Shop near you
            </p>
          </div>
        )}
      </div>
    )
  }
}

export default FulfilmentInfo
