export function setPageType(pageType) {
  return {
    type: 'SET_PAGE_TYPE',
    pageType,
  }
}

export function clearPageType() {
  return {
    type: 'CLEAR_PAGE_TYPE',
  }
}
