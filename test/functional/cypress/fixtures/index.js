const cms = {
  cmscontent: require('./cms/cmscontent.json'),
}

const general = {
  categories: require('./general/categories.json'),
  footer: require('./general/footer.json'),
  navigation: require('./general/navigation.json'),
  siteOptions: require('./general/siteOptions.json'),
  storeCountryLocator: require('./general/storeCountryLocator.json'),
}

const pdp = {
  fixedBundle: require('./pdp/fixedBundle.json'),
}

const plp = {
  noResults: require('./plp/no-results.json'),
  initialPageLoad: require('./plp/initialPageLoad.json'),
  storesCountries: require('./plp/storesCountries.json'),
  EspotPos1: require('./plp/EspotPos1.json'),
  unfiltered_shoes: require('./plp/filters/category-shoes.json'),
}

const checkout = {
  payments: require('./checkout/payments.json'),
  order422Error: require('./checkout/order--error422.json'),
}

const wishlist = {
  wishlists: require('./wishlist/wishlist-noItems2.json'),
  wishlistNoItem: require('./wishlist/wishlist-noItem.json'),
}
export default {
  cms,
  general,
  pdp,
  plp,
  checkout,
  wishlist,
}
