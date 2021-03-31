import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { path, isEmpty } from 'ramda'
import InputError from '../FormComponents/InputError/InputError'
import * as ShoppingBagActions from '../../../actions/common/shoppingBagActions'
import * as productsActions from '../../../actions/common/productsActions'
import Select from '../../../components/common/FormComponents/Select/Select'
import { checkIfOneSizedItem } from '../../../lib/product-utilities'
import { isLowStockProduct } from '../../../lib/products-utils'
import { getMaximumNumberOfSizeTiles } from '../../../selectors/configSelectors'
import { enableDropdownForLongSizes } from '../../../selectors/brandConfigSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'
import { analyticsPdpClickEvent } from '../../../analytics/tracking/site-interactions'

@connect(
  (state) => ({
    isMobile: isMobile(state),
    maximumNumberOfSizeTiles: getMaximumNumberOfSizeTiles(state),
    enableDropdownForLongSizes: enableDropdownForLongSizes(state),
  }),
  {
    ...ShoppingBagActions,
    ...productsActions,
  }
)
class ProductSizes extends Component {
  static propTypes = {
    items: PropTypes.array,
    activeItem: PropTypes.object,
    className: PropTypes.string,
    clickHandler: PropTypes.func,
    forceToUseSelect: PropTypes.bool,
    isMobile: PropTypes.bool,
    label: PropTypes.string,
    notifyEmail: PropTypes.bool,
    hideIfOSS: PropTypes.bool,
    showOosOnly: PropTypes.bool, // used for notify me and email me modal
    selectedOosItem: PropTypes.object,
    showLowStockLabel: PropTypes.bool,
    showOutOfStockLabel: PropTypes.bool,
    enableOutOfStockSelectedItems: PropTypes.bool,
    onSelectSize: PropTypes.func,
    updateSelectedOosItem: PropTypes.func,
    error: PropTypes.string,
    maximumNumberOfSizeTiles: PropTypes.number.isRequired,
    sizeGuideButton: PropTypes.element,
    enableDropdownForLongSizes: PropTypes.bool.isRequired,
    stockThreshold: PropTypes.number.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    error: '',
    showLowStockLabel: true,
    showOutOfStockLabel: true,
    enableOutOfStockSelectedItems: false,
    items: [],
    sizeGuideButton: null,
    stockThreshold: 3,
  }

  componentDidMount() {
    this.updateItem({})
  }

  isOutOfStock = (item) => {
    return path(['quantity'], item) === 0
  }

  getSelectedItem = (e) => {
    const { items } = this.props
    const {
      target: { value },
    } = e
    const selectedItem = items.find((item) => item.size === value)
    return selectedItem
  }

  getOptionValue = (item) => {
    const { l } = this.context
    const { notifyEmail, showOutOfStockLabel } = this.props
    const outOfStock =
      showOutOfStockLabel && this.isOutOfStock(item)
        ? notifyEmail
          ? `: ${l`E-mail me when back in stock`}`
          : `: ${l`Out of stock`}`
        : ''
    const lowStock = this.isLowStock(item) ? `: ${l`Low stock`}` : ''
    return `${l`Size`} ${item.size}${outOfStock}${lowStock}`
  }

  updateItem = (item) => {
    const { updateSelectedOosItem, onSelectSize, notifyEmail } = this.props

    if (!isEmpty(item) && !this.isOutOfStock(item)) {
      onSelectSize(item)
    } else if (notifyEmail) {
      updateSelectedOosItem(item)
    }
  }

  isLowStock = (item) => {
    const { stockThreshold, showLowStockLabel } = this.props
    return (
      showLowStockLabel &&
      !this.isOutOfStock(item) &&
      isLowStockProduct(item.quantity, stockThreshold)
    )
  }

  isNotAvailable = (item) => {
    const { l } = this.context
    if (this.isOutOfStock(item)) return l`Out of stock`
    return false
  }

  hasOnlyOneSize = () => {
    const { showOutOfStockLabel, showLowStockLabel, items } = this.props
    return (
      showOutOfStockLabel && showLowStockLabel && path(['length'], items) === 1
    )
  }

