import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { scrollToTopImmediately } from '../../../shared/lib/scroll-helper'

function ScrollToTop(props) {
  const { children, routes = [], location: { pathname, action } = {} } = props

  if (!process.browser) {
    return children
  }

  React.useEffect(
    () => {
      // Don't scroll to top if user hits
      // back button, or is route prop preserveScroll is true:
      if (action !== 'POP' && !routes.some((route) => !!route.preserveScroll)) {
        scrollToTopImmediately()
      }
    },
    [pathname]
  )

  return children
}

ScrollToTop.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    action: PropTypes.string,
  }).isRequired,
}

export default withRouter(ScrollToTop)
