import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Category from './Category'
import { isDesktop } from '../../../selectors/viewportSelectors'
import {
  getMegaNavSelectedCategory,
  getMegaNavCategoriesFilteredColumns,
} from '../../../selectors/navigationSelectors'
import {
  getMegaNav,
  setMegaNavSelectedCategory,
  setMegaNavHeight,
} from '../../../actions/common/navigationActions'
import { isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled } from '../../../../shared/selectors/featureSelectors'
import { touchDetection } from '../../../lib/viewHelper'

const mapStateToProps = (state) => ({
  apiEnvironment: state.debug.environment,
  megaNav: state.navigation.megaNav,
  isDesktop: isDesktop(state),
  megaNavSelectedCategory: getMegaNavSelectedCategory(state),
  megaNavCategories: getMegaNavCategoriesFilteredColumns(state),
  isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled: isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled(
    state
  ),
})

const mapDispatchToProps = {
  getMegaNav,
  setMegaNavSelectedCategory,
  setMegaNavHeight,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MegaNav extends Component {
  constructor(props) {
    super(props)
    this.MegaNavSectionRef = React.createRef()
  }
  static propTypes = {
    megaNavCategories: PropTypes.array.isRequired,
    className: PropTypes.string,
    apiEnvironment: PropTypes.string,
    getMegaNav: PropTypes.func,
    setMegaNavSelectedCategory: PropTypes.func.isRequired,
    megaNavSelectedCategory: PropTypes.string.isRequired,
    setMegaNavHeight: PropTypes.func.isRequired,
  }
  static defaultProps = {
    className: '',
    apiEnvironment: 'prod',
    // Defaulting to true so that we fall back to the current bahviour (MegaNav top level links do not use the redirectionUrl)
    isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled: true,
  }
  state = {
    touchEnabled: touchDetection(),
  }

  componentDidMount() {
    const { megaNavCategories, getMegaNav, setMegaNavHeight } = this.props
    setMegaNavHeight(this.MegaNavSectionRef.current.clientHeight)
    if (megaNavCategories.length === 0) getMegaNav()
  }

  componentDidUpdate() {
    this.props.setMegaNavHeight(this.MegaNavSectionRef.current.clientHeight)
  }

  isOpen = (category) =>
    category.categoryId === this.props.megaNavSelectedCategory

  unselectCategory = () => {
    this.props.setMegaNavSelectedCategory('')
  }

  selectCategory = ({ categoryId, categoryUrl }) => {
    const { megaNavSelectedCategory, setMegaNavSelectedCategory } = this.props
    if (categoryId !== megaNavSelectedCategory)
      setMegaNavSelectedCategory(categoryId)

    if (categoryUrl && categoryId === megaNavSelectedCategory) {
      browserHistory.push(categoryUrl)
      this.unselectCategory()
    }
  }

  render() {
    const {
      megaNavCategories,
      className,
      apiEnvironment,
      isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled,
      megaNavSelectedCategory,
    } = this.props

    return (
      <div
        className={`MegaNav ${className || ''}`}
        onMouseLeave={this.unselectCategory}
        ref={this.MegaNavSectionRef}
      >
        <ul className="MegaNav-categories">
          {megaNavCategories.map((category) => (
            <Category
              key={category.categoryId}
              category={category}
              touchEnabled={this.state.touchEnabled}
              apiEnvironment={apiEnvironment}
              megaNavSelectedCategory={megaNavSelectedCategory}
              onHoverCategory={this.selectCategory}
              unselectCategory={this.unselectCategory}
              isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled={
                isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled
              }
            />
          ))}
        </ul>
      </div>
    )
  }
}

export default MegaNav
