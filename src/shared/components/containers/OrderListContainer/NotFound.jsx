import PropTypes from 'prop-types'
import React from 'react'

const NotFound = ({ message }) => (
  <p className="OrderList-notFound">{message}</p>
)

NotFound.propTypes = {
  message: PropTypes.string.isRequired,
}

export default NotFound
