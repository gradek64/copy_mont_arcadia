import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AddToBagConfirm from '../AddToBagConfirm/AddToBagConfirm'
import Button from '../Button/Button'

import { toggleModal } from '../../../actions/common/modalActions'

@connect(
  () => ({}),
  { toggleModal }
)
class AddToBagModal extends Component {
  static propTypes = {
    toggleModal: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { toggleModal } = this.props
    const { l } = this.context

    return (
      <div className="AddToBagModal">
        <p
          data-modal-focus
          tabIndex="0"
        >{l`Your item has been added to your bag`}</p>
        <AddToBagConfirm onClose={toggleModal} />
        <Button
          className="AddToBagModal-button Button--secondary"
          clickHandler={toggleModal}
        >{l`Continue shopping`}</Button>
      </div>
    )
  }
}

export default AddToBagModal
