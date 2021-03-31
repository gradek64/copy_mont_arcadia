import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Link from '../../common/Link'
import classnames from 'classnames'
import { has } from 'ramda'
import { heDecode } from '../../../lib/html-entities'
import { browserHistory } from 'react-router'

import ImageContainer from './ImageContainer'

// Helpers
const CONTENT_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
}

const hasFooterImage = (subcategory) => {
  const hasImage = has('image')
  const hasSpan = has('span')

  return (
    hasImage(subcategory) &&
    hasSpan(subcategory.image) &&
    subcategory.image.span === 'footer'
  )
}

const getContentType = (subcategory) => {
  const hasImage = has('image')
  return hasImage(subcategory) ? CONTENT_TYPE.IMAGE : CONTENT_TYPE.TEXT
}

const getItemClassNames = (subcategory) =>
  classnames('MegaNav-subcategoryItem', {
    [`category_${subcategory.categoryId}`]: subcategory.categoryId,
  })

const getItemLinkClassNames = (subcategory) =>
  classnames('MegaNav-subcategoryItemLink', {
    'MegaNav-subcategoryItemLink--bold': subcategory.bold,
    'MegaNav-subcategoryItemLink--NoHover': subcategory.image,
  })

const getStyles = (subcategory) => {
  // paddingTop must be a number and not a string
  const paddingTop = Number(subcategory.paddingTop) || 0
  return { paddingTop }
}

const Subcategory = ({ subcategory, hideMegaNav }) => {
  const getContent = (contentType, subcategory) => {
    switch (contentType) {
      case CONTENT_TYPE.TEXT: {
        return (
          <div className="MegaNav-ItemContainer">
            <span className="MegaNav-subcategoryItemLabel">
              {heDecode(subcategory.label)}
            </span>
          </div>
        )
      }

      case CONTENT_TYPE.IMAGE: {
        return (
          <ImageContainer
            subcategory={subcategory}
            className="MegaNav-imageContainer"
          />
        )
      }

      default:
        return null
    }
  }

  if (hasFooterImage(subcategory)) return null

  const to = subcategory.redirectionUrl || subcategory.url || ''
  const isExternal = to.includes('/blog/')
  const gotoLink = isExternal
    ? undefined
    : (e) => {
        e.preventDefault()
        browserHistory.push(to)
        hideMegaNav()
      }

  const linkProps = {
    isExternal,
    className: getItemLinkClassNames(subcategory),
    title: heDecode(subcategory.label),
    style: getStyles(subcategory),
    to,
    onClick: gotoLink,
    onTouchEnd: gotoLink,
  }

  const contentType = getContentType(subcategory)

  return (
    <li key={subcategory.categoryId} className={getItemClassNames(subcategory)}>
      <Link {...linkProps}>{getContent(contentType, subcategory)}</Link>
    </li>
  )
}

Subcategory.propTypes = {
  subcategory: PropTypes.shape({
    redirectionUrl: PropTypes.string,
    url: PropTypes.string,
    label: PropTypes.string,
    paddingTop: PropTypes.string,
    image: PropTypes.shape({
      height: PropTypes.number,
      openNewWindow: PropTypes.bool,
      width: PropTypes.number,
      // This is weird. It shouldn't be either number or a string. Idealy, we'd transform that to integer in coreAPI mapper, but for now, this is the fix.
      span: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      url: PropTypes.string,
    }),
  }).isRequired,
  hideMegaNav: PropTypes.func,
}

const areEqual = (prevProps, nextProps) => {
  return prevProps.subcategory.label === nextProps.subcategory.label
}

export default memo(Subcategory, areEqual)
