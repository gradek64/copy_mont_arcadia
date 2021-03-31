import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { values, equals } from 'ramda'
import {
  applySelectedFilters,
  setFilterSelected,
  showFiltersError,
  hideFiltersError,
  setFilters,
} from '../../../actions/components/StoreLocatorActions'
import Checkbox from '../../common/FormComponents/Checkbox/Checkbox'
import Button from '../../common/Button/Button'
import getFilterLabel from './get-filter-label'
import { getSelectedFilters } from '../../../lib/store-locator-utilities'
import { isCFSIEspotEnabled } from '../../../../shared/selectors/espotSelectors'
import Form from '../FormComponents/Form/Form'
import { getStoreLocatorFilters } from '../../../selectors/storeLocatorSelectors'
import {
  isStoreWithParcel,
  getEnrichedDeliveryLocations,
} from '../../../selectors/checkoutSelectors'
import { selectDeliveryLocation } from '../../../actions/common/checkoutActions'

@connect(
  (state) => ({
    filters: getStoreLocatorFilters(state),
    isStoreWithParcelCombined: isStoreWithParcel(state),
    enrichedDeliveryLocations: getEnrichedDeliveryLocations(state),
    filtersErrorDisplayed: state.storeLocator.filtersErrorDisplayed,
    brandName: state.config.brandName,
    isMobile: state.viewport.media === 'mobile',
    isCFSIEspotEnabled: isCFSIEspotEnabled(state),
  }),
  {
    applySelectedFilters,
    setFilterSelected,
    selectDeliveryLocation,
    showFiltersError,
    hideFiltersError,
    setFilters,
  }
)
class StoreLocatorFilters extends Component {
  static propTypes = {
    isCFSIEspotEnabled: PropTypes.bool,
    isMobile: PropTypes.bool,
    brandName: PropTypes.string,
    filters: PropTypes.object,
    enrichedDeliveryLocations: PropTypes.array,
    isStoreWithParcelCombined: PropTypes.bool,
    filtersErrorDisplayed: PropTypes.bool,
    applyOnChange: PropTypes.bool,
    applySelectedFilters: PropTypes.func,
    selectDeliveryLocation: PropTypes.func.isRequired,
    setFilterSelected: PropTypes.func,
    onApply: PropTypes.func,
    showFiltersError: PropTypes.func,
    hideFiltersError: PropTypes.func,
    setFilters: PropTypes.func,
  }

  static defaultProps = {
    enrichedDeliveryLocations: [],
    isStoreWithParcelCombined: false,
  }

  componentDidUpdate(prevProps) {
    const { filters, applyOnChange } = this.props
    if (
      !equals(
        getSelectedFilters(prevProps.filters),
        getSelectedFilters(filters)
      ) &&
      applyOnChange
    )
      this.onSubmit()
  }

  onSubmit = (event) => {
    if (event) event.preventDefault()
    const {
      filters,
      applySelectedFilters,
      onApply,
      showFiltersError,
    } = this.props
    const hasSelectedFilters = values(filters).some(({ selected }) => selected)
    if (hasSelectedFilters) {
      applySelectedFilters()
      onApply()
    } else {
      showFiltersError()
    }
  }

  onFilterChange = (index, selected) => {
    const {
      hideFiltersError,
      setFilterSelected,
      isCFSIEspotEnabled,
      isStoreWithParcelCombined,
      enrichedDeliveryLocations,
      selectDeliveryLocation,
    } = this.props
    hideFiltersError()
    if (isCFSIEspotEnabled) {
      this.disableFilters(index, selected)
    }
    // ADP-3561 when store filters are combined set orderSummary with PARCELSHOP or SHOP
    if (isStoreWithParcelCombined) {
      const parcelOrShopDeliveryCombined = enrichedDeliveryLocations.reduce(
        (deliveryLocationType, deliveryLocations) => {
          switch (deliveryLocations.deliveryLocationType) {
            case 'STORE':
              deliveryLocationType.store = deliveryLocations
              break
            case 'PARCELSHOP':
              deliveryLocationType.parcel = deliveryLocations
              break
            default:
          }
          return deliveryLocationType
        },
        {}
      )

      if (index === 'parcel') {
        if (
          !(
            parcelOrShopDeliveryCombined.parcel &&
            parcelOrShopDeliveryCombined.store
          )
        ) {
          throw new Error(
            `property ${index} does not exist in parcelOrShopDeliveryCombined object`
          )
        }
        if (selected) {
          selectDeliveryLocation(parcelOrShopDeliveryCombined.parcel)
        } else {
          selectDeliveryLocation(parcelOrShopDeliveryCombined.store)
        }
      }
    }
    setFilterSelected(index, selected)
  }

  disableFilters = (filterClicked, selected) => {
    const { filters, setFilters } = this.props
    Object.keys(filters).forEach((filter) => {
      if (filterClicked === 'today') {
        const isFilterSelected = selected
        if ((filter === 'parcel' || filter === 'other') && isFilterSelected) {
          filters[filter].disabled = true
          filters[filter].selected = false
          filters.brand.selected = true
        } else {
          filters[filter].disabled = false
        }
      } else if (filterClicked === 'brand') {
        if (!selected) {
          filters.today.selected = false
          filters[filter].disabled = false
        }
      }
    })
    setFilters(filters)
  }

  render() {
    const { filters, brandName, isMobile, isCFSIEspotEnabled } = this.props
    return (
      <Form className="StoreLocatorFilters" onSubmit={this.onSubmit}>
        <h3 className="StoreLocatorFilters-header">Filter</h3>
        <ul className="StoreLocatorFilters-list">
          {Object.keys(filters).map((filter) => {
            const label = getFilterLabel(filter, brandName, isCFSIEspotEnabled)
            return label ? (
              <li key={filter} className="StoreLocatorFilters-listItem">
                <Checkbox
                  className={'StoreLocatorFilters-checkbox'}
                  checked={{ value: filters[filter].selected }}
                  isDisabled={filters[filter].disabled}
                  name={label}
                  onChange={(event) =>
                    this.onFilterChange(filter, event.target.checked)
                  }
                  reverse={isMobile}
                >
                  {label}
                </Checkbox>
              </li>
            ) : null
          })}
        </ul>
        {this.props.filtersErrorDisplayed && (
          <p className="StoreLocatorFilters-error">
            You have to select at least one filter
          </p>
        )}
        <Button className="StoreLocatorFilters-applyButton" type="submit">
          Apply
        </Button>
      </Form>
    )
  }
}

export default StoreLocatorFilters
