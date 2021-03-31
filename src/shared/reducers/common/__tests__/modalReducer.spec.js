import testReducer from '../modalReducer'
import React from 'react'
import { getMockStoreWithInitialReduxState } from 'test/unit/helpers/get-redux-mock-store'

describe('Modal Reducer', () => {
  it('Default values', () => {
    const state = getMockStoreWithInitialReduxState().getState()
    expect(state.modal.open).toBe(false)
    expect(state.modal.mode).toBe('normal')
    expect(state.modal.type).toBe('dialog')
    expect(state.modal.children).toEqual([])
    expect(state.modal.predecessorModal).toEqual(null)
  })
  describe('TOGGLE_MODAL', () => {
    it('should toggle `open` option and reset `entryPoint` if was open', () => {
      expect(
        testReducer(
          { open: true, entryPoint: <div>some element</div> },
          {
            type: 'TOGGLE_MODAL',
            entryPoint: <body />,
          }
        )
      ).toEqual({
        open: false,
        entryPoint: null,
      })
    })
    it('should toggle `open` option and set `entryPoint` if wasnt open', () => {
      expect(
        testReducer(
          { open: false, entryPoint: null },
          {
            type: 'TOGGLE_MODAL',
            entryPoint: <div>some element</div>,
          }
        )
      ).toEqual({
        open: true,
        entryPoint: <div>some element</div>,
      })
    })
  })
  describe('SET_MODAL_MODE', () => {
    it('should set `mode`', () => {
      expect(
        testReducer(
          { mode: 'normal' },
          {
            type: 'SET_MODAL_MODE',
            mode: 'someMode',
          }
        )
      ).toEqual({
        mode: 'someMode',
      })
    })
  })
  describe('SET_MODAL_TYPE', () => {
    it('should set `modalType`', () => {
      expect(
        testReducer(
          { type: 'dialog' },
          {
            type: 'SET_MODAL_TYPE',
            modalType: 'someType',
          }
        )
      ).toEqual({
        type: 'someType',
      })
    })
  })
  describe('SET_MODAL_CANCELLED', () => {
    it('should set `cancelled`', () => {
      expect(
        testReducer(
          { cancelled: false },
          {
            type: 'SET_MODAL_CANCELLED',
            cancelled: true,
          }
        )
      ).toEqual({
        cancelled: true,
      })
    })
  })
  describe('SET_MODAL_CHILDREN', () => {
    it('should set `children`', () => {
      expect(
        testReducer(
          { children: [] },
          {
            type: 'SET_MODAL_CHILDREN',
            children: 'someChildren',
          }
        )
      ).toEqual({
        children: 'someChildren',
      })
    })
  })
  describe('CLEAR_MODAL_CHILDREN', () => {
    it('should set `children`', () => {
      expect(
        testReducer(
          { children: 'someChildren' },
          {
            type: 'CLEAR_MODAL_CHILDREN',
          }
        )
      ).toEqual({
        children: [],
      })
    })
  })
  describe('OPEN_MODAL', () => {
    it('should set `entryPoint` and `open` to true', () => {
      expect(
        testReducer(
          { entryPoint: <span>some element</span> },
          {
            type: 'OPEN_MODAL',
            entryPoint: <div>some element</div>,
          }
        )
      ).toEqual({
        open: true,
        entryPoint: <div>some element</div>,
      })
    })
  })
  describe('CLOSE_MODAL', () => {
    it('should return the current state if the modal is already closed', () => {
      const state = { open: false, someOtherStateKey: 'alskjdfklshd' }
      expect(
        testReducer(state, {
          type: 'CLOSE_MODAL',
        })
      ).toBe(state)
    })
    it('should reset `entryPoint` and set `open` to false', () => {
      expect(
        testReducer(
          {
            open: true,
            entryPoint: <span>some element</span>,
          },
          {
            type: 'CLOSE_MODAL',
            entryPoint: <div>some element</div>,
          }
        )
      ).toEqual({
        open: false,
        entryPoint: null,
      })
    })
  })
  describe('SET_PREDECESSOR_MODAL', () => {
    it('should set `predecessorModal`', () => {
      const state = {
        open: true,
      }

      const predecessorModal = {
        type: 'dialog',
        children: {},
        mode: 'someMode',
        predecessorModal: {
          someKey: 'someValue',
        },
      }

      expect(
        testReducer(state, {
          type: 'SET_PREDECESSOR_MODAL',
          predecessorModal,
        })
      ).toEqual({ ...state, predecessorModal })
    })
  })
})
