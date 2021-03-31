import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GridSelector from '../../common/GridSelector/GridSelector'
import SortSelector from '../../common/SortSelector/SortSelector'
import { getActiveRefinements } from '../../../../shared/selectors/refinementsSelectors'
import Button from '../../common/Button/Button'
import ProductViews from '../../common/ProductViews/ProductViews'
import * as actions from '../../../actions/components/refinementsActions'
import { isMobile } from '../../../selectors/viewportSelectors'
import { getProductsSearchResultsTotal } from '../../../selectors/productSelectors'

@connect(
  (state) => ({
    totalProducts: getProductsSearchResultsTotal(state),
    activeRefinements: getActiveRefinements(state),
    isMobile: isMobile(state),
  }),
  actions
)
class Filters extends Component {
  static propTypes = {
    toggleRefinements: PropTypes.func.isRequired,
    totalProducts: PropTypes.number,
    isMobile: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    totalProducts: 0,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderNumberOfRefinements() {
    const { activeRefinements } = this.props

    // Strip out the top level refinement (Category)
    const numActiveRefinements = activeRefinements.filter(
      (refinement) => !/_CATEGORY$/.test(refinement.key)
    ).length

    return numActiveRefinements > 0 ? ` (${numActiveRefinements})` : ''
  }

  render() {
    const { toggleRefinements, totalProducts, isMobile } = this.props

    const { l } = this.context
    return (
      <div className="Filters">
        {isMobile ? (
          <div className="Filters-mobile">
            <div className="Filters-row">
              <GridSelector className="Filters-column Filters-gridSelector" />
              <ProductViews className="Filters-column" />
            </div>
            <div className="Filters-row Filters-refinement">
              <SortSelector
                className="Filters-column"
                totalProducts={totalProducts}
              />
              <div className="Filters-column Filters-refineButtonContainer">
                <span className="Filters-totalResults">
                  {totalProducts} {l`results`}
                </span>
                <Button
                  className="Filters-refineButton"
                  clickHandler={() => toggleRefinements(true)}
                >
                  <span className="translate">{l`Filter`}</span>
                  <span className="translate">
                    {this.renderNumberOfRefinements()}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="Filters-responsive">
            <ProductViews className="Filters-column Filters-productViews" />
            <GridSelector className="Filters-column Filters-gridSelector" />
            <SortSelector
              className="Filters-column Filters-sortSelector"
              totalProducts={totalProducts}
            />
            <div className="Filters-column Filters-refineButtonContainer">
              <span className="Filters-totalResults">
                {totalProducts} {l`results`}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Filters
