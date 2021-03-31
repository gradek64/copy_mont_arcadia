import {
  getEtagMethod,
  getCacheControl,
} from '../../../src/shared/lib/cacheable-urls'

const assert = (path, timeout) => {
  test(`Monty API and static asset URLs return default TTL - ${path}`, () => {
    const regex = timeout === null ? /^$/ : new RegExp(`max-age=${timeout}`)

    expect(getCacheControl('hapi', path)).toMatch(regex)
  })
}
assert('/', 600)
assert(
  '/?utm_medium=email&utm_source=MS&utm_campaign=UK_201852_A_Adhoc&utm_content=SS&utm_term=A2MO&subscriptionID=44079481&dtm_em=a38a6f1fc959eced3285d8e095ef0a1d',
  600
)
assert('/api/cms', null)
assert('/api/cms/content', 600)
assert('/api/navigation', null)
assert('/api/navigation/page', 600)
assert('/api/site-options', 600)
assert('/api/footers', 600)
assert('/api/products/item', 600)
assert('/api/product/item', 600)
assert('/api/products?q=jacket', 600)
assert('/api/products/?', 600)
assert('/api/products/stock?productId=007', 60)
assert('/api/product/123', 600)
assert(
  '/api/products/%2Fen%2Ftsuk%2Fproduct%2Fpetite-mid-blue-orson-slim-leg-jeans-7608885',
  600
)
assert(
  '/api/products/%2Ffr%2Ftsfr%2Fproduit%2Fmoto-red-jamie-jeans-7546695',
  600
)
assert(
  '/api/products/%2Fde%2Ftsde%2Fprodukt%2Fflame-red-mom-shorts-7611835',
  600
)

assert('/cmscontent', 600)
assert(
  '/cmscontent?storeCode=tsuk&brandName=topshop&cmsPageName=mobilePLPESpotPos1',
  600
)
assert('/api/stores-countries?brand=x', 600)
assert('/assets/tsuk/images/pic1', 86400)
assert('/assets/bruk/images/pic1', 86400)
assert('/assets/images/pic1', null)
assert('/assets/tsuk/fonts/font1', 31536000)
assert('/assets/common/vendor.js', 31536000)
assert('/assets/common/bundle.js', 31536000)
assert('/assets/content/cms/script.65cc53237cb76554654f561c4e8b7969.js', 604800)
assert(
  '/assets/content/cms/styles-topshop.0e5c1d8577697eebbb250523764cd986.css',
  31536000
)
assert(
  '/assets/content/cms/page-data/topshop/tsuk?seoUrl=/cms/pages/json/json-0000160259/json-0000160259.json',
  600
)
assert('/assets/topshop/styles.cfb0877c382c46b15f1923c62a042ece.css', 31536000)
assert('/assets/common/bundle.ed24c41a710ba0fcf48cccdeac8d4c5d.js', 31536000)
assert('/assets/common/vendor.31f48fa489353d06d4ded922817fd1c3.js', 31536000)
assert('/en/tsuk/category/shoes-430/loafers-5928805', 600)
assert(
  '/en/tsuk/category/the-anti-cliche-christmas-6030568/home?TS=1477557146856&amp;intcmpid=MOBILE_WK8_THURS_CHRISTMAS',
  600
)
assert('/en/tsuk/product/lucy-loafer-print-5809755', 600)
assert('/some-random', null)

test('Monty static asset URLs return correct eTag method', () => {
  const assert = (path, method) => {
    expect(getEtagMethod('hapi', path)).toBe(method)
  }
  assert('/assets/tsuk/images/image.jpq', 'hash')
  assert('/assets/bruk/fonts/font.ttf', 'hash')
  assert('/assets/common/asset.ext', false)
  assert('/unmatched-path', false)
})

test('Monty checkout urls return correct cache control settings', () => {
  const assert = (path) => {
    expect(getCacheControl('hapi', path)).toBe(
      'no-cache, no-store, must-revalidate'
    )
  }
  assert('/checkout')
  assert('/checkout/payment')
  assert('/checkout/delivery-payment')
})
