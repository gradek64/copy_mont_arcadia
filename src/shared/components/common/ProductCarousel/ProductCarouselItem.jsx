import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { getProductRouteFromParams } from '../../../lib/get-product-route'
import { clearProduct } from '../../../actions/common/productsActions'

import { IMAGE_SIZES } from '../../../constants/amplience'
import {
  CAROUSEL_AXIS_HORIZONTAL,
  CAROUSEL_AXIS_VERTICAL,
} from '../../../constants/productCarouselConstants'
import Product from '../Product/Product'

const ProductCarouselItem = (
  {
    lazyLoad,
    productId,
    name,
    price,
    unitPrice,
    salePrice,
    url,
    imageUrl,
    amplienceUrl,
    imageSize,
    style,
    canRemoveProduct,
    storeCode,
    lang,
    clearProduct,
    onProductRemove,
    onLinkClick,
    onQuickViewButtonClick,
    hideProductMeta,
    hideProductName,
    hideQuickViewIcon,
    hidePrice,
    isImageFallbackEnabled,
    openQuickViewOnProductClick,
    axis,
  },
  { l }
) => {
  const linkClickHandler = () => {
    clearProduct()
    onLinkClick(productId)
  }

  return (
    <div
      className={`ProductCarouselItem ProductCarouselItem-${axis}`}
      style={style}
    >
      <Product
        isImageFallbackEnabled={isImageFallbackEnabled}
        lazyLoad={lazyLoad}
        grid={1}
        sizes={imageSize}
        name={name}
        productId={productId}
        productUrl={
          url ||
          (productId
            ? getProductRouteFromParams(lang, storeCode, l`product`, productId)
            : '')
        }
        assets={imageUrl ? [{ url: imageUrl }] : []}
        productBaseImageUrl={amplienceUrl}
        unitPrice={salePrice || unitPrice || price}
        wasPrice={unitPrice}
        showPrice={(!!unitPrice || !!salePrice || !!price) && !hidePrice}
        onLinkClick={linkClickHandler}
        onQuickViewButtonClick={onQuickViewButtonClick}
        showProductView={false}
        openQuickViewOnProductClick={openQuickViewOnProductClick}
        hideProductMeta={hideProductMeta}
        hideProductName={hideProductName}
        hideQuickViewIcon={hideQuickViewIcon}
        isCarouselItem
      />
      {canRemoveProduct && (
        <button
          className="ProductCarouselItem-delete Button Button--secondary"
          onClick={onProductRemove.bind(null, productId)} // eslint-disable-line react/jsx-no-bind
        >
          <span className="screen-reader-text">
            Remove product from carousel
          </span>
        </button>
      )}
    </div>
  )
}

ProductCarouselItem.propTypes = {
  isImageFallbackEnabled: PropTypes.bool,
  lazyLoad: PropTypes.bool,
  productId: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.string,
  unitPrice: PropTypes.string,
  salePrice: PropTypes.string,
  url: PropTypes.string,
  imageUrl: PropTypes.string,
  amplienceUrl: PropTypes.string,
  imageSize: PropTypes.oneOf(Object.values(IMAGE_SIZES)),
  style: PropTypes.objectOf(PropTypes.string),
  axis: PropTypes.oneOf([CAROUSEL_AXIS_HORIZONTAL, CAROUSEL_AXIS_VERTICAL]),
  canRemoveProduct: PropTypes.bool,
  hideProductMeta: PropTypes.bool,
  hideProductName: PropTypes.bool,
  hideQuickViewIcon: PropTypes.bool,
  hidePrice: PropTypes.bool,
  storeCode: PropTypes.string,
  lang: PropTypes.string,
  onLinkClick: PropTypes.func,
  onQuickViewButtonClick: PropTypes.func,
  onProductRemove: PropTypes.func,
  // actions
  clearProduct: PropTypes.func.isRequired,
}

ProductCarouselItem.defaultProps = {
  isImageFallbackEnabled: false,
  lazyLoad: false,
  productId: undefined,
  name: undefined,
  price: undefined,
  unitPrice: undefined,
  salePrice: undefined,
  url: undefined,
  imageUrl: undefined,
  amplienceUrl: '',
  imageSize: IMAGE_SIZES.smallProduct,
  style: {},
  canRemoveProduct: false,
  hideProductMeta: false,
  hideProductName: false,
  hideQuickViewIcon: false,
  hidePrice: false,
  openQuickViewOnProductClick: false,
  storeCode: undefined,
  lang: undefined,
  axis: CAROUSEL_AXIS_HORIZONTAL,
  onLinkClick: () => {},
  onQuickViewButtonClick: () => {},
  onProductRemove: () => {},
}

ProductCarouselItem.contextTypes = {
  l: PropTypes.func,
}

export default connect(
  (state) => ({
    storeCode: state.config.storeCode,
    lang: state.config.lang,
  }),
  { clearProduct }
)(ProductCarouselItem)

export { ProductCarouselItem as WrappedProductCarouselItem }
