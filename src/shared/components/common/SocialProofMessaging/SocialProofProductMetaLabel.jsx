import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { isFeatureEnabled } from '../../../selectors/featureSelectors'
import { isProductTrending } from '../../../selectors/socialProofSelectors'

function SocialProofProductMetaLabel(
  { isFeatureSocialProofMetaLabelEnabled, isTrending },
  { l }
) {
  if (isFeatureSocialProofMetaLabelEnabled && isTrending) {
    return (
      <div className="SocialProofProductMetaLabel">
        {l('Trending Product')}
        <img
          className="SocialProofProductMetaLabel--badge"
          src="/assets/common/images/social_proof_badge.png"
          alt="Trending Product"
        />
      </div>
    )
  }
  return null
}

SocialProofProductMetaLabel.propTypes = {
  isFeatureSocialProofMetaLabelEnabled: PropTypes.bool.isRequired,
  isTrending: PropTypes.bool.isRequired,
}

SocialProofProductMetaLabel.contextTypes = { l: PropTypes.func }

export default connect((state, { productId }) => ({
  isFeatureSocialProofMetaLabelEnabled: isFeatureEnabled(
    state,
    'FEATURE_SOCIAL_PROOF_PLP_META_LABEL'
  ),
  isTrending: isProductTrending(state, productId, 'PLP'),
}))(SocialProofProductMetaLabel)
