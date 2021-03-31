import React from 'react'
import { renderToString } from 'react-dom/server'
import InfoModal from '../../components/common/Modal/InfoModal'
import ErrorModal from '../../components/common/Modal/ErrorModal'
import DDPTCModal from '../../components/common/Modal/DDPTCModal'

function openModal() {
  return {
    type: 'OPEN_MODAL',
    entryPoint:
      process.env.NODE_ENV === 'production' &&
      process.browser &&
      document.activeElement,
  }
}

export function closeModal(shouldScrollToPreviousPosition = true) {
  return {
    type: 'CLOSE_MODAL',
    shouldScrollToPreviousPosition,
  }
}

export function toggleModal() {
  return {
    type: 'TOGGLE_MODAL',
    entryPoint: process.browser && document.activeElement,
  }
}

export function setModalMode(mode) {
  return {
    type: 'SET_MODAL_MODE',
    mode,
  }
}

export function setModalType(type) {
  return {
    type: 'SET_MODAL_TYPE',
    modalType: type,
  }
}

export function setModalCancelled(cancelled) {
  return {
    type: 'SET_MODAL_CANCELLED',
    cancelled,
  }
}

export function clearModalChildren() {
  return {
    type: 'CLEAR_MODAL_CHILDREN',
  }
}

export function setModalChildren(children) {
  return {
    type: 'SET_MODAL_CHILDREN',
    children: process.browser ? children : renderToString(children),
  }
}

export function setPredecessorModal(predecessorModal) {
  return {
    type: 'SET_PREDECESSOR_MODAL',
    predecessorModal,
  }
}

export function showModal(children, options = {}) {
  const { mode, type } = options
  return (dispatch) => {
    dispatch(setModalCancelled(false))
    dispatch(setModalMode(mode || 'normal'))
    dispatch(setModalChildren(children))
    dispatch(setModalType(type || 'dialog'))
    dispatch(openModal())
  }
}

export function openPredecessorModal({
  children,
  type,
  mode,
  predecessorModal,
}) {
  return (dispatch) => {
    dispatch(showModal(children, { mode, type }))
    dispatch(setPredecessorModal(predecessorModal))
  }
}

export function showInfoModal(props, options) {
  return showModal(<InfoModal {...props} />, options)
}

export const showErrorModal = (message) => {
  return showModal(<ErrorModal message={message} />)
}

export const showTAndCModal = () => {
  return showModal(<DDPTCModal />, { mode: 'terms' })
}
