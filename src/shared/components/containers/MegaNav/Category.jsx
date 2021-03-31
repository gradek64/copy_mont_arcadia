import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, equals } from 'ramda'

import { heDecode, replaceUrl } from '../../../lib/html-entities'

import SubNav from './SubNav'
import Link from '../../common/Link'

const getUrl = ({
  apiEnvironment,
  category,
  isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled,
}) => {
  const { redirectionUrl, url } = category
  const toUrl =
    !isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled && redirectionUrl
      ? redirectionUrl
      : url
  return apiEnvironment === 'prod' ? toUrl : replaceUrl(toUrl)
}

const Category = ({
  category,
  onHoverCategory,
  unselectCategory,
  apiEnvironment,
  isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled,
  touchEnabled,
  megaNavSelectedCategory,
}) => {
  const { categoryId, label, columns } = category
  const categoryClasses = classnames('MegaNav-category', {
    [`category_${categoryId}`]: categoryId,
    'MegaNav-category--isNotTouch': !touchEnabled,
    'MegaNav-category--isTouch': touchEnabled,
  })

  const title = heDecode(label)
  const categoryUrl = getUrl({
    apiEnvironment,
    category,
    isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled,
  })

  // Comment from matol, from March 15th, 2019 2:22pm - DES-5446 handle /blog in mega nav main level links (#8053)
  // The following is only temporary. A more generic/extendable solution
  // will be implemented as part of https://arcadiagroup.atlassian.net/browse/DES-5457
  const urlToBeServerSideRendered = ['/blog/']
  const linkIsExternal = urlToBeServerSideRendered.includes(categoryUrl)
  const shouldShowSpan = touchEnabled && !isEmpty(columns)
  const linkCommonProperties = {
    className: 'MegaNav-categoryLink',
    title,
    onTouchStart: () => onHoverCategory({ categoryId, categoryUrl }),
  }
  return (
    <li
      key={categoryId}
      className={categoryClasses}
      onTouchStart={() => onHoverCategory({ categoryId })}
      onMouseEnter={() => onHoverCategory({ categoryId })}
    >
      {shouldShowSpan ? (
        <span {...linkCommonProperties} style={{ cursor: 'pointer' }}>
          {title}
        </span>
      ) : (
        <Link
          {...linkCommonProperties}
          isExternal={linkIsExternal}
          to={categoryUrl}
          onClick={linkIsExternal ? null : unselectCategory}
        >
          {title}
        </Link>
      )}
      {!isEmpty(columns) && (
        <div
          className={classnames('MegaNav-subNavWrapper', {
            'MegaNav-subNavWrapper--isNotTouch': !touchEnabled,
          })}
        >
          <SubNav
            key={categoryId}
            isActive={categoryId === megaNavSelectedCategory}
            category={category}
            unselectCategory={unselectCategory}
          />
        </div>
      )}
    </li>
  )
}

Category.propTypes = {
  category: PropTypes.object.isRequired,
  onHoverCategory: PropTypes.func.isRequired,
  unselectCategory: PropTypes.func.isRequired,
  apiEnvironment: PropTypes.string,
  isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled:
    PropTypes.bool.isRequired,
  touchEnabled: PropTypes.bool.isRequired,
}

Category.defaultProps = {
  apiEnvironment: '',
}

const areEqual = (prevProps, nextProps) => equals(prevProps, nextProps)

export default memo(Category, areEqual)
