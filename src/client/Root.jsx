import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import getRoutes from '../shared/getRoutes'

const Root = ({ store }, context) => (
  <Provider store={store}>
    <Router history={browserHistory}>{getRoutes(store, context)}</Router>
  </Provider>
)

Root.contextTypes = {
  l: PropTypes.func,
  p: PropTypes.func,
}

export default Root

function removeNoJs() {
  const root = document.getElementById('root')

  if (root) {
    root.classList.remove('nojs')
  }
}

removeNoJs()