  /*
   * should hide onesize items when the label is hidden
   * and when all the products are out of stock for pdp and bundles
   */
  shouldHideSizes() {
    const {
      items,
      hideIfOSS,
      showOutOfStockLabel,
      showLowStockLabel,
    } = this.props
    return (
      (hideIfOSS && items.filter(this.isOutOfStock).length === items.length) ||
      (!(showOutOfStockLabel && showLowStockLabel) &&
        checkIfOneSizedItem(items))
    )
  }

  renderQuickView = () => {
    const item = this.props.items[0]
    const notAvailableProduct = this.isNotAvailable(item)
    return notAvailableProduct ? (
      <span className="ProductSizes-item is-outOfStock">
        {notAvailableProduct}
      </span>
    ) : null
  }

  createClassNamesForList() {
    const { showOosOnly, notifyEmail } = this.props
    let additionalClass = ''

    if (!showOosOnly && notifyEmail) {
      additionalClass = ' ProductSizes-list--emailStock'
    } else if (showOosOnly) {
      additionalClass = ' ProductSizes-list--oosOnly'
    }

    return `ProductSizes-list${additionalClass}`
  }

  renderError = () => {
    const { error } = this.props
    return (
      error && (
        <InputError className="ProductSizes-errorMessage" name="ProductSize">
          {error}
        </InputError>
      )
    )
  }

  hasItemsBiggerSizes = () =>
    this.props.enableDropdownForLongSizes &&
    Boolean(this.props.items.find(({ size }) => String(size).trim().length > 2))

  render() {
    const { l } = this.context
    const {
      isMobile,
      selectedOosItem,
      activeItem,
      forceToUseSelect,
      showOosOnly,
      label,
      clickHandler,
      showOutOfStockLabel,
      enableOutOfStockSelectedItems,
      className,
      maximumNumberOfSizeTiles,
      sizeGuideButton,
    } = this.props

    if (this.props.items.length === 0 || this.shouldHideSizes()) return null

    if (this.hasOnlyOneSize()) return this.renderQuickView()

    const shouldShowSizeDropdown =
      this.props.items.length > maximumNumberOfSizeTiles ||
      this.hasItemsBiggerSizes()

    const items = this.props.items.filter((item) =>
      showOosOnly ? this.isOutOfStock(item) : item
    )
    const selectSizeHandler = (item) =>
      clickHandler ? clickHandler(item) : this.updateItem(item)
    const classNamesForList = this.createClassNamesForList()

    if (forceToUseSelect || shouldShowSizeDropdown) {
      const options = items.map((item) => ({
        value: item.size,
        label: this.getOptionValue(item),
        disabled: enableOutOfStockSelectedItems
          ? false
          : showOutOfStockLabel && !showOosOnly && this.isOutOfStock(item),
      }))
      return (
        <div className={`ProductSizes ProductSizes--dropdown ${className}`}>
          {this.renderError()}
          <Select
            className="ProductSizes-sizes Select--inlineLabel"
            onChange={(e) => {
              const selected = this.getSelectedItem(e)
              selectSizeHandler(selected)
              analyticsPdpClickEvent(`productsize-${selected.size}`)
            }}
            options={options}
            name="productSizes"
            value={activeItem.size}
            aria-label={label}
            label={label}
            firstDisabled={l`Select size`}
          />
        </div>
      )
    }
    return (
      <div className={`ProductSizes ${className}`}>
        {this.renderError()}
        <div className={classNamesForList}>
          {items.map((item) => {
            const isOos = showOutOfStockLabel && this.isOutOfStock(item)
            const isActive = showOosOnly
              ? selectedOosItem && selectedOosItem.sku === item.sku
              : activeItem && activeItem.sku === item.sku
            return (
              <button
                key={`size-button-${item.size}`}
                onClick={() => {
                  selectSizeHandler(item)
                  analyticsPdpClickEvent(`productsize-${item.size}`)
                }}
                className={`ProductSizes-button ProductSizes-item--col${items.length}`}
                aria-label={`${l`Select size`} ${item.size}`}
                style={
                  !isMobile && items.length === 1 ? { flexBasis: '100%' } : {}
                }
              >
                <span
                  className={`ProductSizes-item${isActive ? ' is-active' : ''}${
                    isOos && !isActive ? ' is-outOfStock' : ''
                  }`}
                >
                  {item.size}
                </span>
              </button>
            )
          })}
          {sizeGuideButton}
        </div>
      </div>
    )
  }
}

export default ProductSizes
