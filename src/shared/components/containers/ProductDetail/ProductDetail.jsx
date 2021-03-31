import PropTypes from 'prop-types'
import { path, equals, compose, isEmpty } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getRouteFromUrl } from '../../../lib/get-product-route'
import { GTM_CATEGORY } from '../../../../shared/analytics'
import cmsConsts from '../../../constants/cmsConsts'
import espots from '../../../constants/espotsMobile'
import constants from '../../../constants/espotsDesktop'

import {
  closeModal,
  setModalChildren,
  setModalMode,
  showModal,
  toggleModal,
} from '../../../actions/common/modalActions'
import * as FindInStoreActions from '../../../actions/components/FindInStoreActions'
import * as recentlyViewedActions from '../../../actions/common/recentlyViewedActions'
import * as storeLocatorActions from '../../../actions/components/StoreLocatorActions'
import { removeFromVisited } from '../../../actions/common/routingActions'
import {
  updateShowItemsError,
  updateActiveItem,
  updateActiveItemQuantity,
  setPredecessorPage,
  updateSwatch,
} from '../../../actions/common/productsActions'
import { setCarouselIndex } from '../../../actions/common/carousel-actions'
import { getPDPEspots } from '../../../actions/common/espotActions'

import ProductMedia from '../../common/ProductMedia/ProductMedia'
import FeatureCheck from '../../common/FeatureCheck/FeatureCheck'
import HistoricalPrice from '../../common/HistoricalPrice/HistoricalPrice'
import ProductSizes from '../../common/ProductSizes/ProductSizes'
import FitAttributes from '../../common/FitAttributes/FitAttributes'
import Accordion from '../../common/Accordion/Accordion'
import Swatches from '../../common/Swatches/Swatches'
import Recommendations from '../../common/Recommendations/Recommendations'
import RecentlyViewed from '../../common/RecentlyViewed/RecentlyViewed'
import ShopTheLook from '../../common/ShopTheLook/ShopTheLook'
import NotifyProduct from '../../common/NotifyProduct/NotifyProduct'
import BazaarVoiceWidget from '../../common/BazaarVoice/BazaarVoiceWidget/BazaarVoiceWidget'
import AddToBag from '../../common/AddToBag/AddToBag'
import Message from '../../common/FormComponents/Message/Message'
import SizeGuide from '../../common/SizeGuide/SizeGuide'
import ProductQuantity from '../../common/ProductQuantity/ProductQuantity'
import FindInStore from '../../common/FindInStore/FindInStore'
import FindInStoreButton from '../../common/FindInStoreButton/FindInStoreButton'
import SandBox from '../../containers/SandBox/SandBox'
import Espot from '../Espot/Espot'
import BnplPaymentsBreakdown from '../../common/BnplPaymentsBreakdown/BnplPaymentsBreakdown'
import ProductDescription from '../../common/ProductDescription/ProductDescription'
import ProductDescriptionExtras from '../../common/ProductDescriptionExtras/ProductDescriptionExtras'
import FulfilmentInfo from '../../common/FulfilmentInfo/FulfilmentInfo'
import ProductCarouselThumbnails from '../ProductCarouselThumbnails/ProductCarouselThumbnails'
import { Column } from '../../common/Grid'
import LowStock from '../../common/LowStock/LowStock'
import WishlistButton from '../../common/WishlistButton/WishlistButton'
import FreeShippingMessage from '../../common/FreeShippingMessage/FreeShippingMessage'
import Loader from '../../common/Loader/Loader'
import CrossSellLinks from '../../common/CrossSellLinks/CrossSellLinks'
import DressipiRecommendationsRail from '../../common/Recommendations/DressipiRecommendationsRail'
import WithQubit from '../../common/Qubit/WithQubit'
import ProductsBreadcrumbs from '../../common/ProductsBreadCrumbs/ProductsBreadCrumbs'

import { analyticsPdpClickEvent } from '../../../analytics/tracking/site-interactions'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'

