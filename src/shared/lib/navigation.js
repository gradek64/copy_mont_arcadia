/**
 * url = "/en/tsuk/category/help-information-4912595/students-4912533"
 *
 * redirectionUrl = /webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd?catalogId=33057&storeId=12556&
 * langId=-1&viewAllFlag=false&categoryId=1924856&interstitial=true&TS=1463651801527
 */
export function fromSeoUrlToRedirectionUrl(url, menuLinks) {
  let redirectionUrl = false

  if (url && Array.isArray(menuLinks)) {
    const urlAssociatedMenuItem = menuLinks.filter((menuLink) => {
      return (
        menuLink.seoUrl === url || menuLink.seoUrl === decodeURIComponent(url)
      )
    })

    redirectionUrl = url
    if (
      Array.isArray(urlAssociatedMenuItem) &&
      urlAssociatedMenuItem.length &&
      urlAssociatedMenuItem[0].redirectionUrl
    ) {
      redirectionUrl = urlAssociatedMenuItem[0].redirectionUrl
    }
  }
  const result =
    redirectionUrl && redirectionUrl !== url
      ? encodeURIComponent(redirectionUrl)
      : redirectionUrl

  return result
}
