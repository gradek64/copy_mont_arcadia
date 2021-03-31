import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

/**
 * Components
 */
import WishlistItem from './WishlistItem'
import ProductQuickview from '../ProductQuickview/ProductQuickview'
import AddToBagModal from '../../common/AddToBagModal/AddToBagModal'

/**
 * Actions
 */
import { showModal } from '../../../actions/common/modalActions'
import {
  setProductQuickview,
  setProductIdQuickview,
} from '../../../actions/common/quickviewActions'
import { addToBagWithCatEntryId } from '../../../actions/common/shoppingBagActions'
import {
  removeProductFromWishlist,
  captureWishlistEvent,
} from '../../../actions/common/wishlistActions'
import { preserveScroll } from '../../../actions/common/infinityScrollActions'

/**
 * Selectors
 */
import {
  getBaseUrlPath,
  getBrandName,
} from '../../../selectors/configSelectors'

/**
 * Helpers
 */
import { isIE11 } from '../../../lib/browser'

@connect(
  (state) => ({
    baseUrlPath: getBaseUrlPath(state),
    brandName: getBrandName(state),
  }),
  {
    preserveScroll,
    setProductQuickview,
    setProductIdQuickview,
    showModal,
    addToBagWithCatEntryId,
    captureWishlistEvent,
    removeProductFromWishlist,
  }
)
class WishlistItemContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCatEntryIds: { ...this.getOneSizeOnlyProducts(0, props.items) },
      sizeValidationErrorIds: [],
      isAddingToBag: { item: null, loading: false },
    }
  }

  static propTypes = {
    brandName: PropTypes.string.isRequired,
    grid: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    baseUrlPath: PropTypes.string,
    preserveScroll: PropTypes.func.isRequired,
    setProductQuickview: PropTypes.func.isRequired,
    setProductIdQuickview: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    addToBagWithCatEntryId: PropTypes.func.isRequired,
    captureWishlistEvent: PropTypes.func.isRequired,
    removeProductFromWishlist: PropTypes.func.isRequired,
  }

  getOneSizeOnlyProducts = (lastIndex, products = []) => {
    const currentProducts = products.slice(lastIndex)
    return currentProducts.reduce((acc, product) => {
      if (
        Array.isArray(product.sizeAndQuantity) &&
        product.sizeAndQuantity.length === 1
      )
        return { ...acc, [product.parentProductId]: product.catEntryId }

      return acc
    }, [])
  }

  componentWillReceiveProps(nextProps) {
    const { items: currentItems } = this.props
    const { items: newItems } = nextProps
    if (newItems.length !== currentItems.length) {
      this.setState({
        selectedCatEntryIds: {
          ...this.state.selectedCatEntryIds,
          ...this.getOneSizeOnlyProducts(currentItems.length, newItems),
        },
      })
    }
  }

  handleQuickView = (productId) => {
    const { setProductQuickview, setProductIdQuickview, showModal } = this.props
    // We explicitly set the product quick view state to an empty object here
    // in order to aid our analytics decorator on ProductQuickView to know
    // that a product is being quick-viewed. This helps with cases where you
    // quick view the same product sequentially.
    setProductQuickview({})
    setProductIdQuickview(productId)

    const html = <ProductQuickview fromWishlist />
    showModal(html, { mode: 'plpQuickview' })
  }

  handleAddToBag = (e, productId, productDetails) => {
    e.preventDefault()
    const { selectedCatEntryIds } = this.state
    const {
      addToBagWithCatEntryId,
      captureWishlistEvent,
      removeProductFromWishlist,
    } = this.props
    const catEntryId = selectedCatEntryIds[productId]

    if (!selectedCatEntryIds[productId]) {
      this.setState({
        sizeValidationErrorIds: [
          ...this.state.sizeValidationErrorIds,
          productId,
        ],
      })
      return false
    }

    this.setState({ isAddingToBag: { item: productId, loading: true } })

    addToBagWithCatEntryId(catEntryId, <AddToBagModal />)
      .then(() =>
        removeProductFromWishlist({
          productId,
          modifier: 'wishlist',
          productDetails,
          reportToGA: false,
        })
      )
      .then(() =>
        captureWishlistEvent('GA_ADD_TO_BAG_FROM_WISHLIST', {
          productId,
          ...productDetails,
        })
      )
      .finally(() => {
        this.setState({ isAddingToBag: { item: null, loading: false } })
      })
  }

  handleSizeChange = (e, productId) => {
    const catEntryId = e.target.value
    const newValidatedIds = this.state.sizeValidationErrorIds.filter(
      (e) => e !== productId
    )
    this.setState({
      selectedCatEntryIds: {
        ...this.state.selectedCatEntryIds,
        [productId]: catEntryId,
      },
      sizeValidationErrorIds: newValidatedIds,
    })
  }

  handleRemoveFromWishlist = (productId, productDetails) => {
    this.props.removeProductFromWishlist({
      productId,
      modifier: 'wishlist',
      productDetails,
      reportToGA: true,
    })
  }

  handleLinkClick = () => {
    const scrollYPos = window.scrollY || window.pageYOffset
    if (isIE11()) this.props.preserveScroll(scrollYPos)
  }

  renderItems = (grid, items, baseUrlPath, brandName) => {
    return (
      items &&
      items.map((item) => {
        const validateItem = this.state.sizeValidationErrorIds.includes(
          item.parentProductId
        )

        return (
          <CSSTransition key={item.catEntryId} timeout={400} classNames="fade">
            <WishlistItem
              brandName={brandName}
              item={item}
              grid={grid}
              handleAddToBag={this.handleAddToBag}
              handleQuickView={this.handleQuickView}
              handleSizeChange={this.handleSizeChange}
              selectedCatEntryId={
                this.state.selectedCatEntryIds[item.parentProductId]
              }
              baseUrlPath={baseUrlPath}
              handleRemoveFromWishlist={this.handleRemoveFromWishlist}
              sizeValidationError={validateItem}
              handleLinkClick={this.handleLinkClick}
              isAddingToBag={this.state.isAddingToBag}
            />
          </CSSTransition>
        )
      })
    )
  }

  render() {
    const { grid, items, baseUrlPath, brandName } = this.props
    return (
      <ul className="WishlistItemContainer">
        <TransitionGroup className="WishlistItemContainer WishlistItemContainer-animation">
          {this.renderItems(grid, items, baseUrlPath, brandName)}
        </TransitionGroup>
      </ul>
    )
  }
}

export default WishlistItemContainer
