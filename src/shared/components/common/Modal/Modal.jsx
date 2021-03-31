import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import KEYS from '../../../constants/keyboardKeys'
import AccessibleText from '../AccessibleText/AccessibleText'
import * as modalActions from '../../../actions/common/modalActions'

@connect(
  (state) => ({
    modalOpen: state.modal.open,
    mode: state.modal.mode,
    modalChildren: state.modal.children,
    entryPoint: state.modal.entryPoint,
    type: state.modal.type,
    predecessorModal: state.modal.predecessorModal,
  }),
  modalActions
)
class Modal extends Component {
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalChildren: PropTypes.node.isRequired,
    mode: PropTypes.string.isRequired,
    type: PropTypes.string,
    onCloseModal: PropTypes.func,
    clearModalChildren: PropTypes.func,
    entryPoint: PropTypes.any,
    setModalCancelled: PropTypes.func,
    predecessorModal: PropTypes.object,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.onKeyDown)
  }

  UNSAFE_componentWillReceiveProps({ modalOpen }) {
    const { modalOpen: currentModalOpen, clearModalChildren } = this.props
    if (!modalOpen && currentModalOpen) {
      clearModalChildren()
    }
  }

  componentDidUpdate({ modalOpen: wasOpen }) {
    const { modalOpen } = this.props
    const focusItem = document.querySelector('[data-modal-focus]')
    if (modalOpen && !wasOpen && focusItem) {
      focusItem.focus()
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = ({ keyCode }) => {
    if (this.props.mode !== 'warning' && keyCode === KEYS.ESCAPE)
      this.closeModal()
  }

  closeModal = () => {
    const {
      entryPoint,
      onCloseModal,
      setModalCancelled,
      predecessorModal,
      openPredecessorModal,
    } = this.props
    if (predecessorModal) {
      openPredecessorModal(predecessorModal)
    } else {
      setModalCancelled(true)
      onCloseModal()
      return entryPoint && entryPoint.focus()
    }
  }

  render() {
    const { modalOpen, modalChildren, mode, type } = this.props
    const { l } = this.context
    const modalState = modalOpen ? ' is-shown' : ''
    const modalClass = `Modal${modalState} Modal--${mode}`
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={modalClass}
        onKeyDown={this.onKeyDown}
        role={type}
        aria-label="Modal"
      >
        <button className="Modal-closeIcon" onClick={this.closeModal}>
          <span aria-hidden>×</span>
          <AccessibleText
          >{l`Close modal (can also press escape key to close).`}</AccessibleText>
        </button>
        {typeof modalChildren === 'string' ? (
          // eslint-disable-next-line react/no-danger
          <div dangerouslySetInnerHTML={{ __html: modalChildren }} />
        ) : (
          <div className="Modal-children">{modalChildren}</div>
        )}
      </div>
    )
  }
}

export default Modal
