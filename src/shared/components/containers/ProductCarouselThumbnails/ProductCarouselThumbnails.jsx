import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Thumbnail from './Thumbnail'
import NavButton from './NavButton'
import {
  amplienceImagesPropTypes,
  IMAGE_SIZES,
} from '../../../constants/amplience'
import { withFeatureCheck } from '../../common/FeatureCheck/FeatureCheck'

const thumbList = '-thumbList'

@withFeatureCheck('FEATURE_PRODUCT_CAROUSEL_THUMBNAIL')
class ProductCarouselThumbnails extends Component {
  static propTypes = {
    className: PropTypes.string,
    setCarouselIndex: PropTypes.func.isRequired,
    maxVisible: PropTypes.number.isRequired,
    startIndex: PropTypes.number,
    amplienceImages: amplienceImagesPropTypes,
  }

  static defaultProps = {
    className: '',
    startIndex: 0,
    amplienceImages: [],
  }

  constructor(props) {
    super(props)

    this.state = {
      index: props.startIndex,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.startIndex !== nextProps.startIndex) {
      this.setState({ index: nextProps.startIndex })
    }
  }

  getVisibleThumbs() {
    const { maxVisible, thumbs, amplienceImages } = this.props
    const { index } = this.state

    const thumbsWithData = thumbs.map((thumb, carouselIndex) => ({
      ...thumb,
      carouselIndex,
      amplienceUrl: amplienceImages[carouselIndex],
    }))

    if (thumbsWithData.length < maxVisible) return thumbsWithData

    const endIndex = index + maxVisible
    const loopedArray = thumbsWithData.concat(thumbsWithData)
    return loopedArray.slice(index, endIndex)
  }

  goToPrevious = () => {
    const { thumbs } = this.props
    const index = this.state.index - 1
    this.setState({
      index: index < 0 ? thumbs.length - 1 : index,
    })
  }

  goToNext = () => {
    const { thumbs } = this.props
    const index = this.state.index + 1
    this.setState({
      index: index >= thumbs.length ? 0 : index,
    })
  }

  isCarouselFull = () => {
    const { thumbs, maxVisible } = this.props
    return thumbs.length >= maxVisible
  }

  renderThumbs() {
    const thumbs = this.getVisibleThumbs()
    const { className, setCarouselIndex } = this.props
    const carouselFull = this.isCarouselFull()

    return thumbs.map((thumbnail) => (
      <li className={`${className}${thumbList}--item`} key={thumbnail.url}>
        <Thumbnail
          key={thumbnail.url}
          className={className}
          source={thumbnail.url}
          index={thumbnail.carouselIndex}
          carouselFull={carouselFull}
          setCarouselIndex={setCarouselIndex}
          amplienceUrl={thumbnail.amplienceUrl}
          sizes={IMAGE_SIZES.thumbnails}
          useProgressiveJPG
        />
      </li>
    ))
  }

  render() {
    const { className, thumbs, maxVisible } = this.props

    if (!Array.isArray(thumbs) || !thumbs.length) return null

    const fullClass = this.isCarouselFull()
      ? `${className}${thumbList}--fullCarousel`
      : ''

    return (
      <div className={className}>
        <NavButton
          maxVisible={maxVisible}
          thumbsLength={thumbs.length}
          className={className}
          direction="previous"
          onClick={this.goToPrevious}
        />

        <ul className={`${className}${thumbList} ${fullClass}`}>
          {this.renderThumbs()}
        </ul>

        <NavButton
          maxVisible={maxVisible}
          thumbsLength={thumbs.length}
          className={className}
          direction="next"
          onClick={this.goToNext}
        />
      </div>
    )
  }
}

export default ProductCarouselThumbnails
