import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { insert, equals, dropLast, isEmpty, path } from 'ramda'
import debounce from 'lodash.debounce'

import Product from '../../common/Product/Product'
import Loader from '../../common/Loader/Loader'
import Espot from '../Espot/Espot'
import { IMAGE_SIZES } from '../../../constants/amplience'
import { getProductListEspots } from '../../../../shared/selectors/espotSelectors'
import { getBrandCode } from '../../../selectors/configSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'
import * as productsActions from '../../../actions/common/productsActions'
import { WindowScroll } from '../WindowEventProvider/WindowScroll'
import {
  hitWaypointTop,
  removeHiddenPages,
} from '../../../actions/common/infinityScrollActions'
import { productListPageSize } from '../../../../server/api/mapping/constants/plp'
import {
  getHiddenPagesAbove,
  getNumberOfPagesHiddenAtEnd,
} from '../../../selectors/infinityScrollSelectors'
import { isFeaturePLPMobileEspotEnabled } from '../../../selectors/featureSelectors'

@connect(
  (state) => ({
    brandCode: getBrandCode(state),
    grid: state.grid.columns,
    location: state.routing.location,
    currentPage: state.infinityScroll.currentPage,
    espots: getProductListEspots(state),
    totalProducts: state.products.totalProducts,
    categoryTitle: state.products.categoryTitle,
    selectedProductSwatches: state.products.selectedProductSwatches,
    isMobile: isMobile(state),
    isFeaturePLPMobileEspotEnabled: isFeaturePLPMobileEspotEnabled(state),
    waypointsHit: state.infinityScroll.waypointsHit,
    hiddenPagesAbove: getHiddenPagesAbove(state),
    numberOfPagesHiddenAtEnd: getNumberOfPagesHiddenAtEnd(state),
  }),
  {
    ...productsActions,
    hitWaypointTop,
    removeHiddenPages,
  }
)
class ProductList extends Component {
  static propTypes = {
    brandCode: PropTypes.string,
    products: PropTypes.array,
    grid: PropTypes.number,
    isLoading: PropTypes.bool,
    espots: PropTypes.arrayOf(PropTypes.object),
    totalProducts: PropTypes.number,
    preloadProductDetail: PropTypes.func,
    categoryTitle: PropTypes.string,
    selectedProductSwatches: PropTypes.object,
    hiddenPagesAbove: PropTypes.array,
    numberOfPagesHiddenAtEnd: PropTypes.number,
    isFeaturePLPMobileEspotEnabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    products: [],
    espots: [],
    selectedProductSwatches: {},
    hiddenPagesAbove: [],
    numberOfPagesHiddenAtEnd: 0,
  }

  shouldComponentUpdate(nextProps) {
    return !equals(this.props, nextProps)
  }

  shouldShowContentEspot({
    numProducts,
    position,
    isMobile,
    isFeaturePLPMobileEspotEnabled,
  }) {
    const enoughProducts = numProducts > position
    return isMobile
      ? enoughProducts && isFeaturePLPMobileEspotEnabled
      : enoughProducts
  }

  insertContentEspot = (items, espot) => {
    const { products, isMobile, isFeaturePLPMobileEspotEnabled } = this.props
    const { position, identifier } = espot
    return this.shouldShowContentEspot({
      numProducts: products.length,
      isMobile,
      isFeaturePLPMobileEspotEnabled,
      position,
    })
      ? insert(position - 1, { isEspot: true, position, identifier }, items)
      : items
  }

  /* If product list does not render evenly across columns layout then
   * remove the last row of products
   */
  prepareRowsForRendering = (totalProducts, products, columnIndex) => {
    const dropIndex = products.length % columnIndex
    return dropIndex && totalProducts > products.length
      ? dropLast(dropIndex, products)
      : products
  }

  get numberOfItemsToHideAtStart() {
    return this.props.hiddenPagesAbove.length * productListPageSize
  }

  get numberOfItemsToHideAtEnd() {
    const { totalProducts, numberOfPagesHiddenAtEnd } = this.props
    const isTotalProductsDivisibleByPageSize =
      totalProducts % productListPageSize === 0
    // only the last page should ever be smaller than the productListPageSize
    const lastPageSize = isTotalProductsDivisibleByPageSize
      ? productListPageSize
      : totalProducts % productListPageSize
    return (numberOfPagesHiddenAtEnd - 1) * productListPageSize + lastPageSize
  }

