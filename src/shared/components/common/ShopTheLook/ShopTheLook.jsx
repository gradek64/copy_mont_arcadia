import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'

import { getRouteFromUrl } from '../../../lib/get-product-route'

// Components
import ProductCarousel from '../ProductCarousel/ProductCarousel'

const ShopTheLook = ({ shopTheLookProducts, bundleURL }, { l }) => {
  const carouselProducts = Array.isArray(shopTheLookProducts)
    ? shopTheLookProducts.map(
        ({
          bundleImagePath,
          productDisplayURL,
          bundleProductPrice,
          productId,
        }) => ({
          name: '',
          url: productDisplayURL,
          imageUrl: bundleImagePath,
          price: bundleProductPrice,
          productId: parseInt(productId, 10),
        })
      )
    : []

  return carouselProducts.length ? (
    <div className="ShopTheLook">
      <h3>{l`Shop the set`}</h3>
      <ProductCarousel
        isImageFallbackEnabled
        products={carouselProducts}
        hidePrice
      />
      <Link className="ShopTheLook-link Button" to={getRouteFromUrl(bundleURL)}>
        {l`View The Set`}
      </Link>
    </div>
  ) : null
}

ShopTheLook.propTypes = {
  shopTheLookProducts: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  bundleURL: PropTypes.string.isRequired,
}

ShopTheLook.defaultProps = {
  shopTheLookProducts: [],
  bundleURL: '',
}

ShopTheLook.contextTypes = {
  l: PropTypes.func,
}

export default ShopTheLook
