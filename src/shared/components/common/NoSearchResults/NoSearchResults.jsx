import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Helmet from 'react-helmet'
import classnames from 'classnames'

import Button from '../Button/Button'
import Recommendations from '../Recommendations/Recommendations'
import Image from '../Image/Image'
import { toggleProductsSearchBar } from '../../../actions/components/search-bar-actions'
import { getNoSearchResultsEspot } from '../../../actions/common/espotActions'
import SearchInput from '../SearchInput/SearchInput'
import DressipiRecommendationsRail from '../../common/Recommendations/DressipiRecommendationsRail'

import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../analytics'
import Espot from '../../containers/Espot/Espot'
import espotsDesktop from '../../../constants/espotsDesktop'
import {
  getEnhancedNoSearchHelmetTitle,
  getEnhancedNoSearchRecommendationsHeader,
  getEnhancedNoSearchParagraphText,
  getEnhancedNoSearchInputPlaceholder,
  getEnhancedNoSearchSearchLabel,
  getEnhancedNoSearchHeader,
} from './NoSearchResults.string-helpers'
import {
  applyRefinements,
  clearRefinements,
} from '../../../actions/components/refinementsActions'
import { setPredecessorPage } from '../../../actions/common/productsActions'

// selectors
import { getBrandCode } from '../../../selectors/configSelectors'
import {
  getLocationQuery,
  getRouteQuery,
} from '../../../selectors/routingSelectors'
import { isMobile, isDesktop } from '../../../selectors/viewportSelectors'
import {
  isFeatureEnabled,
  isFeatureDressipiRecommendationsEnabled,
} from '../../../selectors/featureSelectors'

@connect(
  (state) => ({
    brandCode: getBrandCode(state),
    isMobile: isMobile(state),
    isDesktop: isDesktop(state),
    queryParams: getLocationQuery(state),
    isFeatureEnhancedNoSearchResultEnabled: isFeatureEnabled(
      state,
      'FEATURE_ENHANCED_NO_SEARCH_RESULT'
    ),
    isLocationQueryObject: getRouteQuery(state),
    isFeatureDressipiRecommendationsEnabled: isFeatureDressipiRecommendationsEnabled(
      state
    ),
  }),
  {
    toggleProductsSearchBar,
    clearRefinements,
    applyRefinements,
    getNoSearchResultsEspot,
    setPredecessorPage,
  }
)
@analyticsDecorator(GTM_CATEGORY.NOT_FOUND, {
  isAsync: true,
})
class NoSearchResults extends Component {
  static propTypes = {
    brandCode: PropTypes.string.isRequired,
    queryParams: PropTypes.object.isRequired,
    toggleProductsSearchBar: PropTypes.func,
    isFiltered: PropTypes.bool,
    clearRefinements: PropTypes.func,
    applyRefinements: PropTypes.func,
    isMobile: PropTypes.bool,
    isFeatureEnhancedNoSearchResultEnabled: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    getNoSearchResultsEspot: PropTypes.func,
    isFeatureDressipiRecommendationsEnabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
  }

  static defaultProps = {
    urlHasUpdated: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    if (this.props.isFeatureEnhancedNoSearchResultEnabled) {
      this.props.getNoSearchResultsEspot()
    }
  }

  clearAndApplyRefinements = () => {
    const { clearRefinements, applyRefinements } = this.props
    clearRefinements()
    applyRefinements()
  }

  continueOption = () => {
    const { toggleProductsSearchBar, isFiltered, isMobile } = this.props
    const { l } = this.context

    return isMobile ? (
      isFiltered ? (
        <Button
          className="NoSearchResults-clearfilters"
          clickHandler={this.clearAndApplyRefinements}
        >{l`clear filters`}</Button>
      ) : (
        <Button
          className="NoSearchResults-searchAgain"
          clickHandler={toggleProductsSearchBar}
        >{l`Search again`}</Button>
      )
    ) : null
  }

