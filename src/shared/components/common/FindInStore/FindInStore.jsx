import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEmpty, path } from 'ramda'
import {
  setStoreStockList,
  setStoreStockListProps,
  updateFindInStoreActiveItem,
  clearFindInStoreActiveItem,
} from '../../../actions/components/FindInStoreActions'
import {
  setSelectedPlace,
  resetRecentStores,
} from '../../../actions/components/UserLocatorActions'
import {
  setFormField,
  touchedFormField,
} from '../../../actions/common/formActions'
import { closeModal } from '../../../actions/common/modalActions'
import {
  getStoreForModal,
  resetStoreLocator,
  changeFulfilmentStore,
  getRecentStores,
  initMapWhenGoogleMapsAvailable,
} from '../../../actions/components/StoreLocatorActions'
import { updateActiveItem } from '../../../actions/common/productsActions'
import ProductSizes from '../ProductSizes/ProductSizes'
import UserLocatorInput from '../UserLocatorInput/UserLocatorInput'
import Image from '../../common/Image/Image'
import Price from '../../common/Price/Price'
import GoogleMap from '../../common/StoreLocator/GoogleMap'
import StoreList from '../../common/StoreLocator/StoreList'
import { getItem } from '../../../../client/lib/cookie'
import { validate } from '../../../lib/validator'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../../shared/analytics'
import { isFeatureCFSIEnabled } from '../../../selectors/featureSelectors'
import DynamicGoogleMap from '../StoreLocator/DynamicGoogleMap'
import { getMapCentrePointAndZoom } from '../../../selectors/storeLocatorSelectors'
import Form from '../FormComponents/Form/Form'

const validateFindInStore = ({ activeItem, l }) =>
  validate({ productSizes: 'productSize' }, { productSizes: activeItem }, l)

@analyticsDecorator(GTM_CATEGORY.FIND_IN_STORE, {
  isAsync: true,
  suppressPageTypeTracking: true,
})
@connect(
  (state) => ({
    activeItem: state.findInStore.activeItem,
    activeItemProductDetails: state.productDetail.activeItem,
    isMobile: state.viewport.media === 'mobile',
    isStoresLoading: state.storeLocator.loading,
    location: state.routing.location,
    stores: state.storeLocator.stores,
    storeListOpen: state.findInStore.storeListOpen,
    storeLocatorProps: state.findInStore.storeLocatorProps,
    viewportHeight: state.viewport.height,
    CFSi: isFeatureCFSIEnabled(state),
    recentStores: state.userLocator.recentStores,
    mapCentrePointAndZoom: getMapCentrePointAndZoom(state),
  }),
  {
    setStoreStockList,
    setStoreStockListProps,
    updateFindInStoreActiveItem,
    setSelectedPlace,
    resetRecentStores,
    setFormField,
    closeModal,
    getStoreForModal,
    resetStoreLocator,
    touchedFormField,
    changeFulfilmentStore,
    getRecentStores,
    clearFindInStoreActiveItem,
    initMapWhenGoogleMapsAvailable,
    updateActiveItem,
  }
)
class FindInStore extends Component {
  static propTypes = {
    activeItem: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
    siteId: PropTypes.number,
    resetStoreLocator: PropTypes.func.isRequired,
    setStoreStockList: PropTypes.func.isRequired,
    updateFindInStoreActiveItem: PropTypes.func.isRequired,
    viewportHeight: PropTypes.number.isRequired,
    getStoreForModal: PropTypes.func,
    isMobile: PropTypes.bool,
    isStoresLoading: PropTypes.bool,
    stores: PropTypes.array,
    CFSi: PropTypes.bool,
    getRecentStores: PropTypes.func,
    setFormField: PropTypes.func,
    setSelectedPlace: PropTypes.func,
    resetRecentStores: PropTypes.func,
    changeFulfilmentStore: PropTypes.func,
    clearFindInStoreActiveItem: PropTypes.func,
    updateActiveItem: PropTypes.func,
    mapCentrePointAndZoom: PropTypes.object,
  }
  static contextTypes = {
    l: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.state = {
      recent: [],
      shouldValidate: false,
      dimensions: null,
    }
  }

  UNSAFE_componentWillMount() {
    const {
      CFSi,
      updateFindInStoreActiveItem,
      activeItem,
      activeItemProductDetails,
    } = this.props
    if (CFSi) {
      this.getRecentStoreCookie()
    }
    if (isEmpty(activeItem) && !isEmpty(activeItemProductDetails))
      updateFindInStoreActiveItem(activeItemProductDetails)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isMobile, closeModal } = this.props
    if (nextProps.isMobile && isMobile !== nextProps.isMobile) {
      closeModal()
    }

