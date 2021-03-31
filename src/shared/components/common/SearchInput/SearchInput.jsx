import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Image from '../../common/Image/Image'
import Form from '../FormComponents/Form/Form'
import { submitSearch } from '../../../actions/components/search-bar-actions/search-bar-thunks'

@connect(
  () => ({}),
  { submitSearch }
)
class SearchInput extends Component {
  state = {
    searchTerm: '',
  }

  static propTypes = {
    name: PropTypes.string,
    formClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    submitSearch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    name: 'SearchInput',
    formClassName: '',
    inputClassName: '',
    placeholder: 'Search',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  updateSearch = (e) => this.setState({ searchTerm: e.target.value })

  onSubmit = (e) => {
    e.preventDefault()
    if (this.state.searchTerm) this.props.submitSearch(this.state.searchTerm)
  }

  render() {
    const { l } = this.context
    const {
      name,
      formClassName,
      inputClassName,
      placeholder,
      label,
    } = this.props
    const translatedPlaceholder = l(placeholder)

    // The chrome cancel button has been hidden with CSS through a non-standard feature, see below:
    // https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-search-cancel-button
    // .SearchInput-wrapper makes sure cancel and magnifier icons do not overlap each other
    // when the CSS feature is not recognised by the browser
    return (
      <Form
        name={name}
        autoComplete="off"
        onSubmit={this.onSubmit}
        className={`SearchInput-form ${formClassName}`}
      >
        <div className="SearchInput-wrapper">
          {label && (
            <label
              htmlFor={'SearchInput-search'}
              className={'SearchInput-label'}
            >
              {label}
            </label>
          )}
          <input
            name="q"
            autoComplete="off"
            className={`Input-field SearchInput-search ${inputClassName}`}
            placeholder={translatedPlaceholder}
            type="search"
            onChange={this.updateSearch}
            value={this.state.searchTerm}
          />
          <button
            aria-label={l`Search`}
            className="SearchInput-button"
            onClick={this.onSubmit}
            type="submit"
          >
            <Image
              alt={l`Search`}
              src={`/assets/{brandName}/images/search-icon.svg`}
              className="SearchInput-icon"
            />
          </button>
        </div>
      </Form>
    )
  }
}

export default SearchInput