  undoLastSelection = () => browserHistory.goBack()

  renderNoSearchResult = () => {
    const { l } = this.context
    const { isFeatureDressipiRecommendationsEnabled } = this.props
    return [
      <Helmet title={l`Sorry your search didn’t match any products.`} />,
      <Image
        className="NoSearchResults-errorImage"
        alt={l`Sorry your search didn’t match any products.`}
        src={'/assets/{brandName}/images/error.svg'}
      />,
      <p className="NoSearchResults-message">{l`Sorry your search didn’t match any products.`}</p>,
      this.continueOption(),
      isFeatureDressipiRecommendationsEnabled ? (
        <DressipiRecommendationsRail />
      ) : (
        <Recommendations />
      ),
    ]
  }

  renderEnhancedNoSearchResult = () => {
    const { l } = this.context
    const {
      brandCode,
      queryParams: { q: searchedTerm },
      isFeatureDressipiRecommendationsEnabled,
    } = this.props
    const NO_SEARCH_RESULT_ESPOT =
      espotsDesktop.search_results.NO_SEARCH_RESULT_ESPOT
    const helmet = getEnhancedNoSearchHelmetTitle(brandCode)
    const header = getEnhancedNoSearchHeader(l, brandCode, searchedTerm)
    const searchLabelToShow = getEnhancedNoSearchSearchLabel(brandCode)
    const paragraphText = getEnhancedNoSearchParagraphText(brandCode)
    const recommendationsHeader = getEnhancedNoSearchRecommendationsHeader(
      brandCode
    )
    const inputPlaceholder = getEnhancedNoSearchInputPlaceholder(brandCode)

    return (
      <div>
        <Helmet title={l(helmet)} />
        <h1 className="NoSearchResults-title">{l(header)}</h1>
        {paragraphText && (
          <p className="NoSearchResults-subtitle">{l(paragraphText)}</p>
        )}

        <SearchInput placeholder={inputPlaceholder} label={searchLabelToShow} />

        <Espot identifier={NO_SEARCH_RESULT_ESPOT} isResponsive />

        {isFeatureDressipiRecommendationsEnabled ? (
          <DressipiRecommendationsRail
            setPredecessorPage={setPredecessorPage}
            headerText={recommendationsHeader}
          />
        ) : (
          <Recommendations
            setPredecessorPage={setPredecessorPage}
            headerText={recommendationsHeader}
          />
        )}
      </div>
    )
  }

  handleRenderNoSearchResult = () => {
    const {
      isFeatureEnhancedNoSearchResultEnabled,
      isLocationQueryObject,
    } = this.props
    const hasQueryObject = isLocationQueryObject && isLocationQueryObject.q
    if (isFeatureEnhancedNoSearchResultEnabled && hasQueryObject)
      return this.renderEnhancedNoSearchResult()

    if (!isFeatureEnhancedNoSearchResultEnabled && hasQueryObject)
      return this.renderNoSearchResult()

    return this.renderNoFilteredResults()
  }

  renderNoFilteredResults = () => {
    const { l } = this.context
    const redirectToHome = () => {
      window.location = '/'
    }
    return (
      <div>
        <div className="NoSearchResults-messageContainer">
          <p className="NoSearchResults-message">{l`There are no products matching your current search criteria.`}</p>
          <p className="NoSearchResults-message">{l`Try clearing some filters to view more results`}</p>
        </div>
        <Button
          className="NoSearchResults-continueShoppingButton"
          clickHandler={redirectToHome}
        >
          {l`Continue shopping`}
        </Button>
      </div>
    )
  }

  render() {
    const { isFiltered } = this.props
    const classNames = classnames('NoSearchResults', {
      'NoSearchResults--isFiltered': isFiltered,
    })
    return (
      <div className={classNames}>
        {this.handleRenderNoSearchResult(isFiltered)}
      </div>
    )
  }
}

export default NoSearchResults
