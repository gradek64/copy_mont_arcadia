import createReducer from '../../lib/create-reducer'

export default createReducer(
  {},
  {
    CLEAR_PRODUCT: () => ({}),
    UPDATE_PRODUCT_ITEMS: (currentProduct, { productId, items }) => {
      if (currentProduct.productId === productId) {
        return {
          ...currentProduct,
          items,
        }
      }
      return {
        ...currentProduct,
        newItems: {
          productId,
          items,
        },
      }
    },
    SET_PRODUCT: (currentProduct, { product }) => {
      // This is to persist 'list' property that was set before the CLEAR_PRODUCT action
      const { list } = currentProduct
      if (
        currentProduct.newItems &&
        currentProduct.newItems.productId === product.productId
      ) {
        product.items = currentProduct.newItems.items
      }
      return {
        ...product,
        list,
        newItems: undefined,
      }
    },
    UPDATE_SEE_MORE_URL: (currentProduct, { seeMoreLink, seeMoreUrl }) => {
      const seeMoreValue = currentProduct.seeMoreValue.map((seeMore) => {
        return seeMore.seeMoreLink === seeMoreLink
          ? {
              ...seeMore,
              seeMoreUrl,
            }
          : seeMore
      })
      return {
        ...currentProduct,
        seeMoreValue,
      }
    },
    SET_PREDECESSOR_PAGE: (currentProduct, { list }) => {
      return {
        ...currentProduct,
        list,
      }
    },
  }
)
