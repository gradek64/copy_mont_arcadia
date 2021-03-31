import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

import FeatureCheck from '../FeatureCheck/FeatureCheck'

const FitAttributes = ({
  fitAttributes,
  isQuickview,
  onClick,
  swatchChange,
}) => (
  <FeatureCheck flag="FEATURE_SHOW_FIT_ATTRIBUTE_LINKS">
    <div className="FitAttributes">
      {fitAttributes.map(
        (fitAttribute) =>
          isQuickview ? (
            <button
              onClick={() => {
                swatchChange()
                if (!fitAttribute.isTPMActive) {
                  onClick(fitAttribute.catentryId)
                }
              }}
              key={fitAttribute.catentryId}
              className={classNames('FitAttributes-link', {
                'FitAttributes--stateActive': fitAttribute.isTPMActive,
              })}
            >
              {fitAttribute.TPMName}
            </button>
          ) : (
            <Link
              className={classNames('FitAttributes-link', {
                'FitAttributes--stateActive': fitAttribute.isTPMActive,
              })}
              onClick={() => swatchChange()}
              to={fitAttribute.TPMUrl}
              key={fitAttribute.catentryId}
            >
              {fitAttribute.TPMName}
            </Link>
          )
      )}
    </div>
  </FeatureCheck>
)

FitAttributes.propTypes = {
  fitAttributes: PropTypes.array.isRequired,
  isQuickview: PropTypes.bool,
  onClick: PropTypes.func,
  swatchChange: PropTypes.func,
}

FitAttributes.defaultProps = {
  isQuickview: false,
  onClick: () => {},
  swatchChange: () => {},
}

export default FitAttributes
