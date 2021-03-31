import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import Button from '../Button/Button'

if (process.browser) require('./InfoModal.css')

const InfoModal = (
  {
    infoText,
    cancelClick,
    cancelLink,
    cancelText,
    actionClick,
    actionLink,
    actionText,
  },
  { l }
) => (
  <div className="InfoModal-container">
    <p data-modal-focus tabIndex="0">
      {l(infoText)}
    </p>
    <div className="InfoModal-buttonContainer">
      {cancelLink && (
        <Link
          className="InfoModal-link InfoModal-white"
          to={cancelLink}
          onClick={cancelClick}
        >
          {l(cancelText)}
        </Link>
      )}
      {!cancelLink && (
        <Button
          className="InfoModal-button InfoModal-white"
          clickHandler={cancelClick}
        >
          {l(cancelText)}
        </Button>
      )}
      {actionLink && (
        <Link
          className="InfoModal-link InfoModal-black"
          to={actionLink}
          onClick={actionClick}
        >
          {l(actionText)}
        </Link>
      )}
      {!actionLink && (
        <Button
          className="InfoModal-button InfoModal-black"
          clickHandler={actionClick}
        >
          {l(actionText)}
        </Button>
      )}
    </div>
  </div>
)

InfoModal.propTypes = {
  infoText: PropTypes.string.isRequired,
  cancelClick: PropTypes.func,
  cancelLink: PropTypes.string,
  cancelText: PropTypes.string.isRequired,
  actionClick: PropTypes.func,
  actionLink: PropTypes.string,
  actionText: PropTypes.string.isRequired,
}

InfoModal.defaultProps = {
  cancelClick: () => {},
  actionClick: () => {},
}

InfoModal.contextTypes = {
  l: PropTypes.func.isRequired,
}

export default InfoModal
