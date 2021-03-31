import PropTypes from 'prop-types'
import React, { Component } from 'react'
import * as actions from '../../../actions/components/sortSelectorActions'
import { connect } from 'react-redux'
import Select from '../../../components/common/FormComponents/Select/Select'
import QubitReact from 'qubit-react/wrapper'

@connect(
  (state) => ({
    sortOptions: state.products.sortOptions,
    currentSortOption: state.sorting.currentSortOption,
  }),
  { ...actions }
)
class SortSelector extends Component {
  static propTypes = {
    sortOptions: PropTypes.array,
    selectSortOption: PropTypes.func,
    updateSortOption: PropTypes.func,
    currentSortOption: PropTypes.string,
    className: PropTypes.string,
    totalProducts: PropTypes.number,
  }

  static defaultProps = {
    sortOptions: [],
    currentSortOption: 'Relevance',
    className: '',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.props.updateSortOption()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { sortOptions, updateSortOption } = this.props
    if (nextProps.sortOptions !== sortOptions) updateSortOption()
  }

  onSelectChange = (e) => {
    const { selectSortOption } = this.props
    const {
      target: { value },
    } = e

    selectSortOption(value)
  }

  render() {
    const {
      currentSortOption,
      sortOptions,
      className,
      totalProducts,
    } = this.props
    const { l } = this.context
    // Default sorting is by relevance
    const value = currentSortOption || 'Relevance'
    const disabled = totalProducts === 0
    if (!sortOptions.length) return null

    return (
      <QubitReact id="EXP-373-hide-ratings">
        <Select
          className={`SortSelector Select--sort ${className || ''}`}
          onChange={this.onSelectChange}
          options={sortOptions}
          name="sortSelector"
          value={value}
          label={l`Sort product list by`}
          hideLabel
          isDisabled={disabled}
        />
      </QubitReact>
    )
  }
}

export default SortSelector
