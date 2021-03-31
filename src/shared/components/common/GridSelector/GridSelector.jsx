import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { times } from 'ramda'
import * as actions from '../../../actions/components/GridActions'

@connect(
  ({ grid, viewport }) => ({
    columnOptions: grid.options[viewport.media] || grid.options.default,
    columns: grid.columns,
  }),
  actions
)
class GridSelector extends Component {
  static propTypes = {
    columns: PropTypes.number,
    columnOptions: PropTypes.array.isRequired,
    setGridLayout: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  getGridSelectorButton = (columns) => {
    const { l } = this.context

    return (
      <div
        key={columns}
        className={`GridSelector-buttonContainer ${
          this.props.columns === columns ? 'is-active' : ''
        }`}
      >
        <button
          className="GridSelector-button"
          aria-pressed={this.props.columns === columns}
          onClick={() => this.props.setGridLayout(columns)}
          aria-label={l`Display product list items in ${columns} Columns`}
        >
          <div className="GridSelector-buttonItemsWrapper">
            {times(
              (i) => (
                <span
                  key={`col-${i}`}
                  className={`GridSelector-buttonItem GridSelector-buttonItem${columns}`}
                />
              ),
              columns * columns
            )}
          </div>
        </button>
      </div>
    )
  }

  render() {
    const { className, columnOptions } = this.props

    return (
      <div className={`GridSelector ${className || ''}`}>
        {columnOptions.map(this.getGridSelectorButton)}
      </div>
    )
  }
}

export default GridSelector
