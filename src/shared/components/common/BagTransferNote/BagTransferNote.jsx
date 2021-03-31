import PropTypes from 'prop-types'
import React from 'react'

export const bagTransferNoteTextKey = `If you have items in your basket they will be 
  transferred, but will be subject to local pricing and 
  promotions. Some items may not be suitable for sale in your 
  selected region and will be removed.`

const BagTransferNote = (props, { l }) => {
  return <div className="BagTransferNote">{l(bagTransferNoteTextKey)}</div>
}

BagTransferNote.contextTypes = {
  l: PropTypes.func,
}

export default BagTransferNote
