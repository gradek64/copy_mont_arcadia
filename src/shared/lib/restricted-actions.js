/**
 * BACKGROUND
 *
 * See: DES-4660
 *
 * As part of the 'Remember Me' functionality, we needed a way to redirect a PARTIALLY AUTHENTICATED[1] user
 * to the login page when they try to perform an action restricted to only FULLY AUTHENTICATED users.
 *
 * This set of functions and HOC allows us to remember an action and intended parameters so it can be fullfilled
 * after the user successfully logs in again.
 *
 * [1] See https://arcadiagroup.atlassian.net/wiki/spaces/CoreAPI/pages/992543223/Remember+Me
 */

import React from 'react'
import { connect } from 'react-redux'
import { omit } from 'ramda'
import { browserHistory } from 'react-router'
import { isUserPartiallyAuthenticated } from '../selectors/userAuthSelectors'
import {
  isInCheckout as isInCheckoutSelector,
  getPrevPath,
  getRoutePath,
  isLoginPage,
} from '../selectors/routingSelectors'
import { getUserEmail } from '../selectors/common/accountSelectors'

let actionData = null

function redirect(pathname, search) {
  browserHistory.replace({
    pathname,
    search,
  })
}

export function storeActionData(data) {
  actionData = data
}

function deferAction(getState, actionName, args) {
  if (!process.browser) {
    throw new Error(
      'Restricted action redirect may only be called in the browser'
    )
  }
  const state = getState()
  const isInCheckout = isInCheckoutSelector(state)
  const userEmail = getUserEmail(state)
  const redirectUrl = isLoginPage(state)
    ? getPrevPath(state)
    : getRoutePath(state)

  storeActionData({
    actionName,
    userEmail,
    redirectUrl,
    args: args || [],
  })

  const redirectLocation = isInCheckout ? '/checkout/login' : '/login'

  return redirect(
    redirectLocation,
    `?redirectUrl=${encodeURIComponent(redirectUrl)}`
  )
}

function removeActionData() {
  actionData = null
}

export const intendedUserChanged = () => {
  const data = actionData || {}
  const { userEmail } = data

  if (!userEmail) {
    return null
  }

  return (currentUserEmail) => currentUserEmail !== userEmail
}

export const isRestrictedActionResponse = (resp = {}) =>
  resp.status === 401 && !!resp.body && !!resp.body.isRestrictedActionResponse

/**
 * Creates an action which wraps an existing action to add redirect behaviour
 * if the user becomes partially authenticated.
 *
 * @param {Function} action the action to wrap
 * @param {String} actionName the name of the action to be wrapped - used to call the action action by name
 *
 * NOTES:
 *
 * > The 'actionName' is required because IE does not support Function.prototype.name. Other browsers have also
 *   been known to have inconsistent behaviour for this property.
 *
 * @returns {Function} a function which passes all arguments through to the original action whilst adding redirect behaviour
 */
export const restrictedAction = (action, actionName) => (...args) => (
  dispatch,
  getState
) => {
  if (isUserPartiallyAuthenticated(getState())) {
    return deferAction(getState, actionName, args)
  }

  const result = dispatch(action(...args))

  if (result instanceof Promise) {
    return result
      .then((value) => {
        if (isUserPartiallyAuthenticated(getState())) {
          return deferAction(getState, actionName, args)
        }
        return value
      })
      .catch((error) => {
        if (!isRestrictedActionResponse(error.response)) {
          throw error
        }

        if (isUserPartiallyAuthenticated(getState())) {
          deferAction(getState, actionName, args)
        }
      })
  }

  return result
}

const getActionParameters = (props) => {
  if (!actionData) {
    return null
  }

  const { actionName, redirectUrl, userEmail, args } = actionData

  const isNotAtIntendedUrl = window.location.pathname !== redirectUrl
  if (isNotAtIntendedUrl) {
    return null // make sure not to run if the same action is called on a different page
  }

  const userHasChanged = userEmail !== props.userEmail
  if (userHasChanged) {
    return null
  }

  return { actionName, args }
}

/**
 * Returns a Higher Order Component which adds behaviour to another component to dispatch
 * Redux actions on mount. The action name is extracted from the partial-auth-restricted-action cookie
 * in order to call the correct action with the correct parameters which are stored in memory.
 *
 * @param {Object} mapDispatchToProps defines the actions which can be called using the cookie value
 *
 * @return {Function} A function to which a component will be passed to add the desired behaviour
 */
export default function withRestrictedActionDispatch(mapDispatchToPropsObj) {
  if (!mapDispatchToPropsObj || typeof mapDispatchToPropsObj !== 'object') {
    throw new Error("'mapDispatchToPropsObj' object is required")
  }

  return (WrappedComponent) => {
    if (!WrappedComponent) {
      throw new Error('A Component must be passed in order to wrap behaviour')
    }

    const { displayName, name } = WrappedComponent

    const Component = class extends React.PureComponent {
      static WrappedComponent = WrappedComponent
      static displayName = `WithRestrictedActionDispatch(${displayName ||
        name ||
        'AnonymousRestrictedActionComponent'})` // Ensure we can understand what this component is in dev tools

      componentDidMount() {
        const actionParams = getActionParameters(this.props)
        if (!actionParams) return

        const { actionName, args } = actionParams
        this.dispatchAction(actionName, args)
      }

      dispatchAction = (actionName, args) => {
        const action = this.props[actionName]

        if (action) {
          try {
            action(...args)
          } finally {
            removeActionData()
          }
        }
      }

      render() {
        const props = omit(['userEmail'], this.props)
        return <WrappedComponent {...props} />
      }
    }

    return connect(
      (state) => ({ userEmail: getUserEmail(state) }),
      mapDispatchToPropsObj,
      null,
      { withRef: true }
    )(Component)
  }
}
