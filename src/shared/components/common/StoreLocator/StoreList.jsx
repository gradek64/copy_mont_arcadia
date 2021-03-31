import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Store from '../StoreLocator/Store'
import StoreLocatorFilters from '../StoreLocator/StoreLocatorFilters'
import * as StoreLocatorActions from '../../../actions/components/StoreLocatorActions'
import { connect } from 'react-redux'
import animate from 'amator'

@connect(
  (state) => ({
    stores: state.storeLocator.stores,
    brandName: state.config.brandName,
    selectedStoreIndex: state.storeLocator.selectedStoreIndex,
  }),
  { ...StoreLocatorActions }
)
class StoreList extends Component {
  static propTypes = {
    deselectStore: PropTypes.func,
    fetchStores: PropTypes.func,
    hasFilters: PropTypes.bool,
    name: PropTypes.string,
    selectStore: PropTypes.func,
    selectDeliveryStore: PropTypes.func,
    selectedStoreIndex: PropTypes.number,
    storeType: PropTypes.string,
    stores: PropTypes.array,
    brandName: PropTypes.string,
    selectCFSIStore: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    hasFilters: false,
    selectDeliveryStore: () => {},
    selectCFSIStore: () => {},
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedStoreIndex !== this.props.selectedStoreIndex &&
      this.props.selectedStoreIndex !== undefined
    ) {
      this.timeout = setTimeout(this.scrollToSelectedStore, 300)
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout)
  }

  scrollToSelectedStore = () => {
    if (!this.selectedStore) return
    const offsetTop =
      this.selectedStore.getClientRects()[0].top -
      this.resultsContainer.getClientRects()[0].top
    const scrollTop = this.resultsContainer.scrollTop + offsetTop
    animate(
      this.resultsContainer,
      {
        scrollTop,
      },
      {
        duration: 300,
      }
    )
  }

  render() {
    const {
      name,
      fetchStores,
      stores,
      selectedStoreIndex,
      selectStore,
      deselectStore,
      hasFilters,
      selectDeliveryStore,
      selectCFSIStore,
      storeType,
      brandName,
    } = this.props
    return (
      <div className={`${name}-listContainer`}>
        {hasFilters && (
          <div className={`${name}-filters`}>
            <StoreLocatorFilters onApply={fetchStores} applyOnChange />
          </div>
        )}
        <div
          className={`${name}-overflowContainer`}
          ref={(element) => {
            this.resultsContainer = element
          }}
        >
          <div className={`${name}-storeList`}>
            {stores.map((store, index) => {
              const selected = selectedStoreIndex === index
              return (
                <Store
                  parentElementRef={(element) => {
                    if (selected) {
                      this.selectedStore = element
                    }
                  }}
                  storeLocatorType={storeType}
                  key={store.storeId}
                  storeDetails={store}
                  onHeaderClick={
                    selected ? deselectStore : () => selectStore(index)
                  }
                  selected={selected}
                  onSelectClick={() => selectDeliveryStore(store)}
                  onCFSIClick={() => selectCFSIStore(store)}
                  brandName={brandName}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default StoreList
