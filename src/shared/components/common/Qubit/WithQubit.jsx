import React from 'react'
import QubitReact from 'qubit-react/wrapper'

const WithQubit = ({ shouldUseQubit, children = null, ...qubitProps }) => {
  return shouldUseQubit ? (
    <QubitReact {...qubitProps}>{children}</QubitReact>
  ) : (
    children
  )
}

export default WithQubit
