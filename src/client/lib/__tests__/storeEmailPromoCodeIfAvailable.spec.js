import storeEmailPromoCodeIfAvailable from '../storeEmailPromoCodeIfAvailable'
import { removeItem } from '../cookie/utils'

describe('storeEmailPromoCodeIfAvailable', () => {
  process.browser = true
  afterEach(() => {
    removeItem('arcpromoCode')
  })

  it('takes promo code from query string and adds it to cookie', () => {
    const code = 'LEWISTHOMASDAVE'
    const queryString = `?ARCPROMO_CODE=${code}`

    storeEmailPromoCodeIfAvailable(queryString)

    expect(document.cookie).toContain(`arcpromoCode=${code}`)
  })

  it('does not set if promo not present in query string', () => {
    const queryString = `foo=bar`

    storeEmailPromoCodeIfAvailable(queryString)

    expect(document.cookie).not.toContain('arcpromoCode')
  })

  it('does not set if promo if no query string', () => {
    storeEmailPromoCodeIfAvailable('')

    expect(document.cookie).not.toContain('arcpromoCode')

    storeEmailPromoCodeIfAvailable()

    expect(document.cookie).not.toContain('arcpromoCode')

    storeEmailPromoCodeIfAvailable(null)

    expect(document.cookie).not.toContain('arcpromoCode')
  })
})
