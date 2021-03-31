import PropTypes from 'prop-types'

export const VIDEO_FORMAT = 'mp4'
export const VIDEO_SIZE = '720p'

export const IMAGE_FORMAT = 'jpg'
export const IMAGE_SIZES_RANGE = [
  '75',
  '100',
  '150',
  '200',
  '300',
  '400',
  '500',
  '700',
  '1000',
  '1300',
  '2400',
]
export const PROGRESSIVE_JPG_PARAM = 'fmt.jpeg.interlaced'
export const RECOMMENDED_QUALITY_PARAM = 'qlt=80'

export const imageSizesPropTypes = PropTypes.shape({
  mobile: PropTypes.number.isRequired,
  tablet: PropTypes.number.isRequired,
  desktop: PropTypes.number.isRequired,
})

export const amplienceImagesPropTypes = PropTypes.arrayOf(
  PropTypes.string.isRequired
)

export const amplienceAssetsPropTypes = PropTypes.shape({
  images: amplienceImagesPropTypes,
  video: PropTypes.string,
})

export const amplienceAssetsDefaultProps = {
  images: [],
  video: '',
}

export const IMAGE_SIZES = {
  thumbnails: {
    mobile: 100,
    tablet: 100,
    desktop: 100,
  },
  overlayLarge: {
    mobile: 750,
    tablet: 710,
    desktop: 1060,
  },
  productMedia: {
    mobile: 750,
    tablet: 710,
    desktop: 1060,
  },
  bundleProductSlots: {
    mobile: 170,
    tablet: 170,
    desktop: 170,
  },
  smallProduct: {
    mobile: 140,
    tablet: 140,
    desktop: 140,
  },
  miniBag: {
    mobile: 90,
    tablet: 130,
    desktop: 130,
  },
  plp: {
    1: {
      mobile: 355,
      tablet: 355,
      desktop: 355,
    },
    2: {
      mobile: 175,
      tablet: 260,
      desktop: 475,
    },
    3: {
      mobile: 140,
      tablet: 255,
      desktop: 315,
    },
    4: {
      mobile: 125,
      tablet: 125,
      desktop: 230,
    },
  },
}
