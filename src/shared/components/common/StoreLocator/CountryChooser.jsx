import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { path } from 'ramda'

import Select from '../FormComponents/Select/Select'
import { selectCountry } from '../../../actions/components/StoreLocatorActions'
import { isFeatureYextEnabled } from '../../../../shared/selectors/featureSelectors'
import {
  getSelectedCountry,
  createOptions,
} from '../../../../shared/selectors/storeLocatorSelectors'
import { isMobile } from '../../../../shared/selectors/viewportSelectors'

@connect(
  (state) => ({
    isMobile: isMobile(state),
    selectedCountry: getSelectedCountry(state),
    isFeatureYextEnabled: isFeatureYextEnabled(state),
    createOptions: createOptions(state),
  }),
  { selectCountry }
)
class CountryChooser extends Component {
  static propTypes = {
    selectCountry: PropTypes.func.isRequired,
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    name: PropTypes.string,
    selectedCountry: PropTypes.string,
    isLandingPage: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    countries: [],
    name: 'CountrySelect',
  }

  onCountryChange = (event) => {
    const { selectCountry, selectedCountry } = this.props
    const value = path(['target', 'value'], event)
    if (selectedCountry !== value) {
      selectCountry(value)
    }
  }

  render() {
    const { l } = this.context
    const label = l`Choose country`
    const {
      className,
      isMobile,
      name,
      selectedCountry = label,
      isLandingPage,
      isFeatureYextEnabled,
      createOptions,
    } = this.props
    const yextCheck = isFeatureYextEnabled ? '' : 'Select--link'
    return (
      <Select
        id={name}
        className={`CountryChooser ${isMobile ? yextCheck : ''} ${className}`}
        name={name}
        options={createOptions}
        onChange={this.onCountryChange}
        label={isLandingPage ? l`Store Locator` : l`I'm looking for a store in`}
        hideLabel={isLandingPage}
        value={selectedCountry}
      />
    )
  }
}

export default CountryChooser
