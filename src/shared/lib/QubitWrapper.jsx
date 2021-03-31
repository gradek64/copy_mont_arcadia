import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class QubitReactWrapper extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  UNSAFE_componentWillMount() {
    if (!process.browser) return {}
    this.update = this.forceUpdate.bind(this)
    const ns = this.getNamespace()
    ns.update = ns.update || []
    ns.update.push(this.update)
  }

  componentWillUnmount() {
    const ns = this.getNamespace()
    ns.update = ns.update.filter((fn) => {
      return fn !== this.update
    })
  }

  getNamespace = () => {
    if (!process.browser) return {}
    const { id } = this.props
    window.__qubit = window.__qubit || {}
    window.__qubit.reactHooks = window.__qubit.reactHooks || {}
    window.__qubit.reactHooks[id] = window.__qubit.reactHooks[id] || {}
    return window.__qubit.reactHooks[id]
  }

  getHandler = () => {
    return this.getNamespace().handler
  }

  render() {
    const { id, children } = this.props
    const handler = this.getHandler(id)
    if (handler) {
      const result = handler(this.props)
      if (typeof result === 'string') {
        return (
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )
      }
      return result
    }
    return children || null
  }
}
