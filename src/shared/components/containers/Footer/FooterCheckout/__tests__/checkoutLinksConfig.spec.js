import { footerCheckoutLinksUrls } from '../checkoutLinksConfig'

describe('@FooterCheckout', () => {
  it('URL should start from HTTPS instead of HTTP', () => {
    Object.keys(footerCheckoutLinksUrls).forEach((brand) => {
      footerCheckoutLinksUrls[brand].forEach((linkDefinition) => {
        const urlDefinition = linkDefinition.url.uk
        const protocol = /^https:\/\//
        if (typeof urlDefinition === 'string') {
          expect(protocol.test(urlDefinition)).toBe(true)
        } else {
          Object.keys(urlDefinition).forEach((region) => {
            expect(protocol.test(urlDefinition[region])).toBe(true)
          })
        }
      })
    })
  })

  it('URL does not end in a question mark', () => {
    Object.keys(footerCheckoutLinksUrls).forEach((brand) => {
      footerCheckoutLinksUrls[brand].forEach((linkDefinition) => {
        const urlDefinition = linkDefinition.url
        const query = /\?$/

        if (typeof urlDefinition === 'string') {
          expect(query.test(urlDefinition)).toBe(false)
        } else {
          Object.keys(urlDefinition).forEach((region) => {
            expect(query.test(urlDefinition[region])).toBe(false)
          })
        }
      })
    })
  })

  it('URL has no white space at the begining and end', () => {
    Object.keys(footerCheckoutLinksUrls).forEach((brand) => {
      footerCheckoutLinksUrls[brand].forEach((linkDefinition) => {
        const urlDefinition = linkDefinition.url
        const checkLength = (string) => string.length === string.trim().length

        if (typeof urlDefinition === 'string') {
          expect(checkLength(urlDefinition)).toBe(true)
        } else {
          Object.keys(urlDefinition).forEach((region) => {
            expect(checkLength(urlDefinition[region])).toBe(true)
          })
        }
      })
    })
  })
})
