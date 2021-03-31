import PropTypes from 'prop-types'
import React from 'react'

function CVVInfo(props, context) {
  const { l } = context

  return (
    <article className="CVVInfo">
      <div className="CVVInfo-cellOne CVVInfo-section">
        <h1 className="CVVInfo-sectionHeading">{l`How to find your security number`}</h1>
        <p
        >{l`The security number (CVV) is the number that can be found at the back of your card next to the signature.`}</p>
        <p
        >{l`For American Express card holders it can be found on the front.`}</p>
      </div>
      <div className="CVVInfo-cellTwo">
        <div>
          <img src="/assets/common/images/cvv.svg" alt="" />
        </div>
        <div className="CVVInfo-section CVVInfo-securityNumberInfo">
          <h2 className="CVVInfo-sectionHeading">{l`Can't read your security number?`}</h2>
          <p
          >{l`If you can't read your security number, please contact your card issuer`}</p>
        </div>
      </div>
    </article>
  )
}

CVVInfo.contextTypes = {
  l: PropTypes.func,
}

export default CVVInfo
