import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Image from '../Image/Image'
import { isFeatureBazaarVoiceEnabled } from '../../../selectors/featureSelectors'

class RatingImage extends Component {
  static propTypes = {
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    className: PropTypes.string,
    bazaarVoiceEnabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    className: '',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  calculateStars = () => {
    const { rating, brandName } = this.props
    const roundedRating = Number(parseInt(rating, 10))
    const { l } = this.context

    return [1, 2, 3, 4, 5].map((num) => {
      const type = num <= roundedRating ? 'filled' : 'empty'
      return (
        <Image
          key={num}
          className="RatingImage-star"
          src={`/assets/${brandName}/images/rating-${type}.svg`}
          alt={l`${roundedRating} out of 5 stars`}
        />
      )
    })
  }

  render() {
    const { className, bazaarVoiceEnabled } = this.props
    return bazaarVoiceEnabled ? (
      <div className={`RatingImage ${className}`}>{this.calculateStars()}</div>
    ) : null
  }
}

export default connect((state) => ({
  brandName: state.config.brandName,
  bazaarVoiceEnabled: isFeatureBazaarVoiceEnabled(state),
}))(RatingImage)
