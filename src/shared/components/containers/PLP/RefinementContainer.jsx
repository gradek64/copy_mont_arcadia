import React, { Component } from 'react'
import PropTypes from 'prop-types'
import RefinementList from './Refinements/RefinementList'
import RefinementSummary from './Refinements/RefinementSummary'
import MontyVisualIndicator from '../../common/MontyVisualIndicator/MontyVisualIndicator'

export default class RefinementContainer extends Component {
  constructor(props) {
    super(props)

    this.state = { fixed: false }
  }

  static propTypes = {
    hasNoSearchResult: PropTypes.bool,
    refinements: PropTypes.object,
    stickyHeader: PropTypes.bool,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  calculateFixed = () => {
    const el = this.element
    if (el && 'parentNode' in el && window) {
      // as the filter container gets fixed we get the height
      // from the component and offset top from the parent
      const offsetTop = el.parentNode.offsetTop

      // get PlpContainer
      const plpContainerClientHeight =
        el.parentNode &&
        el.parentNode.nextSibling &&
        el.parentNode.nextSibling.clientHeight

      // calculation depends on whether screen is taller than component or not
      const fixed =
        el.clientHeight >= plpContainerClientHeight
          ? false
          : window.pageYOffset > offsetTop

      this.setState({ fixed })
    }
  }

  onAccordionToggle = () => {
    this.calculateFixed()
  }

  onScroll = () => {
    this.calculateFixed()
  }

  render() {
    const { hasNoSearchResult, refinements, stickyHeader } = this.props

    return (
      <div
        className={`RefinementContainer ${
          stickyHeader ? ' is-stickyHeader' : ''
        }`}
      >
        <div
          className={`${
            this.state.fixed
              ? 'RefinementContainer-refinementListContainer--fixed'
              : 'RefinementContainer-refinementListContainer'
          }`}
          ref={(node) => {
            this.element = node
          }}
        >
          <RefinementSummary />

          <RefinementList
            searchResults={hasNoSearchResult}
            onAccordionToggle={this.onAccordionToggle}
          />
          {refinements && <MontyVisualIndicator />}
        </div>
      </div>
    )
  }
}
