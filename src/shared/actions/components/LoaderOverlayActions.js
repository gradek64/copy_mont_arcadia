export function toggleLoaderOverlay() {
  return {
    type: 'TOGGLE_LOADER_OVERLAY',
  }
}

export function zeroAjaxCounter() {
  return {
    type: 'AJAXCOUNTER_ZERO',
  }
}

export function ajaxCounter(action) {
  return {
    type:
      action === 'increment'
        ? 'AJAXCOUNTER_INCREMENT'
        : 'AJAXCOUNTER_DECREMENT',
  }
}
