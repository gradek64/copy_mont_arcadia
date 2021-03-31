import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEmpty, isNil, omit } from 'ramda'
import removeHttp from '../../../lib/remove-http'
import {
  deferredLoadImage,
  lazyLoadImage,
  unobserveLazyImage,
} from '../../../lib/image-loader/image-loader'

const isNilOrEmpty = (arg) => isNil(arg) || isEmpty(arg)

@connect((state) => ({
  brandName: state.config.brandName,
  brandCode: state.config.brandCode,
}))
class Image extends Component {
  static propTypes = {
    brandName: PropTypes.string.isRequired,
    brandCode: PropTypes.string.isRequired,
    className: PropTypes.string,
    imageRef: PropTypes.func,
    deferLoad: PropTypes.bool,
    lazyLoad: PropTypes.bool,
    src: PropTypes.string,
    sizes: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    webpSrcSet: PropTypes.string,
  }

  static defaultProps = {
    imageRef: () => {},
    onLoad: () => {},
    onError: () => {},
    lazyLoad: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      deferLoad: props.deferLoad,
      lazyLoad: props.lazyLoad,
      src: this.resolveSrc(props.src),
    }
  }

  componentDidMount = () => {
    this.doLoad()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.deferLoad === false && this.props.deferLoad) {
      this.setState({ deferLoad: false }, this.doLoad)
    }

    if (nextProps.src !== this.props.src) {
      this.setState(
        {
          src: this.resolveSrc(nextProps.src),
        },
        this.doLoad
      )
    }
  }

  componentWillUnmount() {
    if (this.state.lazyLoad) unobserveLazyImage(this.element)
    this.unmounted = true
  }

  doLoad = () => {
    if (this.state.deferLoad === false) {
      return deferredLoadImage(this.element)
    }
    if (this.state.lazyLoad) {
      return lazyLoadImage(this.element)
    }
  }

  onLoad = () => {
    if (this.unmounted) {
      return
    }
    this.setState({
      deferLoad: false,
      lazyLoad: false,
    })
  }

  onError = () => {
    this.props.onError()
  }

  resolveSrc(src) {
    if (isNilOrEmpty(src)) {
      return ''
    }
    return removeHttp(
      src
        .replace('{brandCode}', this.props.brandCode)
        .replace('{brandName}', this.props.brandName.toLowerCase())
    )
  }

  wrapPicture = (image) => {
    const { sizes, webpSrcSet, srcSet } = this.props

    return (
      <picture>
        <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
        <source srcSet={srcSet} sizes={sizes} type="image/jpeg" />
        {image}
      </picture>
    )
  }

  render() {
    const { imageRef, alt, title, ...props } = this.props

    const { state } = this

    if (state.deferLoad) {
      return null
    }

    if (state.lazyLoad) {
      return (
        <img
          ref={(element) => {
            this.element = element
            imageRef(element)
          }}
          alt={alt}
          title={title || alt}
          style={{ opacity: 0 }}
          onLoad={this.onLoad}
          onError={this.onError}
        />
      )
    }

    const image = (
      <img
        ref={(element) => {
          this.element = element
          imageRef(element)
        }}
        {...omit(
          [
            'brandCode',
            'brandName',
            'dispatch',
            'deferLoad',
            'lazyLoad',
            'webpSrcSet',
          ],
          props
        )}
        src={state.src}
        alt={alt}
        title={title === undefined ? alt : title}
        onLoad={props.onLoad}
        onError={this.onError}
      />
    )

    return props.webpSrcSet ? this.wrapPicture(image) : image
  }
}

export default Image
