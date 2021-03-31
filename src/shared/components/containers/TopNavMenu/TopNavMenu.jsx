import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import * as topNavMenuActions from '../../../actions/components/TopNavMenuActions'
import * as navigationActions from '../../../actions/common/navigationActions'
import * as authActions from '../../../actions/common/authActions'
import ListItemLink from '../../../components/common/ListItemLink/ListItemLink'
import Categories from '../../../components/common/Categories/Categories'
import SandBox from '../../../components/containers/SandBox/SandBox'
import TopSection from './TopSection'
import cmsConsts from '../../../constants/cmsConsts'
import espots from '../../../constants/espotsMobile'
import KEYS from '../../../constants/keyboardKeys'
import navigationConsts from '../../../../shared/constants/navigation'
import { analyticsGlobalNavClickEvent } from '../../../analytics/tracking/site-interactions'
import { isFeatureDeferCmsContentEnabled } from '../../../selectors/featureSelectors'

@connect(
  (state) => ({
    topNavMenuOpen: state.topNavMenu.open,
    authentication: state.auth.authentication,
    categoryHistory: state.navigation.categoryHistory,
    mustScrollToTop: state.topNavMenu.scrollToTop,
    isFeatureDeferCmsContentEnabled: isFeatureDeferCmsContentEnabled(state),
  }),
  { ...topNavMenuActions, ...authActions, ...navigationActions }
)
class TopNavMenu extends Component {
  static propTypes = {
    mustScrollToTop: PropTypes.bool,
    topNavMenuOpen: PropTypes.bool,
    toggleTopNavMenu: PropTypes.func,
    authentication: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    categoryHistory: PropTypes.array,
    popCategoryHistory: PropTypes.func,
    toggleScrollToTop: PropTypes.func,
    closeTopNavMenu: PropTypes.func,
    isFeatureDeferCmsContentEnabled: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
  }

  componentDidUpdate() {
    const { mustScrollToTop, toggleScrollToTop } = this.props
    if (mustScrollToTop) {
      this.scrollToTop()
      toggleScrollToTop()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
  }

  onRef = (element) => {
    if (element) {
      this.element = element
    }
  }

  onKeydown = (event) => {
    if (event.keyCode === KEYS.ESCAPE) {
      this.props.closeTopNavMenu()
    }
  }

  onHomeClick = () => {
    const { toggleTopNavMenu } = this.props
    browserHistory.push('/')
    toggleTopNavMenu()
    analyticsGlobalNavClickEvent('home')
  }

  popCategoryHistory = (e) => {
    const { popCategoryHistory } = this.props
    e.preventDefault()
    popCategoryHistory()
  }

  logout = () => {
    const { toggleTopNavMenu } = this.props
    toggleTopNavMenu()
    analyticsGlobalNavClickEvent('logout')
  }

  scrollToTop = () => {
    document.getElementsByClassName(
      'TopNavMenu-parentListBlock'
    )[0].scrollTop = 0
  }

  render() {
    const {
      authentication,
      categoryHistory,
      topNavMenuOpen,
      isFeatureDeferCmsContentEnabled,
    } = this.props
    const { l } = this.context
    const currentCat = categoryHistory[categoryHistory.length - 1]
    const currentCategoryName = currentCat ? currentCat.label : ''
    const linkToPreviousCategoryClass = currentCat
      ? 'ListItemLink ListItemLink-backLabel is-active is-centered'
      : 'ListItemLink'

    return (
      <div
        className={`TopNavMenu${topNavMenuOpen ? ' is-open' : ''} hideinapp`}
        tabIndex="0"
        ref={this.onRef}
      >
        <div
          key={`top-nav-${authentication || 'default'}`}
          className="TopNavMenu-parentListBlock"
        >
          <TopSection />
          <div className="TopNavMenu-shopByCategory">
            <div className="TopNavMenu-groupHeader">
              {l(navigationConsts.SHOP_BY_CATEGORY_GROUP_LABEL)}
            </div>
            <button
              className="TopNavMenu-homeButton"
              onClick={this.onHomeClick}
            >
              <ListItemLink className="ListItemLink ListItemLink-homeLink is-active">
                <span className="TopNavMenu-home" />
                {l`Home`}
              </ListItemLink>
            </button>
            {currentCategoryName ? (
              <button
                className="TopNavMenu-popCategoryButton"
                onClick={this.popCategoryHistory}
              >
                <ListItemLink className={linkToPreviousCategoryClass}>
                  <span className="TopNavMenu-arrowBack" />
                  <a>{currentCategoryName}</a>
                </ListItemLink>
              </button>
            ) : (
              ''
            )}
            <Categories
              type={navigationConsts.PRODUCT_CATEGORIES_GROUP_TYPE}
              currentCatId={currentCat && currentCat.categoryId}
            />
          </div>

          <div className="TopNavMenu-userDetails">
            <div className="TopNavMenu-groupHeader">
              {l(navigationConsts.YOUR_DETAILS_GROUP_LABEL)}
            </div>
            <Categories type={navigationConsts.USER_DETAILS_GROUP_TYPE} />
          </div>

          <div className="TopNavMenu-helpAndInfo">
            <div className="TopNavMenu-groupHeader">
              {l(navigationConsts.HELP_AND_INFORMATION_GROUP_LABEL)}
            </div>
            <Categories type={navigationConsts.HELP_AND_INFO_GROUP_TYPE} />
          </div>
          <div className="TopNavMenu-socialLinks">
            <div className="TopNavMenu-groupHeader">{l`Follow Us`}</div>
            <SandBox
              cmsPageName={espots.navMenu[0]}
              shouldGetContentOnFirstLoad
              isInPageContent
              contentType={cmsConsts.ESPOT_CONTENT_TYPE}
              lazyLoad={isFeatureDeferCmsContentEnabled}
            />
          </div>
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className="TopNavMenu-close"
            onClick={this.props.toggleTopNavMenu}
          >
            {l`Close menu`}
          </div>
        </div>
      </div>
    )
  }
}

export default TopNavMenu
