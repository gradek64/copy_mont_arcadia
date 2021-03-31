export default [
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/N-82zZdgl?Nrpp=24&siteId=%2F12556&categoryId=203984&clearAll=true&pageSize=24&categoryId=203984',
    response: 'fixture:plp/filters/category-clothing-clear-all',
    alias: 'category-clothing-clear-all',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/dresses-442/N-82zZdgl?Nrpp=24&siteId=%2F12556&categoryId=208523&clearAll=true&pageSize=24&categoryId=208523',
    response: 'fixture:plp/filters/category-clothing-dresses-clear-all',
    alias: 'category-clothing-dresses-clear-all',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/dresses-442/blue/N-85cZdepZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=208523',
    response: 'fixture:plp/filters/category-clothing-dresses-blue',
    alias: 'category-clothing-dresses-blue',
  },
  {
    method: 'GET',
    url: '/api/products/seo?seoUrl=/en/tsuk/category/shoes-430&pageSize=24',
    response: 'fixture:plp/filters/category-shoes',
    alias: 'category-shoes',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&pageSize=24&categoryId=208492',
    response: 'fixture:plp/filters/category-shoes',
    alias: 'category-shoes',
  },
  {
    method: 'GET',
    url:
      '/api/products/seo?seoUrl=/en/tsuk/category/shoes-430/shop-all-shoes-6909322&pageSize=24',
    response: 'fixture:plp/filters/category-shoes',
    alias: 'category-shoes',
  },
  {
    method: 'GET',
    url: '/api/products/seo?seoUrl=/en/tsuk/category/clothing-427&pageSize=24',
    response: 'fixture:plp/filters/category-clothing',
    alias: 'category-clothing',
  },
  {
    method: 'GET',
    url:
      'api/products/filter?seoUrl=/en/tsuk/category/clothing-427/N-82zZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=203984',
    response: 'fixture:plp/filters/category-clothing',
    alias: 'category-clothing',
  },

  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/white/N-8ewZdf2Zdgl?Nrpp=24&siteId=%2F12556&pageSize=24&categoryId=208492',
    response: 'fixture:plp/filters/category-shoes__filter-colour-white',
    alias: 'category-shoes-white',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/black/white/N-8ewZdeoZdf2Zdgl?Nrpp=24&siteId=%2F12556&pageSize=24&categoryId=208492',
    response: 'fixture:plp/filters/category-shoes__filters-colour-white-black',
    alias: 'category-shoes-white-black',
  },
  {
    method: 'GET',
    url: '/api/products?currentPage=2&pageSize=24&category=208492',
    response: 'fixture:plp/filters/category-shoes__page-2',
    alias: 'category-shoes-page2',
  },
  {
    method: 'GET',
    url: '/api/products?currentPage=3&pageSize=24&category=208492',
    response: 'fixture:plp/filters/category-shoes__page-3',
    alias: 'category-shoes-page3',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/white/N-8ewZdf2Zdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B15%2B89&pageSize=24',
    response:
      'fixture:plp/filters/category-shoes__filters-colour-white-price-min-15',
    alias: 'category-shoes-white-minPrice15',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nf=nowPrice%7CBTWN+15.0+89.0&Nrpp=24&siteId=%2F12556&pageSize=24',
    response: 'fixture:plp/filters/category-shoes__filter-price-min-15',
    alias: 'category-shoes-minPrice15',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B26%2B165&pageSize=24',
    response: 'fixture:plp/filters/category-shoes__filter-price-min-26',
    alias: 'category-shoes-minPrice26',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?&Nf=nowPrice%7CBTWN%2B26%2B142&Nrpp=24&siteId=%2F12556&pageSize=24',
    response:
      'fixture:plp/filters/category-shoes__filters-price-min-26-max-142',
    alias: 'category-shoes-maxPrice142',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&Ns=promoPrice%7C1&siteId=%2F12556&pageSize=24&categoryId=208492',
    response: 'fixture:plp/filters/category-shoes__order-price-high-low',
    alias: 'category-shoes-orderByHighToLow',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&Ns=promoPrice%7C0&siteId=%2F12556&pageSize=24&categoryId=208492',
    response: 'fixture:plp/filters/category-shoes__order-price-low-high',
    alias: 'category-shoes-orderByLowToHigh',
  },
  {
    method: 'GET',
    url:
      'api/products/filter?seoUrl=/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?siteId=%2F12556&Nrpp=24&pageSize=24',
    response: 'fixture:plp/filters/category-clothing__filter-dresses',
    alias: 'category-clothing-dresses',
  },
  {
    method: 'GET',
    url: '/api/products?currentPage=2&pageSize=24&category=203984,208523',
    response: 'fixture:plp/filters/category-clothing__filter-dresses',
    alias: 'category-clothing-dresses-server-side',
  },
  {
    method: 'GET',
    url:
      '/api/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24',
    response: 'fixture:plp/filters/category-clothing__filter-dresses',
    alias: 'category-clothing-dresses-mobile',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/blue/N-82zZdepZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=203984',
    response: 'fixture:plp/filters/category-clothing__filter-blue',
    alias: 'category-clothing-blue',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/blue/12/N-82zZdepZdomZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=203984',
    response: 'fixture:plp/filters/category-clothing__filters-blue-size-12',
    alias: 'category-clothing-blue-size12',
  },

  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/14/N-82zZdooZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=203984',
    response: 'fixture:plp/filters/category-clothing__filters-blue-size-14',
    alias: 'category-clothing-size14',
  },

  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/14/16/N-82zZdooZdopZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=203984',
    response: 'fixture:plp/filters/category-clothing__filters-blue-size-14n16',
    alias: 'category-clothing-size14n16',
  },

  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/xs/N-82zZdp3Zdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=203984',
    response: 'fixture:plp/filters/category-clothing__filters-blue-size-XS',
    alias: 'category-clothing-sizeXS',
  },

  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/clothing-427/dresses-442/12/N-85cZdomZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=208523',
    response: 'fixture:plp/filters/category-clothing-dressesForMobile-size12',
    alias: 'category-clothing-dressesForMobile-size12',
  },

  {
    method: 'GET',
    url:
      'api/products/filter?seoUrl=/en/tsuk/category/clothing-427/dresses-442/m-l/N-85cZdoyZdgl?siteId=%2F12556&Nrpp=24&pageSize=24&categoryId=208523',
    response: 'fixture:plp/filters/category-clothing-dressesForMobile-sizeML',
    alias: 'category-clothing-dressesForMobile-sizeML',
  },
  {
    method: 'GET',
    url: '/api/products?q=shirts',
    response: 'fixture:plp/filters/search-shirts',
    alias: 'search-shirts',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/N-depZdgl?Nrpp=24&Ntt=shirts&seo=false&siteId=%2F12556&pageSize=24&categoryId=undefined',
    response: 'fixture:plp/filters/search-shirts__filter-blue',
    alias: 'search-shirts-blue',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/N-depZdeqZdgl?Nrpp=24&Ntt=shirts&seo=false&siteId=%2F12556&pageSize=24&categoryId=undefined',
    response: 'fixture:plp/filters/search-shirts__filters-blue-brown',
    alias: 'search-shirts-blue-brown',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/N-dgl?Nrpp=24&Ntt=shirts&seo=false&siteId=%2F12556&pageSize=24&categoryId=undefined',
    response: 'fixture:plp/filters/search-shirts',
    alias: 'search-shirts',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/N-depZdotZdgl?Nrpp=24&Ntt=shirts&seo=false&siteId=%2F12556&pageSize=24&categoryId=undefined',
    response: 'fixture:plp/filters/search-shirts__filters-blue-size-6',
    alias: 'search-shirts-blue-size6',
  },
  {
    method: 'GET',
    url:
      'api/products/filter?seoUrl=/en/tsuk/category/shoes-430/white/N-8ewZdf2Zdgl?Nrpp=24&siteId=/12556&No=24&pageSize=24&categoryId=208492',
    response: 'fixture:plp/filters/category-shoes__filter-white__page-2',
    alias: 'category-shoes-white-page2',
  },
  {
    method: 'GET',
    url:
      'api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=/12556&Nf=nowPrice|BTWN+26+165&No=24&pageSize=24',
    response: 'fixture:plp/filters/category-shoes__filter-price-min-26__page-2',
    alias: 'category-shoes-minPrice26-page2',
  },
  {
    method: 'GET',
    url: '/api/products?currentPage=2&q=shirts&pageSize=24',
    response: 'fixture:plp/filters/search-shirts__page-2',
    alias: 'search-shirts-page2',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/N-depZdgl?Nrpp=24&Ntt=shirts&seo=false&siteId=/12556&No=24&pageSize=24&categoryId=undefined',
    response: 'fixture:plp/filters/search-shirts__filters-blue__page-2',
    alias: 'search-shirts-blue-page2',
  },
  {
    method: 'GET',
    url:
      'api/products/filter?seoUrl=/N-dgl?Nrpp=24&Ntt=shirts&seo=false&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B35%2B225&pageSize=24',
    response: 'fixture:plp/filters/search-shirts__filter-price-min-35',
    alias: 'search-shirts-minPrice35',
  },
  {
    method: 'GET',
    url:
      'api/products/filter?seoUrl=/N-dgl?Nrpp=24&Ntt=shirts&seo=false&siteId=/12556&Nf=nowPrice|BTWN+35+225&No=24&pageSize=24',
    response: 'fixture:plp/filters/search-shirts__filter-price-min-35__page-2',
    alias: 'search-shirts-minPrice35-page2',
  },
  {
    method: 'GET',
    url: '/api/products?q=knee high socks',
    response: 'fixture:plp/filters/search-knee-high-socks',
    alias: 'search-knee-high-socks',
  },
  {
    method: 'GET',
    url: '/api/products?currentPage=2&pageSize=24&category=203984',
    response: 'fixture:plp/filters/category-clothing-page2',
    alias: 'category-clothing-page2',
  },
  {
    method: 'GET',
    url: '/api/products?q=socks',
    response: 'fixture:plp/filters/search-socks',
    alias: 'search-socks',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B111%2B165&pageSize=24',
    response: 'fixture:plp/filters/category-shoes__filter-price-min-93',
    alias: '93MinPrice',
  },
  {
    method: 'GET',
    url:
      '/api/products/filter?seoUrl=/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B3%2B165&pageSize=24',
    response: 'fixture:plp/filters/category-shoes__filter-price-max-93',
    alias: '93-Max-Price',
  },
]
