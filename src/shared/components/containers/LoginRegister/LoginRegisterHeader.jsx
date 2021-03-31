import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const LoginRegisterHeader = ({ className, children }) => (
  <h3 className={classNames(className, 'LoginRegisterHeader')}>{children}</h3>
)

LoginRegisterHeader.displayName = 'LoginRegisterHeader'
LoginRegisterHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export default LoginRegisterHeader
