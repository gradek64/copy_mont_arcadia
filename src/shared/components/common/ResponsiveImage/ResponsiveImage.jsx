import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Image from '../Image/Image'
import {
  IMAGE_FORMAT,
  IMAGE_SIZES_RANGE,
  PROGRESSIVE_JPG_PARAM,
  RECOMMENDED_QUALITY_PARAM,
} from '../../../constants/amplience'
import screenSizes from '../../../constants/responsive'
import { isAmplienceFeatureEnabled } from '../../../selectors/featureSelectors'

/**
 * Given an object of sizes per breakpoint, returns an array of valid image sizes
 * closest to those provided
 *
 * @param  {Object} breakpointSizes
 * @return {Array<String>} e.g. ['175', '200', '400']
 */
function buildClosestSizesArray(breakpointSizes) {
  return [
    breakpointSizes.mobile,
    breakpointSizes.tablet,
    breakpointSizes.desktop,
  ].map((y) => IMAGE_SIZES_RANGE.find((z) => z >= y))
}

function buildSrcSetLine(
  url,
  { width, qlt, jpgFormat = null, fmt = null },
  size
) {
  const query = [`$w${width}$`, fmt, jpgFormat, qlt].filter((x) => x).join('&')
  return `${url}?${query} ${size}w`
}

function buildSrcSet(
  url,
  sizesArray,
  { jpgFormat = null, qlt = RECOMMENDED_QUALITY_PARAM, fmt = null } = {}
) {
  return sizesArray
    .map((size) =>
      buildSrcSetLine(
        url,
        {
          width: size,
          jpgFormat,
          qlt,
          fmt,
        },
        size
      )
    )
    .join(', ')
}

const ResponsiveImage = ({
  isAmplienceEnabled,
  amplienceUrl,
  sizes,
  isImageFallbackEnabled,
  useProgressiveJPG,
  ...props
}) => {
  if (!isAmplienceEnabled || (!amplienceUrl && isImageFallbackEnabled)) {
    return <Image {...props} />
  }

  const hasValidAmplienceProperties = !!amplienceUrl
  let extraProps = { src: '/assets/common/images/image-not-available.png' }

  if (hasValidAmplienceProperties) {
    const jpgFormat = `${PROGRESSIVE_JPG_PARAM}=${useProgressiveJPG}`

    const src = `${amplienceUrl}.${IMAGE_FORMAT}`
    const ie11CompatibleDownscaledSrc = `${src}?$w700$&${RECOMMENDED_QUALITY_PARAM}`

    const sizesArray = buildClosestSizesArray(sizes)
    const srcSet = buildSrcSet(src, sizesArray, { jpgFormat })
    const webpSrcSet = buildSrcSet(src, sizesArray, {
      qlt: `qlt=80`,
      fmt: 'fmt=webp',
    })

    extraProps = {
      src: ie11CompatibleDownscaledSrc,
      srcSet,
      webpSrcSet,
      sizes: [
        `(max-width: ${screenSizes.mobile.max}px) ${sizes.mobile}px,`,
        `(max-width: ${screenSizes.tablet.max}px) ${sizes.tablet}px,`,
        `${sizes.desktop}px`,
      ].join(' '),
    }
  }

  return <Image {...props} {...extraProps} />
}

ResponsiveImage.propTypes = {
  ...Image.PropTypes,
  isImageFallbackEnabled: PropTypes.bool,
  isAmplienceEnabled: PropTypes.bool.isRequired,
  amplienceUrl: PropTypes.string,
  sizes: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number,
  }),
}

ResponsiveImage.defaultProps = {
  isImageFallbackEnabled: false,
  amplienceUrl: '',
  // TODO: review this as it's designed this must have a default as size are passed down as null if not defined
  sizes: {
    mobile: 200,
    tablet: 400,
    desktop: 800,
  },
  useProgressiveJPG: false,
}

const mapStateToProps = (state) => ({
  isAmplienceEnabled: isAmplienceFeatureEnabled(state),
})

export default connect(mapStateToProps)(ResponsiveImage)
