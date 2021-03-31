import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getShoppingBagProductsWithInventory } from '../../../selectors/inventorySelectors'
import Image from '../Image/Image'
import { connect } from 'react-redux'

const PRODUCTS_LIMIT = 5

export const Link = ({ children, className, onClick }) => (
  <a role="button" tabIndex="0" className={className} onClick={onClick}>
    {children}
  </a>
)

const sliceBagProducts = (bagProducts, end) =>
  Array.isArray(bagProducts) ? [...bagProducts].reverse().slice(0, end) : []

const CheckoutViewBagMobile = (
  { totalCost, openMiniBag, bagProducts },
  { l }
) => {
  const productsNumber = bagProducts.length
  const remainingProductsNumber = productsNumber - PRODUCTS_LIMIT + 1
  const showRemainingProductsNumber = remainingProductsNumber > 1
  const products = sliceBagProducts(
    bagProducts,
    showRemainingProductsNumber ? PRODUCTS_LIMIT - 1 : PRODUCTS_LIMIT
  )

  return (
    <div className="CheckoutViewBagMobile">
      <div className="CheckoutViewBagMobile--header">
        {totalCost && (
          <span className="CheckoutViewBagMobile--orderTotal">
            {l('Order Total')} {totalCost}
          </span>
        )}
        <Link className="CheckoutViewBagMobile--viewBag" onClick={openMiniBag}>
          <span className="CheckoutViewBagMobile--viewBagCopy">
            {l('View bag')}
          </span>
        </Link>
      </div>
      <ul
        className={classnames('CheckoutViewBagMobile--productListImages', {
          'CheckoutViewBagMobile--productListImagesSpaceBetween':
            bagProducts.length >= PRODUCTS_LIMIT,
        })}
      >
        {products.map(
          ({ orderItemId, name, baseImageUrl, assets, quantity }) => {
            const imageThumb =
              assets &&
              assets.find((asset) => asset.assetType === 'IMAGE_THUMB')

            return (
              <li
                key={orderItemId}
                className="CheckoutViewBagMobile--productListImagesItem"
              >
                <Link
                  className="CheckoutViewBagMobile--productLink"
                  onClick={openMiniBag}
                >
                  <Image
                    alt={name}
                    className="CheckoutViewBagMobile--productImage"
                    src={imageThumb ? imageThumb.url : baseImageUrl}
                  />
                  {quantity > 1 && (
                    <span className="CheckoutViewBagMobile--productQuantity">
                      x{quantity}
                    </span>
                  )}
                </Link>
              </li>
            )
          }
        )}
        {showRemainingProductsNumber && (
          <li
            key="remainingProductsNumber"
            className="CheckoutViewBagMobile--remainingProductsNumber"
          >
            <Link
              className="CheckoutViewBagMobile--remainingProductsNumberLink"
              onClick={openMiniBag}
            >
              +{remainingProductsNumber}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
CheckoutViewBagMobile.propTypes = {
  openMiniBag: PropTypes.func.isRequired,
  totalCost: PropTypes.string,
  bagProducts: PropTypes.arrayOf(
    PropTypes.shape({
      orderItemId: PropTypes.number,
      name: PropTypes.string,
      baseImageUrl: PropTypes.string,
      assets: PropTypes.array,
      quantity: PropTypes.number,
    })
  ),
}
CheckoutViewBagMobile.defaultProps = {
  bagProducts: [],
  totalCost: '',
}
CheckoutViewBagMobile.contextTypes = {
  l: PropTypes.func,
}

export default connect(
  (state) => ({
    bagProducts: getShoppingBagProductsWithInventory(state),
  }),
  {}
)(CheckoutViewBagMobile)
