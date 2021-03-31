import React, { Component } from 'react'
import SwatchesPrivate from './SwatchesPrivate'
import FeatureCheck from '../FeatureCheck/FeatureCheck'

export default class Swatches extends Component {
  render() {
    return (
      <FeatureCheck flag="FEATURE_SWATCHES">
        <SwatchesPrivate {...this.props} />
      </FeatureCheck>
    )
  }
}
