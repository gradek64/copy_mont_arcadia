import React from 'react'
import { AbandonmentModalTrigger } from '../AbandonmentModalTrigger'
import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import Espot from '../../Espot/Espot'
import throttle from 'lodash.throttle'
import { setItem } from '../../../../../client/lib/cookie/utils'

jest.mock('lodash.throttle')
jest.mock('../../../../../client/lib/cookie/utils', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

describe('AbandonmentModalTrigger', () => {
  const renderComponent = testComponentHelper(AbandonmentModalTrigger, {
    disableLifecycleMethods: false,
  })

  const defaultProps = {
    isFeatureAbandonmentModalEnabled: true,
    isMobile: false,
    isLoggedIn: false,
    hasShoppingBagItems: true,
    getAbandonmentModalEspot: jest.fn(),
    espot: 'ESPOT_NAME',
    showModal: jest.fn(),
  }

  describe('componentDidMount()', () => {
    it('should add mousemove eventListener if shouldAddListener() is true', () => {
      const addEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock

      const { instance } = renderComponent(defaultProps)

      expect(addEventListenerMock).toHaveBeenCalledTimes(1)
      expect(addEventListenerMock).toHaveBeenCalledWith(
        'mousemove',
        throttle(instance.mousePositionCheck, 300)
      )
    })

    it('should not add mousemove eventListener if FEATURE_ABANDONMENT_MODAL feature flag is false', () => {
      const props = {
        ...defaultProps,
        isFeatureAbandonmentModalEnabled: false,
      }

      const addEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock

      renderComponent(props)

      expect(addEventListenerMock).not.toHaveBeenCalled()
    })
    it('should not add mousemove eventListener if isMobile is true', () => {
      const props = {
        ...defaultProps,
        isMobile: true,
      }

      const addEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock

      renderComponent(props)

      expect(addEventListenerMock).not.toHaveBeenCalled()
    })
    it('should not add mousemove eventListener if isLoggedIn is true', () => {
      const props = {
        ...defaultProps,
        isLoggedIn: true,
      }

      const addEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock

      renderComponent(props)

      expect(addEventListenerMock).not.toHaveBeenCalled()
    })
    it('should not add mousemove eventListener if hasShoppingBagItems is false', () => {
      const props = {
        ...defaultProps,
        hasShoppingBagItems: false,
      }

      const addEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock

      renderComponent(props)

      expect(addEventListenerMock).not.toHaveBeenCalled()
    })
  })

  describe('componentDidUpdate', () => {
    it('should add mousemove eventListener on componentDidUpdate', () => {
      const props = {
        ...defaultProps,
        isMobile: true,
      }

      const addEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock

      const { wrapper } = renderComponent(props)

      expect(addEventListenerMock).not.toHaveBeenCalled()

      wrapper.setProps({
        isMobile: false,
      })

      expect(addEventListenerMock).toHaveBeenCalled()
    })
  })

  describe('componentWillUnmount()', () => {
    it('should remove the mousemove eventListener', () => {
      const addEventListenerMock = jest.fn()
      const removeEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock
      global.document.removeEventListener = removeEventListenerMock

      const { wrapper, instance } = renderComponent(defaultProps)

      expect(addEventListenerMock).toHaveBeenCalledTimes(1)
      wrapper.unmount()
      expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
      expect(addEventListenerMock).toHaveBeenCalledWith(
        'mousemove',
        throttle(instance.mousePositionCheck, 300)
      )
    })
  })

  describe('when the user meets the abandonment modal trigger criteria', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('and the fetch for the espot data was successful', () => {
      describe('when the mouse navigates within 10px from the top of the window', () => {
        it('should call the showModal action, should set that the modal has been seen and should remove the eventListener', () => {
          const { instance } = renderComponent({
            ...defaultProps,
            abandonmentEspotErrored: false,
          })
          const event = { clientY: 7 }
          const espotComponent = <Espot identifier={defaultProps.espot} />
          const espotMode = { mode: 'noBleed' }
          const removeEventListenerMock = jest.fn()

          global.document.removeEventListener = removeEventListenerMock

          instance.mousePositionCheck(event)

          expect(defaultProps.showModal).toHaveBeenCalled()
          expect(defaultProps.showModal).toHaveBeenCalledWith(
            espotComponent,
            espotMode
          )
          expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
          expect(setItem).toHaveBeenCalledWith('hasSeenAbandonmentModal', true)
        })
      })

      describe('when the mouse navigates more than 10px from the top of the window', () => {
        it('should not call the showModal action', () => {
          const { instance } = renderComponent({
            ...defaultProps,
            abandonmentEspotErrored: false,
          })
          const event = { clientY: 34 }
          instance.mousePositionCheck(event)

          expect(defaultProps.showModal).not.toHaveBeenCalled()
        })
      })

      describe('when the mouse returns to within 10px from the top of the window for the second time', () => {
        it('should not show the modal', () => {
          const myEvents = {}
          global.document.addEventListener = jest.fn((event, cb) => {
            myEvents[event] = cb
          })

          global.document.removeEventListener = jest.fn(() => {
            myEvents.mousemove = jest.fn(() => false)
          })

          throttle.mockImplementationOnce((fn) => fn)

          const { instance } = renderComponent({
            ...defaultProps,
            abandonmentEspotErrored: false,
          })

          // Simulate to move the mouse on top of the page
          myEvents.mousemove({ clientY: 2 })

          // Modal is displayed
          expect(defaultProps.showModal).toHaveBeenCalled()
          expect(defaultProps.showModal).toHaveBeenCalledTimes(1)

          // Component props is updated
          expect(setItem).toHaveBeenCalledWith('hasSeenAbandonmentModal', true)

          // We remove the listener
          expect(myEvents.mousemove()).toBeFalsy()

          // Mouse moved down
          myEvents.mousemove({ clientY: 15 })
          expect(instance.props.showModal).toHaveBeenCalledTimes(1)

          // Mouse Again up
          myEvents.mousemove({ clientY: 3 })
          expect(instance.props.showModal).toHaveBeenCalledTimes(1)
        })
      })
    })
    describe('and the fetch for the espot data was unsuccessful', () => {
      it('should not show the modal', () => {
        const { instance } = renderComponent({
          ...defaultProps,
          abandonmentEspotErrored: true,
        })
        const event = { clientY: 7 }
        const removeEventListenerMock = jest.fn()

        global.document.removeEventListener = removeEventListenerMock

        instance.mousePositionCheck(event)

        expect(defaultProps.showModal).not.toHaveBeenCalled()
        expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
