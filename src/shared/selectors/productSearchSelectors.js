import { path } from 'ramda'

const rootSelector = (state) => state.productsSearch || {}

export const isSearchBarOpen = (state) => path(['open'], rootSelector(state))
