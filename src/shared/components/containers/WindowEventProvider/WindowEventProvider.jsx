import { Component } from 'react'
import PropTypes from 'prop-types'

export class WindowEventProvider extends Component {
  static childContextTypes = {
    addListener: PropTypes.func,
    removeListener: PropTypes.func,
  }

  getChildContext() {
    const { addListener, removeListener } = this
    return {
      addListener,
      removeListener,
    }
  }

  addListener = (eventName, handler) => {
    console.log('add customEvent', eventName)
    console.log('customEvent handler', handler.name)
    window.addEventListener(eventName, handler)
  }

  removeListener = (eventName, handler) => {
    console.log('remove customEvent', eventName)
    console.log('customEvent handler', handler.name)
    window.removeEventListener(eventName, handler)
  }

  render() {
    return this.props.children
  }
}
