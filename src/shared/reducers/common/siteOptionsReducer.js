import createReducer from '../../lib/create-reducer'
import { omit } from 'ramda'

const initialState = {
  USStates: [],
  expiryYears: [],
  expiryMonths: [],
  peakService: false,
  billingCountries: [],
  titles: [],
  currencyCode: '',
  version: '',
  title: '',
  keyword: '',
  description: '',
}

export default createReducer(initialState, {
  SET_SITE_OPTIONS: (state, { siteOptions }) => ({
    ...state,
    ...omit(['creditCardOptions', 'deliveryCountries'], siteOptions),
  }),
})
