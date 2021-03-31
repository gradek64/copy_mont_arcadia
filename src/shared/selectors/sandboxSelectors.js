import { createSelector } from 'reselect'
import { pathOr, isEmpty } from 'ramda'

export const selectSandbox = (state) => state.sandbox || {}

export const getSandboxStylesheets = createSelector(
  [selectSandbox],
  (sandbox) => {
    const pages = pathOr([], ['pages'], sandbox)

    if (isEmpty(pages)) return []

    const cssLinks = []
    const cssUrls = []
    const pageKeys = Object.keys(pages)
    pageKeys.forEach((key) => {
      const links = pathOr([], [key, 'head', 'link'], pages)
      links.forEach((link) => {
        if (link.rel === 'stylesheet' && !cssUrls.includes(link.href)) {
          cssLinks.push(link)
          cssUrls.push(link.href)
        }
      })
    })

    return cssLinks
  }
)
