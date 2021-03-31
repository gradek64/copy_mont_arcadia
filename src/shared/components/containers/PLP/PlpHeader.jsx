import React from 'react'
import PropTypes from 'prop-types'
import SandBox from '../SandBox/SandBox'
import { fixCmsUrl } from '../../../lib/cms-utilities'

import extractCategoryTitle from '../../../lib/extract-category-title'

const PlpHeader = (
  {
    total,
    title,
    isMobile,
    catHeaderResponsiveCmsUrl,
    categoryTitle,
    isDynamicTitle,
    showCatHeaderForMobile,
  },
  { l }
) => {
  const shouldShowSandboxMobile =
    showCatHeaderForMobile && catHeaderResponsiveCmsUrl

  if (
    (isMobile && shouldShowSandboxMobile) ||
    (!isMobile && catHeaderResponsiveCmsUrl)
  ) {
    return (
      <div>
        <SandBox
          location={{
            pathname: fixCmsUrl(catHeaderResponsiveCmsUrl),
          }}
          shouldGetContentOnFirstLoad
          isResponsiveCatHeader
          isInPageContent
          cmsPageName="catHeader"
        />
      </div>
    )
  }

  return (
    <div className="PlpHeader">
      <h1>
        <span className="PlpHeader-title">
          {(isDynamicTitle && extractCategoryTitle(title)) || categoryTitle}
        </span>
      </h1>
      <span className="PlpHeader-total PlpHeader-totalValue">{total}</span>
      <span className="PlpHeader-total PlpHeader-totalLabel">{l`results`}</span>
    </div>
  )
}

PlpHeader.propTypes = {
  total: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  categoryTitle: PropTypes.string,
  catHeaderResponsiveCmsUrl: PropTypes.string,
  isDynamicTitle: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool,
  showCatHeaderForMobile: PropTypes.bool,
}

PlpHeader.contextTypes = {
  l: PropTypes.func,
}

PlpHeader.defaultProps = {
  catHeaderResponsiveCmsUrl: '',
  isMobile: false,
  categoryTitle: 'Loading...',
}

export default PlpHeader
