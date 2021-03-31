import testComponentHelper from 'test/unit/helpers/test-component'
import StoreLocatorFilters from './StoreLocatorFilters'

describe('<StoreLocatorFilters />', () => {
  const renderComponent = testComponentHelper(
    StoreLocatorFilters.WrappedComponent
  )
  const mockStorefilters = {
    today: {
      applied: true,
      selected: true,
      disabled: false,
    },
    brand: {
      applied: true,
      selected: true,
      disabled: false,
    },
    parcel: {
      applied: true,
      selected: true,
      disabled: false,
    },
    other: {
      applied: true,
      selected: true,
      disabled: false,
    },
  }

  const noSelectedStorefilters = {
    today: {
      applied: true,
      selected: false,
      disabled: false,
    },
    brand: {
      applied: true,
      selected: false,
      disabled: false,
    },
    parcel: {
      applied: true,
      selected: false,
      disabled: false,
    },
    other: {
      applied: true,
      selected: false,
      disabled: false,
    },
  }

  const initialProps = {
    setFilterSelected: jest.fn(),
    applySelectedFilters: jest.fn(),
    onApply: jest.fn(),
    showFiltersError: jest.fn(),
    selectDeliveryLocation: jest.fn(),
    hideFiltersError: jest.fn(),
    filtersErrorDisplayed: false,
    brandName: 'Topshop',
    applyOnChange: true,
    isMobile: true,
    setFilters: jest.fn(),
  }

  beforeEach(() => jest.resetAllMocks())

  describe('@render', () => {
    it('default with CFSI not enabled', () => {
      expect(
        renderComponent({
          ...initialProps,
          filters: mockStorefilters,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('default with CFSI enabled', () => {
      expect(
        renderComponent({
          ...initialProps,
          filters: mockStorefilters,
          isCFSIEspotEnabled: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('check filter length if cfsi is false', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        filters: mockStorefilters,
      })
      expect(wrapper.find('.StoreLocatorFilters-listItem').length).toBe(3)
    })

    it('check filter length if cfsi is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isCFSIEspotEnabled: true,
        filters: mockStorefilters,
      })
      expect(wrapper.find('.StoreLocatorFilters-listItem').length).toBe(4)
    })
  })

  describe('@events', () => {
    it('set today filter to be true', () => {
      const { instance } = renderComponent({
        ...initialProps,
        isCFSIEspotEnabled: true,
        filters: mockStorefilters,
      })
      instance.disableFilters('today', true)
      expect(instance.props.filters.parcel.disabled).toBe(true)
      expect(instance.props.filters.other.disabled).toBe(true)
      expect(instance.props.filters.brand.selected).toBe(true)
    })

    it('set today filter to be false', () => {
      const { instance } = renderComponent({
        ...initialProps,
        isCFSIEspotEnabled: true,
        filters: mockStorefilters,
      })
      instance.disableFilters('today', false)
      expect(instance.props.filters.parcel.disabled).toBe(false)
      expect(instance.props.filters.other.disabled).toBe(false)
      expect(instance.props.filters.brand.selected).toBe(true)
    })

    it('set brand filter to be false', () => {
      const { instance } = renderComponent({
        ...initialProps,
        isCFSIEspotEnabled: true,
        filters: mockStorefilters,
      })
      instance.disableFilters('brand', false)
      expect(instance.props.filters.today.selected).toBe(false)
      expect(instance.props.filters.other.disabled).toBe(false)
      expect(instance.props.filters.brand.disabled).toBe(false)
      expect(instance.props.filters.parcel.disabled).toBe(false)
    })

    it('simulate change event for checkboxes', () => {
      const { wrapper, instance } = renderComponent({
        ...initialProps,
        isCFSIEspotEnabled: true,
        filters: mockStorefilters,
      })

      const event = {
        target: {
          checked: true,
        },
      }

      wrapper
        .find('.StoreLocatorFilters-listItem')
        .first()
        .children()
        .simulate('change', event)
      expect(instance.props.filters.today.selected).toBe(false)
    })
  })

  describe('@isStoreWithParcelCombined', () => {
    const store = {
      features: {
        status: {
          FEATURE_CFS: true,
          FEATURE_PUDO: true,
        },
      },
      checkout: {
        storeWithParcel: false,
        orderSummary: {
          deliveryLocations: [
            { deliveryLocationType: 'HOME' },
            { deliveryLocationType: 'STORE' },
            { deliveryLocationType: 'PARCELSHOP' },
          ],
        },
      },
    }
    const enrichedDeliveryLocations =
      store.checkout.orderSummary.deliveryLocations
    const renderComponentWithCommonProps = ({
      isStoreWithParcelCombined,
      enrichedDeliveryLocations,
    }) =>
      renderComponent({
        ...initialProps,
        isStoreWithParcelCombined,
        isCFSIEspotEnabled: true,
        enrichedDeliveryLocations,
        selectDeliveryLocation: jest.fn(),
        filters: mockStorefilters,
      })
    describe('When isStoreWithParcel is true, collect from store and collect from parcel shop are combined', () => {
      describe('When filter is shop and checked:true', () => {
        it('should only call setFilterSelected', () => {
          const { wrapper, instance } = renderComponentWithCommonProps({
            isStoreWithParcelCombined: true,
            enrichedDeliveryLocations,
          })
          // simulate shop checkbox selected
          wrapper
            .find('.StoreLocatorFilters-listItem')
            .children()
            .at(1)
            .simulate('change', {
              target: {
                checked: true,
              },
            })

          expect(instance.props.setFilterSelected).toHaveBeenCalled()
          expect(instance.props.selectDeliveryLocation).not.toHaveBeenCalled()
        })
      })
      describe('When filter is parcel and checked:true', () => {
        it('should call setFilterSelected and selectDeliveryLocation method', () => {
          const { wrapper, instance } = renderComponentWithCommonProps({
            isStoreWithParcelCombined: true,
            enrichedDeliveryLocations,
          })
          // simulate parcel checkbox selected
          wrapper
            .find('.StoreLocatorFilters-listItem')
            .children()
            .at(2)
            .simulate('change', {
              target: {
                checked: true,
              },
            })

          expect(instance.props.setFilterSelected).toHaveBeenCalled()
          expect(instance.props.selectDeliveryLocation).toHaveBeenCalledWith({
            deliveryLocationType: 'PARCELSHOP',
          })
        })
      })

      describe('When filter is parcel and checked:false', () => {
        it('should call setFilterSelected and selectDeliveryLocation method', () => {
          const { wrapper, instance } = renderComponentWithCommonProps({
            isStoreWithParcelCombined: true,
            enrichedDeliveryLocations,
          })
          // simulate parcel checkbox not selected false
          wrapper
            .find('.StoreLocatorFilters-listItem')
            .children()
            .at(2)
            .simulate('change', {
              target: {
                checked: false,
              },
            })

          expect(instance.props.setFilterSelected).toHaveBeenCalled()
          expect(instance.props.selectDeliveryLocation).toHaveBeenCalledWith({
            deliveryLocationType: 'STORE',
          })
        })
      })

      describe('When filter is parcel and parcelOrShopDeliveryCombined object has no "store" or "parcel" property', () => {
        it('should throw error', () => {
          const deliveryLocationsEmpty = ['empty']
          const { wrapper } = renderComponentWithCommonProps({
            isStoreWithParcelCombined: true,
            enrichedDeliveryLocations: deliveryLocationsEmpty,
          })
          try {
            // simulate parcel checkbox not selected false
            wrapper
              .find('.StoreLocatorFilters-listItem')
              .children()
              .at(2)
              .simulate('change', {
                target: {
                  checked: false,
                },
              })
          } catch (err) {
            expect(err.message).toBe(
              'property parcel does not exist in parcelOrShopDeliveryCombined object'
            )
          }
        })
      })
    })

    describe('When isStoreWithParcel is false, collect from store and collect from parcel shop should not be combined', () => {
      it('should only call (default) setFilterSelected method', () => {
        const { wrapper, instance } = renderComponentWithCommonProps({
          isStoreWithParcelCombined: false,
          enrichedDeliveryLocations,
        })
        // simulate shop checkbox selected
        wrapper
          .find('.StoreLocatorFilters-listItem')
          .children()
          .at(1)
          .simulate('change', {
            target: {
              checked: true,
            },
          })

        expect(instance.props.setFilterSelected).toHaveBeenCalled()
        expect(instance.props.selectDeliveryLocation).not.toHaveBeenCalled()
      })
    })
  })

  describe('@onSubmit', () => {
    let evt

    beforeEach(() => {
      evt = {
        preventDefault: jest.fn(),
      }
    })

    it('should call preventDefault', () => {
      const { instance } = renderComponent({
        ...initialProps,
        filters: mockStorefilters,
      })
      expect(evt.preventDefault).not.toHaveBeenCalled()
      instance.onSubmit(evt)
      expect(evt.preventDefault).toHaveBeenCalledTimes(1)
      expect(instance.props.applySelectedFilters).toHaveBeenCalledTimes(1)
      expect(instance.props.onApply).toHaveBeenCalledTimes(1)
    })

    it('expect filter errors to show if no filters selected', () => {
      const { instance } = renderComponent({
        ...initialProps,
        filters: noSelectedStorefilters,
      })
      expect(evt.preventDefault).not.toHaveBeenCalled()
      instance.onSubmit(evt)
      expect(instance.props.showFiltersError).toHaveBeenCalledTimes(1)
    })
  })
})
