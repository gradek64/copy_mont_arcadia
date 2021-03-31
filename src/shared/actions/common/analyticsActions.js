export function pageLoaded(pageName, loadTime) {
  return (dispatch) => {
    dispatch({
      type: 'PAGE_LOADED',
      payload: {
        pageName,
        loadTime,
      },
    })
    const pageLoadedEvent = new Event('PAGE_LOADED')
    document.dispatchEvent(pageLoadedEvent)
  }
}
