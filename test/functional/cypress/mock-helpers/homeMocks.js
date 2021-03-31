import home from '../fixtures/cms/home.json'
import homeMobile from '../fixtures/cms/home-mobile.json'
import { isMobileLayout } from '../lib/helpers'

export default function homeMocks(routes) {
  return routes
    .map((route) => {
      const url = typeof route.url === 'string' ? route.url : route.url.source

      if (url.includes('cmscontent')) {
        return {
          method: 'GET',
          url: /\/cmscontent.*cmsPageName=home/,
          response: isMobileLayout() ? homeMobile : home,
        }
      }

      return route
    })
    .concat([
      {
        method: 'GET',
        url: /\/cmscontent.*cmsPageName=(&|$)/,
        response: {},
      },
      {
        method: 'GET',
        url: /\/cmscontent.*(location\[pathname\]=%|cmsPageName=(?!home))/,
        response: {},
      },
    ])
}
