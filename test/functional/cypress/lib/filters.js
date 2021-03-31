import { path, pathOr } from 'ramda'

const shallowMatch = (matches) => (subject) => {
  return Object.keys(matches).every((key) => subject[key] === matches[key])
}

export const addToBasketEvent = (x) => x.event === 'addToBasket'

export const addToBasketEventWithProductMatching = (match) => (x) =>
  x.event === 'addToBasket' &&
  pathOr([], ['ecommerce', 'add', 'products'], x).some(shallowMatch(match))

export const ecommerce = (x) => path(['ecommerce'], x)

export const ecommerceDetail = (x) => path(['ecommerce', 'detail'], x)

export const ecommerceImpressions = (x) => path(['ecommerce', 'impressions'], x)

export const ecommerceCheckoutStep = (step) => (x) =>
  path(['ecommerce', 'checkout', 'actionField', 'step'], x) === step

export const ecommercePurchase = (x) => path(['ecommerce', 'purchase'], x)

export const pageViewEvent = (x) => x.event === 'pageView'

export const removeFromBasket = (x) => x.event === 'removeFromBasket'

export const userStatus = (x) => path(['user', 'loggedIn'], x)

export const clickEvent = (x) => x.event === 'clickevent'

export const formValidation = (id) => (x) => x.id === id

export const gaEvent = (event) => (x) => x.event === event

export const apiResponse = (api) => (x) => x.apiEndpoint === api
