import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import {
  sendAnalyticsDisplayEvent,
  GTM_EVENT,
  GTM_TRIGGER,
} from '../../../analytics'

// Selectors
import { isMobile } from '../../../selectors/viewportSelectors'
import { isAddingToBag } from '../../../selectors/shoppingBagSelectors'

// actions
import {
  addToBag,
  openMiniBag,
} from '../../../actions/common/shoppingBagActions'
// components
import Button from '../Button/Button'
import AddToBagModal from '../AddToBagModal/AddToBagModal'
import InlineConfirm from './InlineConfirm'
import DeliveryCutoffMessage from '../../common/DeliveryCutoffMessage/DeliveryCutoffMessage'
import { isCountryExcluded } from '../../../selectors/productSelectors'

class AddToBag extends Component {
  static propTypes = {
    productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    catEntryId: PropTypes.number,
    partNumber: PropTypes.string,
    sku: PropTypes.string,
    bundleItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.number,
        sku: PropTypes.string,
      })
    ),
    isAddingToBag: PropTypes.bool.isRequired,
    className: PropTypes.string,
    deliveryMessage: PropTypes.string,
    quantity: PropTypes.number,
    isDDPProduct: PropTypes.bool,
    shouldShowInlineConfirm: PropTypes.bool,
    shouldShowMiniBagConfirm: PropTypes.bool,
    isMobile: PropTypes.bool,
    shouldAddToBag: PropTypes.func,
    dispatchEvent: PropTypes.func,
    updateWishlist: PropTypes.func,
    // actions
    addToBag: PropTypes.func.isRequired,
    openMiniBag: PropTypes.func.isRequired,
    sendAnalyticsDisplayEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: '',
    sku: undefined,
    catEntryId: undefined,
    bundleItems: undefined,
    deliveryMessage: '',
    quantity: 1,
    shouldShowInlineConfirm: false,
    shouldShowMiniBagConfirm: false,
    isMobile: true,
    shouldAddToBag: () => true,
    dispatchEvent:
      typeof window !== 'undefined'
        ? document.dispatchEvent.bind(document)
        : () => {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    showInlineConfirm: false,
    shouldShowAddingToBagText: false,
  }

  handleAddToBag = async () => {
    const {
      productId,
      catEntryId,
      sku,
      partNumber,
      quantity,
      bundleItems,
      isMobile,
      isDDPProduct,
      shouldShowInlineConfirm,
      shouldShowMiniBagConfirm,
      shouldAddToBag,
      dispatchEvent,
      addToBag,
      openMiniBag,
      sendAnalyticsDisplayEvent,
      updateWishlist,
    } = this.props

    this.setState({ showInlineConfirm: false })

    if (!shouldAddToBag()) return

    this.setState({ shouldShowAddingToBagText: true })

    dispatchEvent(new Event('addToBag'))

    try {
      const res = await addToBag(
        productId,
        sku,
        partNumber,
        quantity,
        <AddToBagModal />,
        bundleItems,
        isDDPProduct,
        catEntryId
      )

      if (res instanceof Error) return

      if (updateWishlist) updateWishlist()

      if (shouldShowInlineConfirm) this.setState({ showInlineConfirm: true })

      if (shouldShowMiniBagConfirm && !isMobile) {
        setTimeout(() => {
          openMiniBag(true)
          sendAnalyticsDisplayEvent(
            {
              bagDrawerTrigger: GTM_TRIGGER.PRODUCT_ADDED_TO_BAG,
              openFrom: 'pdp',
            },
            GTM_EVENT.BAG_DRAWER_DISPLAYED
          )
        }, 100)
      }
    } finally {
      this.setState({ shouldShowAddingToBagText: false })
    }
  }

  render() {
    const { l } = this.context
    const {
      isMobile,
      bundleItems,
      deliveryMessage,
      className,
      shouldAddToBag,
      isAddingToBag,
      isCountryExcluded,
    } = this.props

    const buttonClassNames = classnames({
      'is-active': shouldAddToBag({ showError: false }) && !isAddingToBag,
    })
    const buttonText = !bundleItems ? l`Adding to bag` : l`Adding All to Bag`
    const buttonDefaultText = !bundleItems ? l`Add to bag` : l`Add All to Bag`

    return (
      <div
        className={`AddToBag ${className} ${
          isCountryExcluded ? 'is-excluded' : ''
        }`}
      >
        <React.Fragment>
          <Button
            className={buttonClassNames}
            clickHandler={this.handleAddToBag}
            isDisabled={isAddingToBag || isCountryExcluded}
          >
            {isAddingToBag && this.state.shouldShowAddingToBagText ? (
              [
                <span key="text" className="translate">
                  {buttonText}
                </span>,
                <span key="animation" className="translate ellipsis" />,
              ]
            ) : (
              <span className="translate">{buttonDefaultText}</span>
            )}
          </Button>
          {!isMobile && this.state.showInlineConfirm && <InlineConfirm />}
          <DeliveryCutoffMessage message={deliveryMessage} />
        </React.Fragment>
      </div>
    )
  }
}

export default connect(
  (state, { quantity, product }) => ({
    quantity:
      quantity !== undefined ? quantity : state.productDetail.selectedQuantity,
    isMobile: isMobile(state),
    isAddingToBag: isAddingToBag(state),
    isCountryExcluded: isCountryExcluded(state, product),
  }),
  {
    addToBag,
    openMiniBag,
    sendAnalyticsDisplayEvent,
  }
)(AddToBag)

export { AddToBag as WrappedAddToBag }
