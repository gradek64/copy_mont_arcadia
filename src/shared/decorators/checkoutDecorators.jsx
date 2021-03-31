import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hasCheckedOut } from '../selectors/checkoutSelectors'

export function whenCheckedOut(WrappedComponent) {
  const mapStateToProps = (state) => ({
    hasCheckedOut: hasCheckedOut(state),
  })

  @connect(mapStateToProps)
  class WhenCheckedOut extends Component {
    static WrappedComponent = WrappedComponent

    render() {
      if (!this.props.hasCheckedOut) return null
      return <WrappedComponent />
    }
  }

  return WhenCheckedOut
}
