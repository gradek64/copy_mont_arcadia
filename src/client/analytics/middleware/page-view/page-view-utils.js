export const getPageTitle = () => {
  const lastIndex = window.document.title.lastIndexOf(' | ')
  return lastIndex === -1
    ? window.document.title
    : window.document.title.substring(0, lastIndex)
}

// CMS currently returns e.g. "mob - Page Title"
export const getFixedCmsPageName = () => getPageTitle().replace(/^mob - /, '')
