import React from 'react'
import PropTypes from 'prop-types'

const Form = React.forwardRef(({ children, ...restProps }, ref) => (
  <form ref={ref} {...restProps}>
    {children}
  </form>
))

Form.displayName = 'Form'

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  noValidate: PropTypes.bool,
}

Form.defaultProps = {
  noValidate: true,
}

export default Form
