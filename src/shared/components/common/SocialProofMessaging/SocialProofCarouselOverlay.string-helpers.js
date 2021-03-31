const carouselOverlayTitle = {
  ts: 'Trending Product',
  tm: 'Selling Fast!',
  ms: 'Selling Fast!',
  dp: 'Get it quick!',
  ev: 'SELLING FAST',
  br: 'Selling fast!',
}

const carouselOverlayTextNotMobile = {
  ts: 'This style is selling fast!',
}

export const carouselOverlayTextMobileAndDesktop = {
  default: (l) => l`Shop it before it's gone`,
  tm: (l, trendingProductClicks) =>
    l`This item has been added to bag ${trendingProductClicks} times today`,
  wl: (l, trendingProductClicks) =>
    l`This item has been added to bag ${trendingProductClicks} times in the last hour`,
  ms: (l, trendingProductClicks) =>
    l`This item has been added to bag ${trendingProductClicks} times`,
  dp: (l, trendingProductClicks) =>
    `${trendingProductClicks} people added this item to their bag in the last 4 hours`,
  ev: (l, trendingProductClicks) =>
    l`${trendingProductClicks} people have added this to their bag in the last hour`,
  br: (l, trendingProductClicks) =>
    l`${trendingProductClicks} added to bag in last 48 hrs`,
}

export const getCarouselOverlayTitle = (brandCode) =>
  carouselOverlayTitle[brandCode] || carouselOverlayTitle.default

export const getCarouselOverlayTextNotMobile = (brandCode) =>
  carouselOverlayTextNotMobile[brandCode] ||
  carouselOverlayTextNotMobile.default

export const getCarouselOverlayTextMobileAndDesktop = (
  l,
  brandCode,
  trendingProductClicks
) => {
  const carouselOverlayTextMobileAndDesktopToRetrieve =
    carouselOverlayTextMobileAndDesktop[brandCode] ||
    carouselOverlayTextMobileAndDesktop.default
  return carouselOverlayTextMobileAndDesktopToRetrieve(l, trendingProductClicks)
}
