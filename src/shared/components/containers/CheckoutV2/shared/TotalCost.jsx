import PropTypes from 'prop-types'
import React from 'react'
import QubitReact from 'qubit-react/wrapper'

function TotalCost({ totalCost }, { l }) {
  return (
    <QubitReact id="checkout-view-bag-total-cost">
      <div className="TotalCost">
        {l`Total Cost`}: {totalCost}
      </div>
    </QubitReact>
  )
}

TotalCost.propTypes = {
  totalCost: PropTypes.string,
}

TotalCost.contextTypes = {
  l: PropTypes.func,
}

export default TotalCost