// Qubit Wrapper
import QubitReact from 'qubit-react/wrapper'

// selectors
import {
  getActiveProductWithInventory,
  checkIfOOS,
} from '../../../selectors/inventorySelectors'
import {
  isFeatureEnabled,
  isFeatureCFSIEnabled,
  isFeatureFindInStoreEnabled,
  isFeatureWishlistEnabled,
  isPersonalisedEspotsEnabled,
  isFeaturePdpQuantity,
  isFeaturePriceSavingEnabled,
  isFeatureDressipiRecommendationsEnabled,
  isFeatureBnplPaymentsBreakdownPdp,
} from '../../../selectors/featureSelectors'
import { isCFSIEspotEnabled } from '../../../selectors/espotSelectors'

import { isMobile } from '../../../selectors/viewportSelectors'
import {
  enableSizeGuideButtonAsSizeTile,
  enableDropdownForLongSizes,
} from '../../../selectors/brandConfigSelectors'
import {
  getMaximumNumberOfSizeTiles,
  getBrandName,
  getStoreCode,
} from '../../../selectors/configSelectors'
import { getProductDetailSelectedQuantity } from '../../../selectors/productSelectors'

class ProductDetail extends Component {
  static propTypes = {
    activeItem: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    siteId: PropTypes.number.isRequired,
    activeProductWithInventory: PropTypes.object,
    visitedLength: PropTypes.number,
    showItemError: PropTypes.bool,
    sandboxPages: PropTypes.object,
    region: PropTypes.string.isRequired,
    selectedOosItem: PropTypes.object,
    setModalChildren: PropTypes.func,
    setModalMode: PropTypes.func,
    setStoreStockList: PropTypes.func,
    showModal: PropTypes.func,
    storeListOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    brandName: PropTypes.string,
    storeCode: PropTypes.string.isRequired,
    updateFindInStoreActiveItem: PropTypes.func,
    extractRecentlyDataFromProduct: PropTypes.func,
    updateActiveItem: PropTypes.func,
    isFeatureCarouselThumbnailEnabled: PropTypes.bool.isRequired,
    isFeatureFindInStoreEnabled: PropTypes.bool.isRequired,
    updateShowItemsError: PropTypes.func.isRequired,
    maximumNumberOfSizeTiles: PropTypes.number.isRequired,
    enableSizeGuideButtonAsSizeTile: PropTypes.bool.isRequired,
    enableDropdownForLongSizes: PropTypes.bool.isRequired,
    getPDPEspots: PropTypes.func.isRequired,
    isPersonalisedEspotsEnabled: PropTypes.bool.isRequired,
    updateActiveItemQuantity: PropTypes.func.isRequired,
    selectedQuantity: PropTypes.number,
    isThresholdEnabled: PropTypes.bool,
    currentProductGroupingId: PropTypes.string,
    setPredecessorPage: PropTypes.func.isRequired,
    isFeatureDressipiRecommendationsEnabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]).isRequired,
    isFeatureBnplPaymentsBreakdownPdp: PropTypes.bool.isRequired,
    mobileBreadcrumbs: PropTypes.oneOfType([PropTypes.bool, PropTypes.array])
      .isRequired,
  }

  static defaultProps = {
    selectedQuantity: 1,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  shouldAddToBag = ({ showError = true } = {}) => {
    const { activeItem, updateShowItemsError } = this.props
    if (activeItem && activeItem.sku) return true
    if (showError) updateShowItemsError()
    return false
  }

  constructor(props) {
    super(props)
    this.state = {
      showProductVideo: false,
    }
    // redirecting from bundles - removing extra entry from visited
    this.shouldRemoveIfRedirectionFromBundles = true
    this.swatchTriggeredChange = false
  }

  componentDidMount() {
    const {
      product,
      extractRecentlyDataFromProduct,
      isPersonalisedEspotsEnabled,
      getPDPEspots,
    } = this.props
    extractRecentlyDataFromProduct(product)
    if (isPersonalisedEspotsEnabled) getPDPEspots()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      activeItem,
      closeModal,
      isMobile,
      updateFindInStoreActiveItem,
    } = this.props

    if (!equals(activeItem, nextProps.activeItem)) {
      updateFindInStoreActiveItem(nextProps.activeItem)
    }

    if (!isMobile && nextProps.isMobile) {
      closeModal()
    }
  }

  componentDidUpdate(prevProps) {
    const {
      product,
      extractRecentlyDataFromProduct,
      visitedLength,
      removeFromVisited,
      updateSwatch,
    } = this.props

    if (!equals(prevProps.product, product)) {
      extractRecentlyDataFromProduct(product)
      if (this.swatchTriggeredChange) {
        updateSwatch(product)
        this.swatchTriggeredChange = false
      }
    }

    // redirecting from bundles - removing extra entry from visited
    if (
      this.shouldRemoveIfRedirectionFromBundles &&
      visitedLength > prevProps.visitedLength
    ) {
      removeFromVisited(visitedLength - 2)
      this.shouldRemoveIfRedirectionFromBundles = false
    }
  }

  clickCarouselThumbs = (index) => {
    const { setCarouselIndex } = this.props
    this.setVideoEnabled(false)
    setCarouselIndex('productDetail', index)
  }

  onSwatchSelect = (e, nextProduct) => {
    const { product } = this.props
    e.preventDefault()
    if (!product.isPreloaded) {
      const { productUrl } = nextProduct || {}
      this.swatchTriggeredChange = true
      browserHistory.push({
        pathname: getRouteFromUrl(productUrl),
      })
    }
  }

  clickFindInStore = (e) => {
    if (e) e.preventDefault()
    const {
      isMobile,
      location,
      setModalChildren,
      setModalMode,
      showModal,
      toggleModal,
      storeListOpen,
      setStoreStockList,
      product,
    } = this.props

    analyticsPdpClickEvent(`findinstore-${product.productId}`)
    if (isMobile) {
      if (storeListOpen) setStoreStockList(!storeListOpen)
      browserHistory.push(`${location.pathname}#`)
      setModalChildren(
        <FindInStore
          className={`ProductDetail-findInStore`}
          product={this.props.product}
          siteId={this.props.siteId}
        />
      )
      setModalMode('rollFull')
      toggleModal()
    } else {
      showModal(
        <FindInStore
          className={`productdetail-findInStore`}
          product={this.props.product}
          siteId={this.props.siteId}
        />,
        { mode: 'storeLocator' }
      )
    }
  }

  setVideoEnabled = (enabled = !this.state.showProductVideo) => {
    this.setState({
      showProductVideo: enabled,
    })
  }

  getFindInStoreButton = (params) => {
    const { l } = this.context
    return (
      <a // eslint-disable-line jsx-a11y/href-no-hash
        className="FulfilmentInfo-findInStoreLink"
        href="#"
        onClick={this.clickFindInStore}
      >
        {l(params.text)}
      </a>
    )
  }

  renderFulfilmentDetails() {
    const { siteId, activeProductWithInventory } = this.props
    if (!activeProductWithInventory) return null
    return (
      <FulfilmentInfo
        siteId={siteId}
        getFindInStoreButton={this.getFindInStoreButton}
        activeProduct={activeProductWithInventory}
      />
    )
  }

  renderMobileSizeGuideButton() {
    const {
      isMobile,
      product: { items, attributes },
    } = this.props
    if (!isMobile) return null
    return <SizeGuide items={items} attributes={attributes} />
  }

  renderSizeGuideButtonAsSizeTile(shouldShowSizeDropdown) {
    const {
      isMobile,
      enableSizeGuideButtonAsSizeTile,
      product: { items, attributes },
    } = this.props
    if (isMobile || !enableSizeGuideButtonAsSizeTile || shouldShowSizeDropdown)
      return null

    return (
      <SizeGuide
        items={items}
        attributes={attributes}
        openDrawer
        displayAsBox
        className="SizeGuide--sizeGuideButtonAsSizeTile"
      />
    )
  }

  hasItemsBiggerSizes = () =>
    this.props.enableDropdownForLongSizes &&
    Boolean(
      this.props.product.items.find(
        ({ size }) => String(size).trim().length > 2
      )
    )

  getDeliveryError = (deliveryEspot) =>
    !deliveryEspot ||
    deliveryEspot.error ||
    !deliveryEspot.pageName ||
    deliveryEspot.pageName.toLowerCase().includes('error')

  isDeliveryEspotEmpty = (deliveryEspot) =>
    !deliveryEspot || !deliveryEspot.pageData || !deliveryEspot.pageData.length

  showSizeDropdown() {
    const {
      maximumNumberOfSizeTiles,
      product: { items, isPreloaded },
    } = this.props
    return (
      items &&
      (items.length > maximumNumberOfSizeTiles || this.hasItemsBiggerSizes()) &&
      !isPreloaded
    )
  }

  getProductSizesClass() {
    const { enableSizeGuideButtonAsSizeTile } = this.props
    if (this.showSizeDropdown()) {
      return 'ProductSizes--sizeGuideDropdown'
    }
    return enableSizeGuideButtonAsSizeTile
      ? 'ProductSizes--sizeGuideButtonAsSizeTile'
      : 'ProductSizes--sizeGuideBox'
  }

  renderFitAttributes() {
    const {
      product: { tpmLinks },
    } = this.props
    if (!tpmLinks || tpmLinks.length === 0) return null
    return (
      <FitAttributes
        fitAttributes={tpmLinks[0]}
        swatchChange={() => {
          this.swatchTriggeredChange = true
        }}
      />
    )
  }

  renderSizeGuideButton(shouldShowSizeDropdown) {
    const {
      isMobile,
      enableSizeGuideButtonAsSizeTile,
      product: { items, attributes },
    } = this.props

    if (
      isMobile ||
      isEmpty(items) ||
      (enableSizeGuideButtonAsSizeTile && !shouldShowSizeDropdown)
    )
      return null

    return (
      <div
        className={`ProductDetail-sizeGuide ${
          shouldShowSizeDropdown ? 'ProductDetail-sizeGuide--narrow' : ''
        }`}
      >
        <SizeGuide
          items={items}
          attributes={attributes}
          openDrawer
          displayAsBox={!shouldShowSizeDropdown}
        />
      </div>
    )
  }

  renderAddtoBagButton(isOOS) {
    if (isOOS) return null
    const { activeItem, product } = this.props
    const { productId, deliveryMessage, isDDPProduct } = product

    return (
      <AddToBag
        productId={productId}
        catEntryId={activeItem.catEntryId}
        sku={activeItem.sku}
        partNumber={activeItem.sku}
        deliveryMessage={deliveryMessage}
        isDDPProduct={isDDPProduct}
        shouldShowInlineConfirm
        shouldShowMiniBagConfirm
        shouldAddToBag={this.shouldAddToBag}
        product={product}
      />
    )
  }

  renderBazaarVoiceWidget() {
    const {
      isMobile,
      product: { productId, lineNumber },
    } = this.props

    if (isMobile) return null

    return (
      <BazaarVoiceWidget
        className="ProductDetail-writeReview"
        lineNumber={lineNumber}
        productId={productId}
        summaryOnly
      />
    )
  }

  renderProductQuantity(isOOS) {
    if (isOOS) return null
    const {
      activeItem,
      updateActiveItemQuantity,
      selectedQuantity,
    } = this.props
    return (
      <ProductQuantity
        activeItem={activeItem}
        selectedQuantity={selectedQuantity}
        onSelectQuantity={updateActiveItemQuantity}
      />
    )
  }

  renderItemError() {
    const { l } = this.context
    const { showItemError } = this.props
    if (!showItemError) return null
    return (
      <Message
        message={l`Please select your size to continue`}
        type={'error'}
      />
    )
  }

  renderFindInStoreButton(type) {
    const { region } = this.props
    return (
      <FindInStoreButton
        type={type}
        region={region}
        onClick={this.clickFindInStore}
      />
    )
  }

  renderFulfilmentDetailsDesktop() {
    const { isMobile, isCFSIEspotEnabled } = this.props
    if (isMobile || !isCFSIEspotEnabled) return null
    return this.renderFulfilmentDetails()
  }

  renderFulfilmentDetailsMobile() {
    const { isMobile, isCFSIEspotEnabled } = this.props
    if (!isMobile || !isCFSIEspotEnabled) return null
    return this.renderFulfilmentDetails()
  }

  renderCallToActionButtons(isOOS) {
    const {
      isFeatureFindInStoreEnabled,
      isFeatureWishlistEnabled,
      isThresholdEnabled,
      product: {
        productId,
        name,
        items,
        stockThreshold,
        attributes,
        lineNumber,
        unitPrice,
      },
    } = this.props

    const productDetails = {
      lineNumber,
      price: unitPrice,
    }

    const addToBagButton = this.renderAddtoBagButton(isOOS)

    return (
      <div className="ProductDetail-ctas">
        <div className="ProductDetail-secondaryButtonGroup">
          {addToBagButton}
          {isFeatureWishlistEnabled && (
            <WishlistButton
              productId={productId}
              productDetails={productDetails}
              modifier="pdp"
            />
          )}
        </div>
        {isThresholdEnabled && <FreeShippingMessage modifier="pdp" />}
        <NotifyProduct
          productId={productId}
          productTitle={name}
          sizes={items}
          stockThreshold={stockThreshold}
          backInStock={attributes.EmailBackInStock === 'Y'}
          notifyMe={attributes.NotifyMe === 'Y'}
        />
        {isFeatureFindInStoreEnabled && this.renderFindInStoreButton('desktop')}
        {this.renderFulfilmentDetailsDesktop()}
        {isFeatureFindInStoreEnabled && (
          <div className="ProductDetail-row">
            {this.renderFindInStoreButton('mobile')}
          </div>
        )}
      </div>
    )
  }

  renderCmsContent() {
    const { isMobile } = this.props
    if (!isMobile) return null
    return (
      <div className="row">
        <div className="col-12">
          <div className="ProductDetail-cmsContent">
            <SandBox
              cmsPageName={espots.pdp[1]}
              contentType={cmsConsts.ESPOT_CONTENT_TYPE}
              isInPageContent
              shouldGetContentOnFirstLoad
            />
          </div>
        </div>
      </div>
    )
  }

  renderAccordion() {
    const { l } = this.context
    const { isMobile, sandboxPages } = this.props

    if (!isMobile) return null

    const deliveryEspot = path([espots.pdp[0], 'props', 'data'], sandboxPages)
    const deliveryEspotError = this.getDeliveryError(deliveryEspot)
    const deliveryEspotEmpty = this.isDeliveryEspotEmpty(deliveryEspot)

    return (
      <div
        ref={(accordionParent) => {
          this.accordionParent = accordionParent
        }}
        className="row"
      >
        <div className="col-12">
          <Accordion
            header={l`Delivery and returns Information`}
            className={`ProductDetail-deliveryInfo ${
              deliveryEspotError || deliveryEspotEmpty ? 'is-hidden' : ''
            }`}
            accordionName="deliveryInfo"
            scrollToElement={this.accordionParent}
          >
            <SandBox
              cmsPageName={espots.pdp[0]}
              contentType={cmsConsts.ESPOT_CONTENT_TYPE}
              isInPageContent
              shouldGetContentOnFirstLoad
            />
          </Accordion>
        </div>
      </div>
    )
  }

  render() {
    const { l } = this.context
    const {
      brandName,
      activeItem,
      selectedOosItem,
      isFeatureCarouselThumbnailEnabled,
      isFeaturePdpQuantity,
      updateActiveItem,
      currentProductGroupingId,
      isFeaturePriceSavingEnabled,
      isMobile,
      isFeatureDressipiRecommendationsEnabled,
      isFeatureBnplPaymentsBreakdownPdp,
      showModal,
      storeCode,
      product: {
        productId,
        unitPrice,
        wasPrice,
        wasWasPrice,
        totalMarkdownValue,
        rrp,
        name,
        description,
        assets,
        amplienceAssets = {},
        items,
        stockThreshold,
        lineNumber,
        attributes,
        colourSwatches,
        seoUrl,
        colour,
        bundleDisplayURL,
        shopTheLookProducts,
        seeMoreValue,
        isPreloaded,
        bnplPaymentOptions,
      },
      setPredecessorPage,
      mobileBreadcrumbs,
    } = this.props
    const isOOS = checkIfOOS(items)

    const referringProduct = {
      productId,
      lineNumber,
      name,
    }
    const shouldShowSizeDropdown = this.showSizeDropdown()
    const shouldShowSaving = isFeaturePriceSavingEnabled && !isMobile

    // TODO refactor and improve the size tiles / size dropdown / size guide code here and make it consistent with quickview and bundle

    const mobileSizeGuideButton = this.renderMobileSizeGuideButton()
    const sizeGuideButtonAsSizeTile = this.renderSizeGuideButtonAsSizeTile(
      shouldShowSizeDropdown
    )

    return (
      <div className="ProductDetail" key={productId}>
        <div className="row ProductDetail-columnContainer">
          <Column
            responsive={`col-md-6 ${
              isFeatureCarouselThumbnailEnabled ? 'col-lg-7' : 'col-lg-6'
            }`}
            className="ProductDetail-mediaColumn"
          >
            <div className="ProductDetails-mediaContainer">
              <div
                className={`Carousel-container ${
                  isFeatureCarouselThumbnailEnabled
                    ? ' Carousel-container--thumbnailEnabled'
                    : ''
                }`}
              >
                <ProductCarouselThumbnails
                  maxVisible={5}
                  setCarouselIndex={this.clickCarouselThumbs}
                  className="ProductCarouselThumbnails"
                  amplienceImages={amplienceAssets.images}
                  thumbs={assets.filter(
                    (asset) => asset.assetType === 'IMAGE_SMALL'
                  )}
                />
                <div className="ProductDetail-media">
                  <ProductMedia
                    name="productDetail"
                    productId={productId}
                    amplienceAssets={amplienceAssets}
                    assets={assets}
                    enableVideo
                    enableImageOverlay
                  />
                </div>
              </div>
            </div>
            <Espot
              identifier={constants.product.col1pos1}
              className="Espot-productEspot ProductDetail-espot"
            />
            <Espot
              identifier={constants.product.col1pos2}
              className="Espot-productEspot ProductDetail-espot"
            />
          </Column>
          <Column
            responsive={`col-md-6 ${
              isFeatureCarouselThumbnailEnabled ? 'col-lg-5' : 'col-lg-6'
            }`}
            className="ProductDetail-details"
          >
            <QubitReact id="qubit-pdp-ProductDetail">
              <div>
                {brandName === 'wallis' && (
                  <Espot
                    identifier={constants.product.col2pos1}
                    className="Espot-productEspot ProductDetail-espot"
                  />
                )}

                {isMobile && (
                  <ProductsBreadcrumbs breadcrumbs={mobileBreadcrumbs} />
                )}

                <h1 className="ProductDetail-title">{name}</h1>
                <QubitReact id="qubit-pdp-HistoricalPrice">
                  <div className="ProductDetail-priceWrapper">
                    <HistoricalPrice
                      className="HistoricalPrice--pdp"
                      brandName={brandName}
                      currency={'\u00A3'}
                      price={unitPrice}
                      wasPrice={wasPrice}
                      wasWasPrice={wasWasPrice}
                      rrp={rrp}
                      totalMarkdownValue={totalMarkdownValue}
                      shouldShowSaving={shouldShowSaving}
                    />
                  </div>
                </QubitReact>
                {isFeatureBnplPaymentsBreakdownPdp && (
                  <BnplPaymentsBreakdown
                    unitPrice={unitPrice}
                    bnplPaymentOptions={bnplPaymentOptions}
                    showModal={showModal}
                    storeCode={storeCode}
                    isMobile={isMobile}
                  />
                )}
                {this.renderBazaarVoiceWidget()}
                <div className="ProductDetail-topGroupRightInner">
                  {brandName !== 'wallis' && (
                    <Espot
                      identifier={constants.product.col2pos1}
                      className="Espot-productEspot ProductDetail-espot"
                    />
                  )}

                  {isPreloaded ? (
                    <Loader />
                  ) : (
                    <div>
                      <Swatches
                        swatches={colourSwatches}
                        maxSwatches={5}
                        productId={productId}
                        seoUrl={seoUrl}
                        name={name}
                        selectedId={productId}
                        onSelect={this.onSwatchSelect}
                        showAllColours
                        pageClass="pdp"
                      />

                      {this.renderFitAttributes()}

                      <div className="ProductDetail-sizeAndQuantity">
                        <ProductSizes
                          label={l`Select size`}
                          productId={productId}
                          items={items}
                          stockThreshold={stockThreshold}
                          notifyEmail={
                            attributes.NotifyMe === 'Y' ||
                            attributes.EmailBackInStock === 'Y'
                          }
                          hideIfOSS={attributes.NotifyMe === 'Y'}
                          activeItem={activeItem}
                          selectedOosItem={selectedOosItem}
                          className={`ProductSizes--pdp ${this.getProductSizesClass()}`}
                          sizeGuideButton={sizeGuideButtonAsSizeTile}
                          onSelectSize={updateActiveItem}
                        />
                        {this.renderSizeGuideButton(shouldShowSizeDropdown)}

                        <LowStock
                          activeItem={activeItem}
                          stockThreshold={stockThreshold}
                          isFeaturePdpQuantity={isFeaturePdpQuantity}
                        />

                        {this.renderProductQuantity(isOOS)}
                      </div>

                      {mobileSizeGuideButton}
                    </div>
                  )}

                  {this.renderItemError()}
                  {this.renderCallToActionButtons(isOOS)}

                  <Espot
                    identifier={constants.product.col2pos2}
                    customClassName="Espot-productEspot Espot--medium ProductDetail-espot"
                    qubitid="qubit-pdp-EspotCol2Pos2"
                  />
                  <Espot
                    identifier={constants.product.col2pos4}
                    customClassName="Espot-productEspot Espot--medium ProductDetail-espot"
                  />
                  <CrossSellLinks />
                </div>
              </div>
            </QubitReact>
          </Column>
        </div>
        <div className="row">
          <div className="col-12">
            <ProductDescription
              description={description}
              seeMoreValue={seeMoreValue}
            >
              <ProductDescriptionExtras
                attributes={[
                  { label: l`Colour`, value: colour },
                  { label: l`Product Code`, value: lineNumber },
                ]}
              />
            </ProductDescription>
          </div>
        </div>
        {this.renderFulfilmentDetailsMobile()}
        <div className="row">
          <div className="col-12">
            <Espot
              identifier={constants.product.content1}
              className="ProductDetail-espot"
            />
          </div>
        </div>
        {this.renderAccordion()}
        {this.renderCmsContent()}
        <div className="row ProductDetail-bazaarVoice ProductDetail-bvRow">
          <div className="col-12">
            <BazaarVoiceWidget
              lineNumber={lineNumber}
              productId={productId}
              containerOnly
            />
          </div>
        </div>

        <FeatureCheck flag="FEATURE_SHOP_THE_LOOK">
          <ShopTheLook
            shopTheLookProducts={shopTheLookProducts}
            bundleURL={bundleDisplayURL}
          />
        </FeatureCheck>

        <WithQubit
          id="dressipi-outfits"
          shouldUseQubit
          currentProductGroupingId={currentProductGroupingId}
        />

        {isFeatureDressipiRecommendationsEnabled ? (
          <DressipiRecommendationsRail
            currentProductGroupingId={currentProductGroupingId}
            setPredecessorPage={setPredecessorPage}
          />
        ) : (
          <Recommendations
            currentProductGroupingId={currentProductGroupingId}
            shouldRenderDressipiQubitExperience
            setPredecessorPage={setPredecessorPage}
          />
        )}

        <RecentlyViewed
          currentProductId={referringProduct.productId}
          setPredecessorPage={setPredecessorPage}
        />
      </div>
    )
  }
}

