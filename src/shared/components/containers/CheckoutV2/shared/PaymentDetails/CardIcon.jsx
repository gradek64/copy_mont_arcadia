import React from 'react'

const CardIcon = ({ icon }) => (
  <img
    className="PaymentMethodOption-icon"
    key={icon}
    src={`/assets/common/images/${icon}`}
    alt=""
  />
)

export default CardIcon
