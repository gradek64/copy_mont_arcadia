import * as actions from '../modalActions'
import { getMockStoreWithInitialReduxState } from 'test/unit/helpers/get-redux-mock-store'
import React from 'react'
import ErrorModal from '../../../components/common/Modal/ErrorModal'
import DDPTCModal from '../../../components/common/Modal/DDPTCModal'

jest.mock('react-dom/server', () => ({
  renderToString: jest.fn((arg) => arg),
}))

describe('Modal Actions', () => {
  const activeElement = {
    nodeName: 'INPUT',
  }
  Object.defineProperty(global.document, 'activeElement', {
    get: () => activeElement,
  })
  afterAll(() => {
    Object.defineProperty(global.document, 'activeElement', {})
  })
  it('setModalMode(mode)', () => {
    const mode = 'someMode'
    expect(actions.setModalMode(mode)).toEqual({
      type: 'SET_MODAL_MODE',
      mode,
    })
  })
  it('setModalType(type)', () => {
    const type = 'someType'
    expect(actions.setModalType(type)).toEqual({
      type: 'SET_MODAL_TYPE',
      modalType: type,
    })
  })
  it('setModalCancelled(cancelled)', () => {
    const cancelled = true
    expect(actions.setModalCancelled(cancelled)).toEqual({
      type: 'SET_MODAL_CANCELLED',
      cancelled,
    })
  })
  it('clearModalChildren()', () => {
    expect(actions.clearModalChildren()).toEqual({
      type: 'CLEAR_MODAL_CHILDREN',
    })
  })
  it('setPredecessorModal(predecessorModal)', () => {
    const predecessorModal = { someKey: true }
    expect(actions.setPredecessorModal(predecessorModal)).toEqual({
      type: 'SET_PREDECESSOR_MODAL',
      predecessorModal,
    })
  })
  it('openPredecessorModal(predecessorModal)', () => {
    const store = getMockStoreWithInitialReduxState()
    const modal = {
      type: 'type',
      mode: 'mode',
      children: {},
      entryPoint: false,
      cancelled: false,
      predecessorModal: {},
    }
    const {
      type,
      mode,
      children,
      entryPoint,
      cancelled,
      predecessorModal,
    } = modal

    store.dispatch(actions.openPredecessorModal(modal))
    expect(store.getActions()[0]).toEqual({
      type: 'SET_MODAL_CANCELLED',
      cancelled,
    })
    expect(store.getActions()[1]).toEqual({
      type: 'SET_MODAL_MODE',
      mode,
    })
    expect(store.getActions()[2]).toEqual({
      type: 'SET_MODAL_CHILDREN',
      children,
    })
    expect(store.getActions()[3]).toEqual({
      type: 'SET_MODAL_TYPE',
      modalType: type,
    })
    expect(store.getActions()[4]).toEqual({
      type: 'OPEN_MODAL',
      entryPoint,
    })
    expect(store.getActions()[5]).toEqual({
      type: 'SET_PREDECESSOR_MODAL',
      predecessorModal,
    })
  })
  describe('closeModal()', () => {
    it('when shouldScrollToPreviousPosition arg not provided', () => {
      expect(actions.closeModal()).toEqual({
        type: 'CLOSE_MODAL',
        shouldScrollToPreviousPosition: true,
      })
    })
    it('when shouldScrollToPreviousPosition arg is true', () => {
      expect(actions.closeModal(true)).toEqual({
        type: 'CLOSE_MODAL',
        shouldScrollToPreviousPosition: true,
      })
    })
    it('when shouldScrollToPreviousPosition arg is false', () => {
      expect(actions.closeModal(false)).toEqual({
        type: 'CLOSE_MODAL',
        shouldScrollToPreviousPosition: false,
      })
    })
  })
  describe('toggleModal()', () => {
    it('when process.browser', () => {
      process.browser = true
      expect(actions.toggleModal()).toEqual({
        type: 'TOGGLE_MODAL',
        entryPoint: activeElement,
      })
    })
    it('when not process.browser', () => {
      process.browser = false
      expect(actions.toggleModal()).toEqual({
        type: 'TOGGLE_MODAL',
        entryPoint: false,
      })
    })
  })
  describe('setModalChildren()', () => {
    const html = <div>Product added to cart</div>
    it('when process.browser', () => {
      process.browser = true
      expect(actions.setModalChildren(html)).toEqual({
        type: 'SET_MODAL_CHILDREN',
        children: html,
      })
    })
    it('when not process.browser', () => {
      process.browser = false
      expect(actions.setModalChildren(html)).toEqual({
        type: 'SET_MODAL_CHILDREN',
        children: html,
      })
    })
  })
  describe('showModal()', () => {
    const children = <div>Product added to cart</div>
    const store = getMockStoreWithInitialReduxState()
    beforeEach(() => {
      store.clearActions()
    })
    it('should reset modal cancelled to false', () => {
      store.dispatch(actions.showModal(children))
      expect(store.getActions()[0]).toEqual({
        type: 'SET_MODAL_CANCELLED',
        cancelled: false,
      })
    })
    it('without mode and type in options', () => {
      store.dispatch(actions.showModal(children))
      expect(store.getActions()[1]).toEqual({
        type: 'SET_MODAL_MODE',
        mode: 'normal',
      })
      expect(store.getActions()[2]).toEqual({
        type: 'SET_MODAL_CHILDREN',
        children,
      })
      expect(store.getActions()[3]).toEqual({
        type: 'SET_MODAL_TYPE',
        modalType: 'dialog',
      })
      expect(store.getActions()[4]).toEqual({
        type: 'OPEN_MODAL',
        entryPoint: false,
      })
    })
    it('with mode value', () => {
      store.dispatch(actions.showModal(children, { mode: 'someMode' }))
      expect(store.getActions()[1]).toEqual({
        type: 'SET_MODAL_MODE',
        mode: 'someMode',
      })
    })
    it('with type value', () => {
      store.dispatch(actions.showModal(children, { type: 'someType' }))
      expect(store.getActions()[3]).toEqual({
        type: 'SET_MODAL_TYPE',
        modalType: 'someType',
      })
    })
    it('with process.browser and production env', () => {
      const env = process.env.NODE_ENV
      global.process.env.NODE_ENV = 'production'
      process.browser = true
      store.dispatch(actions.showModal(children))
      expect(store.getActions()[1]).toEqual({
        type: 'SET_MODAL_MODE',
        mode: 'normal',
      })
      expect(store.getActions()[2]).toEqual({
        type: 'SET_MODAL_CHILDREN',
        children,
      })
      expect(store.getActions()[3]).toEqual({
        type: 'SET_MODAL_TYPE',
        modalType: 'dialog',
      })
      expect(store.getActions()[4]).toEqual({
        type: 'OPEN_MODAL',
        entryPoint: activeElement,
      })
      global.process.env.NODE_ENV = env
    })
  })

  describe('showErrorModal', () => {
    const store = getMockStoreWithInitialReduxState()
    beforeEach(() => {
      store.clearActions()
    })

    it('calls error Modal', () => {
      store.dispatch(actions.showErrorModal('hello'))
      expect(store.getActions()[2].children).toEqual(
        <ErrorModal message="hello" />
      )
    })
  })

  describe('showTAndCModal', () => {
    let dispatchedActions
    beforeEach(() => {
      const store = getMockStoreWithInitialReduxState()
      store.dispatch(actions.showTAndCModal())
      dispatchedActions = store.getActions()
    })

    it('calls DDPTCModal', () => {
      expect(dispatchedActions[2].children).toEqual(<DDPTCModal />)
    })

    it('sets mode to terms', () => {
      expect(dispatchedActions[1].mode).toEqual('terms')
    })
  })
})