    if (path(['recentStores', 0, 'place_id'], nextProps)) {
      const recent = this.state.recent
      if (
        !recent.some((elem) => {
          return elem.place_id === nextProps.recentStores[0].place_id
        })
      ) {
        // it's done like this because autocomplete is called one at a time
        recent.push(nextProps.recentStores[0])
        this.setState({ recent })
      }
    } else {
      this.setState({ recent: [] })
    }
  }

  componentWillUnmount() {
    const {
      resetStoreLocator,
      setStoreStockList,
      activeItem,
      clearFindInStoreActiveItem,
    } = this.props
    setStoreStockList(false)
    resetStoreLocator()
    if (!isEmpty(activeItem)) clearFindInStoreActiveItem()
  }

  renderProductSizes = ({ productSizes: productSizeError }) => {
    const { l } = this.context
    const {
      activeItem,
      isMobile,
      updateFindInStoreActiveItem,
      updateActiveItem,
      product: { productId, items, stockThreshold },
    } = this.props
    const { shouldValidate } = this.state
    if (items.length <= 1) return null

    return (
      <div>
        {isMobile && (
          <p
            data-modal-focus
            tabIndex="0"
          >{l`Which size are you looking for?`}</p>
        )}
        <ProductSizes
          className="FindInStore-productSizes"
          label={l`Size`}
          items={items}
          productId={productId}
          activeItem={activeItem}
          clickHandler={updateFindInStoreActiveItem}
          showLowStockLabel={false}
          showOutOfStockLabel={false}
          enableOutOfStockSelectedItems
          forceToUseSelect={!isMobile}
          error={shouldValidate ? productSizeError : ''}
          stockThreshold={stockThreshold}
          onSelectSize={updateActiveItem}
        />
        {isMobile && (
          <p className="FindInStore-disclaimer">{l`Please note stock moves quickly and we cannot guarantee availability.`}</p>
        )}
      </div>
    )
  }

  getSizeIndex() {
    const {
      activeItem: { size },
      product: { items },
    } = this.props
    return items.findIndex((item) => item.size === size)
  }

  getProductInformations = (errors) => {
    const { l } = this.context
    const { activeItem, isMobile, product } = this.props

    if (!product || !activeItem) return null

    const { assets, colour, lineNumber, name, unitPrice } = product

    if (isMobile) {
      return (
        <div>
          <h3 className="FindInStore-title">{name}</h3>
          {this.renderProductSizes(errors)}
        </div>
      )
    }
    const asset = assets.find((asset) => asset.assetType === 'IMAGE_THUMB')
    return (
      <div>
        <h3 className="FindInStore-title">{l`Find in store`}</h3>
        <div className="FindInStore-row">
          <div>
            <Image className="FindInStore-image" src={asset.url} />
          </div>
          <div className="FindInStore-productDetails">
            <p className="FindInStore-name">{name}</p>
            <p className="FindInStore-infoProduct">
              <span>{l`Price`}: </span>
              <Price className="FindInStore-price" price={unitPrice} />
            </p>
            <p className="FindInStore-infoProduct">
              <span className="FindInStore-colour">{l`Colour`}: </span>
              <span>{colour}</span>
            </p>
            <p className="FindInStore-infoProduct">
              {this.renderProductSizes(errors)}
            </p>
            <p className="FindInStore-productCode">
              {l`Item code`}: {lineNumber}
            </p>
            <p className="FindInStore-disclaimer">{l`Please note stock moves quickly and we cannot guarantee availability.`}</p>
          </div>
        </div>
      </div>
    )
  }

  getStoreLocator = (isStoresListOpen, errors) => {
    const {
      product: { productDataQuantity },
    } = this.props
    const sizeIndex = this.getSizeIndex()
    return (
      <div className="FindInStore-row">
        <div className="FindInStore-columnLeftStores">
          <Form
            className={`FindInStore-search`}
            onSubmit={(event) => this.submitHandler(event, errors)}
          >
            <UserLocatorInput
              submitHandler={(event) => this.submitHandler(event, errors)}
              selectedCountry="United Kingdom"
            />
          </Form>
          {isStoresListOpen ? (
            <StoreList
              name="FindInStore"
              storeType="findInStore"
              selectCFSIStore={this.submitHandlerCFSI}
              sizeIndex={sizeIndex}
              productDataQuantity={productDataQuantity}
            />
          ) : null}
        </div>
      </div>
    )
  }

  submitHandler = (event, errors) => {
    const { activeItem, getStoreForModal, product } = this.props
    if (event) event.preventDefault()
    if ((isEmpty(errors) && product) || product.items[0].size === 'ONE') {
      getStoreForModal('findInStore', activeItem)
    } else {
      this.setState({
        shouldValidate: true,
      })
    }
  }

  submitHandlerCFSI = (selectedStore) => {
    const { closeModal, changeFulfilmentStore } = this.props
    changeFulfilmentStore(selectedStore)
    closeModal()
  }

  getRecentStoreCookie = () => {
    const recentStores = getItem('WC_physicalStores')
    const { getRecentStores, siteId } = this.props
    if (!recentStores) return false

    const recentStoreList = recentStores.split('|').join()
    getRecentStores({
      search: `?storeIds=${recentStoreList}&brandPrimaryEStoreId=${siteId}`,
    })
  }

  selectRecent = (store) => {
    this.props.setSelectedPlace(store)
    this.props.resetRecentStores()
    this.props.setFormField('userLocator', 'userLocation', store.description)
  }

  getRecentStores = () => {
    let recentStores = getItem('WC_physicalStores')
    if (recentStores) {
      recentStores = recentStores.split('|')
    }
    return (
      <ul className="FindInStore-recentStoreList">
        {this.state.recent.map((store, i) => {
          store = this.state.recent.find((id) => {
            return recentStores[i] === id.storeId
          })
          return store ? (
            <li
              role="presentation"
              key={store.place_id}
              className="FindInStore-recentStoreListItem"
              onClick={() => this.selectRecent(store)}
            >
              <button>{store.description}</button>
            </li>
          ) : null
        })}
      </ul>
    )
  }

  render() {
    const { l } = this.context
    const {
      activeItem,
      CFSi,
      isMobile,
      isStoresLoading,
      stores,
      viewportHeight,
      product: { items },
      mapCentrePointAndZoom: { lat, long, zoom, markers, iconDomain },
      initMapWhenGoogleMapsAvailable,
    } = this.props

    const { dimensions } = this.state
    const isStoresListOpen = stores && stores.length > 0
    const contentHeight = this.leftColumn && this.leftColumn.scrollHeight
    const storesListOffset = isStoresListOpen ? 60 : 30
    const storesListOpenClass = isStoresListOpen ? ' is-storesListOpen' : ''
    const styles = {
      heightMobile: !isStoresListOpen
        ? contentHeight
        : viewportHeight - storesListOffset,
      heightDesktop: 'auto',
    }

    const errors = validateFindInStore({ activeItem, l })
    return (
      <div
        className={`FindInStore${storesListOpenClass}`}
        style={{
          height: isMobile ? styles.heightMobile : styles.heightDesktop,
        }}
      >
        <div
          className="FindInStore-columnLeft"
          ref={(leftColumn) => {
            this.leftColumn = leftColumn
          }}
        >
          <div className="FindInStore-content">
            {this.getProductInformations(errors)}
          </div>
          {isMobile &&
            items.length <= 1 && (
              <p className="FindInStore-disclaimer">{l`Please note stock moves quickly and we cannot guarantee availability.`}</p>
            )}
          {this.getStoreLocator(isStoresListOpen, errors)}
          {CFSi && this.state.recent.length > 0 && this.getRecentStores()}
        </div>
        <div
          className="FindInStore-columnRight"
          ref={(rightColumn) => {
            if (rightColumn && !dimensions) {
              setTimeout(() => {
                this.setState({
                  dimensions: {
                    width: rightColumn.offsetWidth,
                    height: rightColumn.offsetHeight,
                  },
                })
              }, 300)
            }
          }}
        >
          {isMobile && (
            <DynamicGoogleMap
              initMapWhenGoogleMapsAvailable={initMapWhenGoogleMapsAvailable}
            />
          )}
          {process.browser &&
            !isMobile &&
            !isStoresLoading &&
            !!dimensions && (
              <GoogleMap
                currentLat={lat}
                currentLng={long}
                markers={markers}
                dimensions={dimensions}
                iconDomain={iconDomain}
                zoom={zoom}
              />
            )}
        </div>
      </div>
    )
  }
}

export default FindInStore
