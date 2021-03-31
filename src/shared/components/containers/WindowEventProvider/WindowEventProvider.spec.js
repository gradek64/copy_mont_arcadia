import React, { Component } from 'react'
import { WindowEventProvider } from './WindowEventProvider'
import { mount } from 'enzyme'

class MockClass extends Component {
  componentDidMount() {
    global.window.addEventListener.mockClear()
    this.context.addListener(this.props.eventName, this.props.eventHandler)
  }

  componentWillUnmount() {
    global.window.removeEventListener.mockClear()
    this.context.removeListener(this.props.eventName, this.props.eventHandler)
  }

  render() {
    return null
  }
}

MockClass.contextTypes = {
  ...WindowEventProvider.childContextTypes,
}

const eventHandler = jest.fn()
const eventName = '<eventName>'

global.window.addEventListener = jest.fn()
global.window.removeEventListener = jest.fn()

describe('<WindowEventProvider />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('context api', () => {
    it('should add an event listener to window', () => {
      mount(
        <WindowEventProvider>
          <MockClass eventName={eventName} eventHandler={eventHandler} />
        </WindowEventProvider>
      )
      expect(global.window.addEventListener).toHaveBeenCalledTimes(4)
      expect(global.window.addEventListener).toHaveBeenCalledWith(
        eventName,
        eventHandler
      )
    })

    it('should remove an event listener from window', () => {
      mount(
        <WindowEventProvider>
          <MockClass eventName={eventName} eventHandler={eventHandler} />
        </WindowEventProvider>
      ).unmount()
      expect(global.window.removeEventListener).toHaveBeenCalledTimes(4)
      expect(global.window.removeEventListener).toHaveBeenCalledWith(
        eventName,
        eventHandler
      )
    })
  })
})
