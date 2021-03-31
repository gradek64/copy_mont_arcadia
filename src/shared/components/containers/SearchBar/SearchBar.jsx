import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Image from '../../common/Image/Image'
import Form from '../../common/FormComponents/Form/Form'
import * as FormActions from '../../../actions/common/formActions'
import * as SearchBarActions from '../../../actions/components/search-bar-actions'
import { isMobile } from '../../../selectors/viewportSelectors'
import keys from '../../../constants/keyboardKeys'

const SEARCH_TERM_INPUT_NAME = 'searchTerm'

@connect(
  (state) => ({
    productsSearchOpen: state.productsSearch.open,
    searchTerm: state.forms.search.fields.searchTerm.value,
    searchTermIsFocused: state.forms.search.fields.searchTerm.isFocused,
    isMobile: isMobile(state),
    featureBigHeader: state.features.status.FEATURE_HEADER_BIG,
    featureResponsive: state.features.status.FEATURE_RESPONSIVE,
    logoVersion: state.config.logoVersion,
  }),
  { ...FormActions, ...SearchBarActions }
)
class SearchBar extends Component {
  static propTypes = {
    productsSearchOpen: PropTypes.bool,
    setFormField: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func,
    submitSearch: PropTypes.func,
    searchTerm: PropTypes.string,
    isDesktop: PropTypes.bool,
    focusedFormField: PropTypes.func.isRequired,
    searchTermIsFocused: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    featureBigHeader: PropTypes.bool.isRequired,
    className: PropTypes.string,
    imageFileName: PropTypes.string,
    featureResponsive: PropTypes.bool,
    searchInputRef: PropTypes.func,
    logoVersion: PropTypes.string,
    trackSearchBarSelected: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: '',
    searchInputRef: () => {},
    imageFileName: 'search-icon.svg',
    isDesktop: false,
    productsSearchOpen: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  setField = ({ target: { value } }) => {
    this.props.setFormField('search', SEARCH_TERM_INPUT_NAME, value)
  }

  // Activates blur only after transition animation has finished to avoid
  // glitches. There is also a case when the search button becomes unclickable
  // because the blur event happen before the onclick event. This delay
  // resolves that also.
  touchedField = () => {
    const { focusedFormField, touchedFormField } = this.props

    setTimeout(() => {
      focusedFormField('search', SEARCH_TERM_INPUT_NAME, false)
      touchedFormField('search', SEARCH_TERM_INPUT_NAME)
    }, 500)
  }

  onFieldFocus = () => {
    this.props.focusedFormField('search', SEARCH_TERM_INPUT_NAME, true)
  }

  trackClickWhenEmptySearchTerm = () => {
    if (!this.searchInput.value) {
      this.props.trackSearchBarSelected()
    }
  }

  suppressSubmitWhenEmptySearchTerm = (e) => {
    if (e.keyCode === keys.ENTER) {
      if (!this.searchInput.value) {
        e.preventDefault()
      }
    }
  }

  onSubmit = (e) => {
    const { searchInput } = this
    const { searchTerm, submitSearch, isDesktop } = this.props

    e.preventDefault()

    if (searchInput) {
      if (searchInput.value) {
        submitSearch(searchTerm)
        searchInput.blur()
      } else if (isDesktop) {
        searchInput.focus()
      }
    }
  }

  componentDidUpdate() {
    const { isDesktop, productsSearchOpen } = this.props
    const searchInput = document.getElementById('searchTermInput')

    // The condition on isDesktop is necessary to avoid the unfocus of the search field for every character typed.
    // Note that in case of desktop search bar productsSearchOpen is always false since it does not apply.
    if (!productsSearchOpen && !isDesktop) searchInput.blur()
  }

  render() {
    const {
      className,
      featureBigHeader,
      featureResponsive,
      imageFileName,
      isDesktop,
      productsSearchOpen,
      searchTerm,
      searchTermIsFocused,
      isMobile,
      searchInputRef,
      logoVersion,
      trackSearchBarSelected,
    } = this.props
    const { l } = this.context

    const productsSearchBarClassState = productsSearchOpen
      ? 'SearchBar-open'
      : ''
    const headerBigClass =
      featureBigHeader && featureResponsive ? 'SearchBar--big' : ''
    const productsSearchBarClass = `SearchBar ${className} ${headerBigClass} ${productsSearchBarClassState}`
    const formClass = `SearchBar-form${
      searchTermIsFocused ? ' is-focused' : ''
    }`
    const placeholder =
      featureBigHeader && isMobile ? l`Search for a product...` : l`Search`

    return (
      <div className={productsSearchBarClass}>
        <Form
          onSubmit={this.onSubmit}
          className={formClass}
          onFocus={this.onFieldFocus}
          onBlur={this.touchedField}
        >
          <div
            className={`SearchBar-iconParent${
              searchTermIsFocused ? ' is-focused' : ''
            }`}
          >
            <button
              aria-label={l`Search`}
              className="SearchBar-button"
              onClick={this.trackClickWhenEmptySearchTerm}
            >
              <Image
                alt={l`Search`}
                src={`/assets/{brandName}/images/${imageFileName}?version=${logoVersion}`}
                className="SearchBar-icon"
              />
            </button>
          </div>
          <label
            htmlFor="searchTermInput"
            className="SearchBar-label"
          >{l`Search for a product...`}</label>
          <input
            className="SearchBar-queryInput"
            id="searchTermInput"
            name={SEARCH_TERM_INPUT_NAME}
            onKeyDown={this.suppressSubmitWhenEmptySearchTerm}
            onClick={trackSearchBarSelected}
            onChange={this.setField}
            placeholder={placeholder}
            ref={(input) => {
              this.searchInput = input
              searchInputRef(input)
            }}
            type="search"
            value={searchTerm}
            autoComplete="off"
          />
          {isDesktop ? (
            <button className="SearchBar-closeIconParent">
              <Image
                className={`SearchBar-closeIcon${
                  searchTermIsFocused ? '' : 'Hidden'
                }`}
                src="/assets/topshop/images/search-close.png"
              />
            </button>
          ) : null}
        </Form>
      </div>
    )
  }
}

export default SearchBar
