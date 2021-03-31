import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closeModal } from '../../../actions/common/modalActions'

import Button from '../Button/Button'

if (process.browser) require('./ErrorModal.css')

@connect(
  () => ({}),
  {
    closeModal,
  }
)
class ErrorModal extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { message, closeModal } = this.props
    const { l } = this.context
    return (
      <div>
        <p>{message}</p>
        <Button clickHandler={closeModal}>{l`Ok`}</Button>
      </div>
    )
  }
}

export default ErrorModal
