import PropTypes from 'prop-types'
import React from 'react'

import FeatureCheck from '../FeatureCheck/FeatureCheck'

const DeliveryCutoffMessage = ({ message }) => {
  return message ? (
    <FeatureCheck flag="FEATURE_DELIVERY_CUTOFF_MESSAGE">
      <div className="DeliveryCutoff">
        <p
          className="DeliveryCutoff-message"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </FeatureCheck>
  ) : null
}

DeliveryCutoffMessage.propTypes = {
  message: PropTypes.string,
}

export default DeliveryCutoffMessage
