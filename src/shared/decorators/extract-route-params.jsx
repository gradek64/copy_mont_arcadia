import { omit } from 'ramda'
import React from 'react'

export default (routeParams) => (Component) => {
  const NewComponent = (props = {}) => {
    const routeProps = routeParams.reduce((currentRouteParams, routeParam) => {
      return props.route && routeParam in props.route
        ? {
            ...currentRouteParams,
            [routeParam]: props.route[routeParam],
          }
        : currentRouteParams
    }, {})
    return <Component {...omit(['route'], props)} {...routeProps} />
  }

  NewComponent.WrappedComponent = Component

  return NewComponent
}