  removeHiddenItems = (items) => {
    const start = this.numberOfItemsToHideAtStart
    let end = items.length

    if (this.props.numberOfPagesHiddenAtEnd) {
      const hasEnoughItemsToRemove =
        items.length >= this.numberOfItemsToHideAtEnd
      if (hasEnoughItemsToRemove) {
        end = items.length - this.numberOfItemsToHideAtEnd
      }
    }

    return items.slice(start, end)
  }

  handleProductClick = (item, isWishlistButton) => {
    const { categoryTitle, setPredecessorPage } = this.props
    setPredecessorPage(categoryTitle)

    this.props.preloadProductDetail(
      this.getCurrentProduct(item),
      this.props,
      isWishlistButton
    )
  }

  renderProductsAndEspots = () => {
    const {
      props: { products, grid, espots, totalProducts, isMobile },
      prepareRowsForRendering,
      insertContentEspot,
    } = this

    const items = this.removeHiddenItems(
      prepareRowsForRendering(
        totalProducts,
        espots.reduce(insertContentEspot, products),
        grid
      )
    )

    return items.map(
      (item, index) =>
        item.isEspot ? (
          <Espot
            identifier={item.identifier}
            customClassName={`Espot Product--col${grid} Espot-productList`}
            key={`productListEspot-${item.position}`}
            qubitid={`qubit-plp-EspotProductList${index}`}
            isResponsive
          />
        ) : (
          <Product
            key={`plp-product-${item.productId}-${grid}`}
            grid={grid}
            sizes={IMAGE_SIZES.plp[grid]}
            onLinkClick={this.handleProductClick.bind(this, item)}
            {...item}
            lazyLoad={isMobile && index > 5}
            productNumber={index}
          />
        )
    )
  }

  getCurrentProduct = (product) => {
    const { selectedProductSwatches } = this.props

    if (
      isEmpty(selectedProductSwatches) ||
      isEmpty(product.colourSwatches) ||
      !product.productId
    )
      return product

    const productIds = Object.keys(selectedProductSwatches)
    if (productIds.includes(product.productId.toString())) {
      const matchingSwatch = product.colourSwatches.find(
        (swatch) =>
          swatch.swatchProduct.productId ===
          selectedProductSwatches[product.productId]
      )
      if (matchingSwatch) {
        const swatchProduct = path(['swatchProduct'], matchingSwatch)
        const mandatoryPdpAttributes = {
          AverageOverallRating: null,
          NumReviews: null,
        }

        return {
          ...swatchProduct,
          attributes: mandatoryPdpAttributes,
        }
      }
    }
  }

  handleHiddenPagePlaceholderScroll = () => {
    // TODO use React refs rather than querySelector
    const firstUnhiddenProduct = document.querySelector(
      "[data-product-number='0']"
    )
    if (firstUnhiddenProduct) {
      const bottomOfPlaceholders = firstUnhiddenProduct.getBoundingClientRect()
        .top
      const placeholdersInView = bottomOfPlaceholders >= 0
      if (placeholdersInView) {
        this.props.hitWaypointTop(this.props.hiddenPagesAbove.length)
      }
    }
  }

  renderHiddenPagePlaceholdersAbove = () => {
    const { hiddenPagesAbove } = this.props
    if (!hiddenPagesAbove.length) {
      return null
    }

    return (
      <WindowScroll onScroll={this.handleHiddenPagePlaceholderScroll}>
        <Fragment>
          {hiddenPagesAbove.map((page, index) => (
            <div
              // using index as key here won't affect reconciliation as we always
              // add / remove items from the end of array and therefore indexes
              // are never reassigned from one item to another
              key={index} // eslint-disable-line react/no-array-index-key
              className="ProductList--hiddenProductPlaceholder"
              style={{ height: page.height }}
            />
          ))}
        </Fragment>
      </WindowScroll>
    )
  }

  render() {
    const {
      props: { isLoading, numberOfPagesHiddenAtEnd },
      renderProductsAndEspots,
    } = this
    const hasHiddenProductsAtEnd = !!numberOfPagesHiddenAtEnd
    return (
      <div className="ProductList">
        {this.renderHiddenPagePlaceholdersAbove()}
        <div className="ProductList-products">{renderProductsAndEspots()}</div>
        {(isLoading || hasHiddenProductsAtEnd) && (
          <Loader className="ProductList-loader" />
        )}
      </div>
    )
  }

  scrollHandler = () => {
    const { removeHiddenPages } = this.props
    const scrollY = window.scrollY
    if (scrollY === 0) {
      removeHiddenPages(true)
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', debounce(this.scrollHandler, 300))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', debounce(this.scrollHandler, 300))
  }
}

export default ProductList
