export function selectSwatch(productId, swatchIndex) {
  return {
    type: 'SELECT_SWATCH',
    productId,
    swatchIndex,
  }
}

export function resetSwatchesPage() {
  return {
    type: 'RESET_SWATCHES_PAGE',
  }
}

export function nextSwatches(productId) {
  return {
    type: 'NEXT_SWATCHES',
    productId,
  }
}

export function prevSwatches(productId) {
  return {
    type: 'PREV_SWATCHES',
    productId,
  }
}