export default compose(
  analyticsDecorator(GTM_CATEGORY.PDP, { isAsync: true }),
  connect(
    (state) => ({
      activeItem: state.productDetail.activeItem,
      activeProductWithInventory: getActiveProductWithInventory(state),
      showItemError: state.productDetail.showError,
      modal: state.modal,
      siteId: state.config.siteId,
      selectedOosItem: state.productDetail.selectedOosItem,
      // prop required for EXP-208 Dressipi Test
      currentProductGroupingId: path(['currentProduct', 'grouping'], state),
      storeListOpen: state.findInStore.storeListOpen,
      region: state.config.region,
      sandboxPages: state.sandbox.pages,
      isMobile: isMobile(state),
      CFSi: isFeatureCFSIEnabled(state),
      isCFSIEspotEnabled: isCFSIEspotEnabled(state),
      isFeatureCarouselThumbnailEnabled: Boolean(
        state.features.status.FEATURE_PRODUCT_CAROUSEL_THUMBNAIL
      ),
      visitedLength: state.routing.visited.length,
      maximumNumberOfSizeTiles: getMaximumNumberOfSizeTiles(state),
      enableSizeGuideButtonAsSizeTile: enableSizeGuideButtonAsSizeTile(state),
      enableDropdownForLongSizes: enableDropdownForLongSizes(state),
      isFeatureFindInStoreEnabled: isFeatureFindInStoreEnabled(state),
      isFeatureWishlistEnabled: isFeatureWishlistEnabled(state),
      isFeaturePdpQuantity: isFeaturePdpQuantity(state),
      isPersonalisedEspotsEnabled: isPersonalisedEspotsEnabled(state),
      brandName: getBrandName(state),
      selectedQuantity: getProductDetailSelectedQuantity(state),
      storeCode: getStoreCode(state),
      isThresholdEnabled: isFeatureEnabled(
        state,
        'FEATURE_DELIVERY_THRESHOLD_MESSAGE_DETAILS'
      ),
      isFeaturePriceSavingEnabled: isFeaturePriceSavingEnabled(state),
      isFeatureBnplPaymentsBreakdownPdp: isFeatureBnplPaymentsBreakdownPdp(
        state
      ),
      isFeatureDressipiRecommendationsEnabled: isFeatureDressipiRecommendationsEnabled(
        state
      ),
    }),
    {
      ...storeLocatorActions,
      ...FindInStoreActions,
      ...recentlyViewedActions,
      closeModal,
      setModalChildren,
      setModalMode,
      showModal,
      toggleModal,
      removeFromVisited,
      setCarouselIndex,
      updateShowItemsError,
      getPDPEspots,
      updateActiveItem,
      updateActiveItemQuantity,
      setPredecessorPage,
      updateSwatch,
    }
  )
)(ProductDetail)

export { ProductDetail as WrappedProductDetail }
