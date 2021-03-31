import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import StoreLocator from './StoreLocator'

jest.mock('../../common/UserLocator/UserLocator', () => 'UserLocator')

const mockStorefilters = {
  brand: {
    applied: true,
    selected: true,
  },
  parcel: {
    selected: true,
    applied: true,
  },
  other: {
    applied: true,
    selected: true,
  },
}

const mockSelectedStoreFilters = {
  brand: {
    applied: false,
    selected: false,
  },
  parcel: {
    selected: true,
    applied: true,
  },
  other: {
    applied: true,
    selected: true,
  },
}

const dates = [
  {
    availableUntil: '2017-03-21 20:30:00',
    collectFrom: '2017-03-22',
  },
  {
    availableUntil: '2017-03-22 20:30:00',
    collectFrom: '2017-03-23',
  },
  {
    availableUntil: '2017-03-23 20:30:00',
    collectFrom: '2017-03-24',
  },
]

const openingHours = {
  monday: '09:00-20:00',
  tuesday: '09:00-21:00',
  wednesday: '09:00-21:00',
  thursday: '09:00-21:00',
  friday: '09:00-21:00',
  saturday: '09:00-21:00',
  sunday: '12:00-18:00',
}

const mockStoreList = [
  {
    storeId: 'TS0032',
    brandId: 12556,
    name: 'Strand',
    distance: '0.16',
    latitude: 51.509599,
    longitude: -0.123069,
    address: {
      line1: '60/64 The Strand',
      line2: '',
      city: 'Strand',
      postcode: 'WC2N 5LR',
    },
    openingHours,
    telephoneNumber: '020 7839 4144',
    collectFromStore: {
      standard: {
        dates,
        price: 0,
      },
      express: {
        dates,
        price: 3,
      },
    },
  },
  {
    storeId: 'TS0001',
    brandId: 12556,
    name: 'Oxford Circus',
    distance: '0.51',
    latitude: 51.5157,
    longitude: -0.141396,
    address: {
      line1: '214 Oxford Street',
      line2: 'Oxford Circus',
      city: 'West End',
      postcode: 'W1W 8LG',
    },
    openingHours,
    telephoneNumber: '03448 487487',
    collectFromStore: {
      standard: {
        dates,
        price: 0,
      },
      express: {
        dates,
        price: 3,
      },
    },
  },
]

describe('<StoreLocator/>', () => {
  jest.useFakeTimers()

  const renderComponent = testComponentHelper(
    StoreLocator.WrappedComponent.WrappedComponent
  )

  const props = {
    brandName: 'topshop',
    filters: mockStorefilters,
    isStoresLoading: false,
    isMobile: true,
    mapExpanded: false,
    location: {
      query: {},
    },
    collapseMap: jest.fn(),
    getStores: jest.fn(),
    selectStore: jest.fn(),
    deselectStore: jest.fn(),
    resizeMap: jest.fn(),
    clearFilters: jest.fn(),
    resetStoreLocator: jest.fn(),
    setMarkers: jest.fn(),
    closeModal: jest.fn(),
    showModal: jest.fn(),
    selectDeliveryStore: jest.fn(),
    selectDeliveryStoreForQubit: jest.fn(),
    searchStores: jest.fn(),
    storeSearch: jest.fn(),
    stores: [],
    mapCentrePointAndZoom: {
      lat: 2,
      long: 1,
      zoom: 15,
      markers: [[1, 2], [3, 4]],
      iconDomain: 'static.brand.com',
    },
    CFSI: false,
    isFeatureYextEnabled: false,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('in loading state', () => {
      expect(
        renderComponent({
          ...props,
          getStoresLoading: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('on mobile', () => {
      describe('storeLocatorType !== collectFromStore', () => {
        it('and when isHeaderEnabled=true do not display UserLocatorInput on Google Map', () => {
          const { wrapper, getTreeFor } = renderComponent({
            ...props,
            isHeaderEnabled: true,
            stores: mockStoreList,
            location: {
              query: {
                latitude: 42.54135235,
                longitude: 0.23423443,
              },
            },
            storeLocatorType: 'notCollectFromStore',
          })
          expect(
            wrapper.find('.StoreLocator-fullHeightContainer--withEnabledHeader')
              .length
          ).toBe(1)
          expect(
            wrapper.find('.StoreLocator-googleMapContainer').map(getTreeFor)
          ).toMatchSnapshot()
        })
        it('is new headerEnabled', () => {
          expect(
            renderComponent({
              ...props,
              isHeaderEnabled: true,
              storeLocatorType: 'notCollectFromStore',
            }).getTree()
          ).toMatchSnapshot()
        })
        it('random query and empty list of stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                query: {
                  xyz: 'true',
                },
              },
            }).getTree()
          ).toMatchSnapshot()
        })
        it('country query and empty list of stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                query: {
                  country: 'Portugal',
                },
              },
            }).getTree()
          ).toMatchSnapshot()
        })
        it('lat/long query and empty list of stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                query: {
                  latitude: 50.2342,
                  longitude: 4.2234,
                },
              },
            }).getTree()
          ).toMatchSnapshot()
        })
        it('search term and list of stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                query: {
                  latitude: 50.2342,
                  longitude: 4.2234,
                },
              },
              stores: mockStoreList,
            }).getTree()
          ).toMatchSnapshot()
        })
      })

      describe('storeLocatorType === collectFromStore', () => {
        it('do not display UserLocatorInput on Google Map', () => {
          const { wrapper, getTreeFor } = renderComponent({
            ...props,
            stores: mockStoreList,
            location: {
              query: {
                latitude: 42.54135235,
                longitude: 0.23423443,
              },
            },
            filters: mockStorefilters,
            storeLocatorType: 'collectFromStore',
          })
          expect(
            wrapper.find('.StoreLocator-fullHeightContainer--withEnabledHeader')
              .length
          ).toBe(0)
          expect(
            wrapper.find('.StoreLocator-googleMapContainer').map(getTreeFor)
          ).toMatchSnapshot()
        })

        it('no search term', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'collectFromStore',
              location: {
                search: false,
                query: {},
              },
            }).getTree()
          ).toMatchSnapshot()
        })
      })

      describe('storeLocatorType === collectFromStore', () => {
        it('search term and empty list of stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'collectFromStore',
              location: {
                query: {
                  latitude: 50.2342,
                  longitude: 4.2234,
                },
              },
              isFeatureYextEnabled: true,
            }).getTree()
          ).toMatchSnapshot()
        })
        it('search term and list of stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'collectFromStore',
              location: {
                query: {
                  latitude: 50.2342,
                  longitude: 4.2234,
                },
              },
              stores: mockStoreList,
            }).getTree()
          ).toMatchSnapshot()
        })
        it('no search term and empty stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'collectFromStore',
            }).getTree()
          ).toMatchSnapshot()
        })
        it('no search term and list of stores', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockStorefilters,
              storeLocatorType: 'collectFromStore',
              stores: mockStoreList,
            }).getTree()
          ).toMatchSnapshot()
        })
        it('no search term and some filters applied', () => {
          expect(
            renderComponent({
              ...props,
              filters: mockSelectedStoreFilters,
              storeLocatorType: 'collectFromStore',
              stores: mockStoreList,
            }).getTree()
          ).toMatchSnapshot()
        })
      })
    })

    describe('on desktop', () => {
      // @NOTE potentially deletable, desktop uses CollectFromStore component instead
      describe('storeLocatorType !== collectFromStore', () => {
        it('do not display UserLocatorInput on Google Map', () => {
          const { wrapper, getTreeFor } = renderComponent({
            ...props,
            isMobile: false,
            stores: mockStoreList,
            location: {
              query: {
                latitude: 42.54135235,
                longitude: 0.23423443,
              },
            },
            storeLocatorType: 'notCollectFromStore',
          })
          expect(
            wrapper.find('.StoreLocator-fullHeightContainer--withEnabledHeader')
              .length
          ).toBe(0)
          expect(
            wrapper.find('.StoreLocator-googleMapContainer').map(getTreeFor)
          ).toMatchSnapshot()
        })
        it('search and empty store', () => {
          expect(
            renderComponent({
              ...props,
              isMobile: false,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                search: 'someterm',
                query: {},
              },
            }).getTree()
          ).toMatchSnapshot()
        })
        it('without search', () => {
          expect(
            renderComponent({
              ...props,
              isMobile: false,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                search: false,
                query: {},
              },
            }).getTree()
          ).toMatchSnapshot()
        })
        it('search and empty list of stores', () => {
          expect(
            renderComponent({
              ...props,
              isMobile: false,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                search: 'someterm',
                query: {},
              },
            }).getTree()
          ).toMatchSnapshot()
        })
        it('search and list of stores', () => {
          expect(
            renderComponent({
              ...props,
              isMobile: false,
              filters: mockStorefilters,
              storeLocatorType: 'notCollectFromStore',
              location: {
                search: 'someterm',
                query: {},
              },
              stores: mockStoreList,
            }).getTree()
          ).toMatchSnapshot()
        })
      })
    })

    describe('with google map', () => {
      it('when latitude and longitude is valid', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...props,
          stores: mockStoreList,
          location: {
            query: {
              latitude: 0.123,
              longitude: 24.0,
            },
            search: 'somesearch',
          },
        })
        expect(
          wrapper.find('.StoreLocator-fullHeightContainer--withEnabledHeader')
            .length
        ).toBe(0)
        expect(
          getTreeFor(wrapper.find('.StoreLocator-googleMapContainer'))
        ).toMatchSnapshot()
      })
      it('when latitude and longitude is valid with headerEnabled', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...props,
          stores: mockStoreList,
          location: {
            query: {
              latitude: 0.123,
              longitude: 24.0,
            },
            search: 'somesearch',
          },
          isHeaderEnabled: true,
        })
        expect(
          wrapper.find('.StoreLocator-fullHeightContainer--withEnabledHeader')
            .length
        ).toBe(1)
        expect(
          getTreeFor(wrapper.find('.StoreLocator-googleMapContainer'))
        ).toMatchSnapshot()
      })
      it('when latitude and longitude is not valid', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...props,
          stores: mockStoreList,
          location: {
            search: 'somesearch',
            query: {
              latitude: 0,
              longitude: 0,
            },
          },
        })
        expect(
          wrapper.find('.StoreLocator-fullHeightContainer--withEnabledHeader')
            .length
        ).toBe(0)
        expect(
          getTreeFor(wrapper.find('.StoreLocator-googleMapContainer'))
        ).toMatchSnapshot()
      })
    })

    describe('footer', () => {
      it('should not show footer on desktop', () => {
        expect(
          renderComponent({
            ...props,
            isMobile: false,
            mapExpanded: true,
          }).wrapper.find('.StoreLocator-footer').length
        ).toBe(0)
      })
      it('should not display footer when mapExpanded=false and storeLocatorType is not "collectFromStore"', () => {
        const { wrapper, getTreeFor } = renderComponent(props)
        expect(
          getTreeFor(wrapper.find('.StoreLocator-footer'))
        ).toMatchSnapshot()
      })
      it('should show renderFooterMapCollapsed when mapExpanded=false and is collectFromStore', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
        })
        expect(
          getTreeFor(wrapper.find('.StoreLocator-footer'))
        ).toMatchSnapshot()
        expect(wrapper.find('.StoreLocator-footer').length).toBe(1)
      })
      it('should show renderFooterMapExpanded when mapExpanded=true', () => {
        const { wrapper, getTreeFor } = renderComponent({
          ...props,
          mapExpanded: true,
        })
        expect(
          getTreeFor(wrapper.find('.StoreLocator-footer'))
        ).toMatchSnapshot()
        expect(wrapper.find('.StoreLocator-footer').length).toBe(1)
      })
    })

    describe('@lifecycle', () => {
      beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers()
      })
      window.addEventListener = jest.fn()
      window.removeEventListener = jest.fn()

      describe('on componentDidMount', () => {
        it('should add an eventListener on the window object', () => {
          const { instance } = renderComponent(props)
          expect(window.addEventListener).not.toBeCalled()
          instance.componentDidMount()
          expect(window.addEventListener).toHaveBeenCalledTimes(1)
        })
      })
      describe('on componentWillMount', () => {
        it('calls storeSearch() when client side', () => {
          const b = process.browser
          process.browser = true

          expect(
            renderComponent(props).instance.props.storeSearch
          ).toHaveBeenCalledTimes(1)

          process.browser = b
        })
        it('calls setMarker when stores are not empty', () => {
          global.process.browser = true
          expect(
            renderComponent({
              ...props,
              stores: mockStoreList,
            }).instance.props.setMarkers
          ).toHaveBeenCalledTimes(1)
        })
        it('does not calls setMarker stores are empty', () => {
          global.process.browser = true
          expect(
            renderComponent({
              ...props,
              stores: [],
            }).instance.props.setMarkers
          ).toHaveBeenCalledTimes(0)
        })
      })
      describe('on UNSAFE_componentWillReceiveProps', () => {
        it('calls storeSearch() if query has changed', () => {
          const { instance } = renderComponent(props)
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(1)
          instance.UNSAFE_componentWillReceiveProps({
            ...props,
            location: {
              query: {
                latitude: '100',
                longitude: '-100',
                country: 'UK',
                brand: 'mockedBrand',
              },
            },
          })
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(2)
        })
        it('should  call storeSearch() if query does not contain country', () => {
          const { instance } = renderComponent(props)
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(1)
          instance.UNSAFE_componentWillReceiveProps({
            ...props,
            location: {
              query: {
                country: 'Algeria',
              },
            },
          })
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(2)
        })
        it('should not call storeSearch() if query does not contain latitude and longitude or no country', () => {
          const { instance } = renderComponent(props)
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(1)
          instance.UNSAFE_componentWillReceiveProps({
            ...props,
            location: {
              query: {
                xyz: 123,
              },
            },
          })
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(1)
        })
        it('should not call storeSearch() if query has not changed', () => {
          const { instance } = renderComponent(props)
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(1)
          instance.UNSAFE_componentWillReceiveProps(props)
          expect(instance.props.storeSearch).toHaveBeenCalledTimes(1)
        })
        it('calls clearFilters() if the modal has closed', () => {
          const { instance } = renderComponent({ ...props, modalOpen: true })
          expect(instance.props.clearFilters).not.toHaveBeenCalled()
          instance.UNSAFE_componentWillReceiveProps({
            ...props,
            modalOpen: false,
          })
          expect(instance.props.clearFilters).toHaveBeenCalledTimes(1)
        })
        it('not calls clearFilters() if the modal has not just closed', () => {
          const clearFilterProps = {
            ...props,
            modalOpen: true,
          }
          const { instance } = renderComponent(clearFilterProps)
          instance.UNSAFE_componentWillReceiveProps(clearFilterProps)
          expect(instance.props.clearFilters).not.toHaveBeenCalled()
        })
      })
      describe('on componentDidUpdate', () => {
        it('calls setTimeout(resizeMap) with 300ms delay when map expanded', () => {
          const { instance } = renderComponent({ ...props, mapExpanded: true })
          expect(instance.props.resizeMap).not.toHaveBeenCalled()
          instance.componentDidUpdate({ ...props, mapExpanded: false })
          jest.runTimersToTime(300)
          expect(instance.props.resizeMap).toHaveBeenCalledTimes(1)
        })
        it('calls setTimeout(resizeMap) with 300ms delay when map collapsed', () => {
          const { instance } = renderComponent({ ...props, mapExpanded: false })
          expect(instance.props.resizeMap).not.toHaveBeenCalled()
          instance.componentDidUpdate({ ...props, mapExpanded: true })
          jest.runTimersToTime(300)
          expect(instance.props.resizeMap).toHaveBeenCalledTimes(1)
        })
        it('calls setTimeout(scrollToSelectedStore) with 300ms delay when getting new selectedStoreIndex', () => {
          const { instance } = renderComponent({
            ...props,
            selectedStoreIndex: 1,
          })
          instance.scrollToSelectedStore = jest.fn()
          expect(instance.scrollToSelectedStore).not.toHaveBeenCalled()
          instance.componentDidUpdate({ ...props, selectedStoreIndex: 2 })
          jest.runTimersToTime(300)
          expect(instance.scrollToSelectedStore).toHaveBeenCalledTimes(1)
        })
      })
      describe('on componentWillUnmount', () => {
        it('calls resetStoreLocator()', () => {
          const { instance } = renderComponent(props)
          expect(instance.props.resetStoreLocator).not.toBeCalled()
          instance.componentWillUnmount()
          expect(instance.props.resetStoreLocator).toHaveBeenCalledTimes(1)
        })
        it('should have remove the resize eventListener', () => {
          const { instance } = renderComponent(props)
          expect(window.removeEventListener).not.toBeCalled()
          instance.componentWillUnmount()
          expect(window.removeEventListener).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('@events', () => {
      beforeEach(() => jest.resetAllMocks())
      describe('Store onHeaderClick', () => {
        it('should call selectStore if the selectedStoreIndex is not equal to the storeIndex ', () => {
          const selectedStoreIndex = 1
          const { wrapper, instance } = renderComponent({
            ...props,
            stores: mockStoreList,
            selectedStoreIndex,
            location: {
              search: 'somesearch',
              query: {},
            },
          })
          expect(instance.props.selectStore).not.toHaveBeenCalled()
          wrapper
            .find('Connect(Store)')
            .at(selectedStoreIndex - 1)
            .simulate('headerClick')
          expect(instance.props.selectStore).toHaveBeenCalledTimes(1)
          expect(instance.props.selectStore).toHaveBeenLastCalledWith(
            selectedStoreIndex - 1
          )
          expect(instance.props.deselectStore).not.toHaveBeenCalled()
        })
        it('should call deselectStore if the selectedStoreIndex is not equal to the storeIndex', () => {
          const selectedStoreIndex = 1
          const { wrapper, instance } = renderComponent({
            ...props,
            stores: mockStoreList,
            selectedStoreIndex,
            location: {
              search: 'somesearch',
              query: {},
            },
          })
          expect(instance.props.deselectStore).not.toHaveBeenCalled()
          wrapper
            .find('Connect(Store)')
            .at(selectedStoreIndex)
            .simulate('headerClick')
          expect(instance.props.deselectStore).toHaveBeenCalledTimes(1)
          expect(instance.props.selectStore).not.toHaveBeenCalled()
        })
      })
      describe('Store onSelectClick', () => {
        it('should call selectDeliveryStore', () => {
          const storeIndex = 1
          const { wrapper, instance } = renderComponent({
            ...props,
            stores: mockStoreList,
            location: {
              search: 'somesearch',
              query: {},
            },
          })
          expect(instance.props.selectDeliveryStore).not.toHaveBeenCalled()
          wrapper
            .find('Connect(Store)')
            .at(storeIndex)
            .simulate('selectClick')
          expect(instance.props.selectDeliveryStore).toHaveBeenCalledTimes(1)
          expect(instance.props.selectDeliveryStore).toHaveBeenLastCalledWith(
            instance.props.stores[storeIndex]
          )
        })
      })
      describe('Footer onClick', () => {
        it('should call collapseMap when mapExpanded=true', () => {
          const { wrapper, instance } = renderComponent({
            ...props,
            mapExpanded: true,
          })
          expect(instance.props.collapseMap).not.toHaveBeenCalled()
          wrapper.find('.StoreLocator-footer').simulate('click')
          expect(instance.props.collapseMap).toHaveBeenCalledTimes(1)
        })
        it('should call showModal and e.stopPropagation() when mapExpanded=false and storeLocatorType = collectFromStore', () => {
          const { wrapper, instance } = renderComponent({
            ...props,
            storeLocatorType: 'collectFromStore',
          })
          const event = {
            stopPropagation: jest.fn(),
          }
          expect(instance.props.showModal).not.toHaveBeenCalled()
          expect(event.stopPropagation).not.toHaveBeenCalled()
          wrapper.find('.StoreLocator-footer').simulate('click', event)
          expect(instance.props.showModal).toHaveBeenCalledTimes(1)
          expect(event.stopPropagation).toHaveBeenCalledTimes(1)
        })
      })
      describe('showFilters onClick', () => {
        it('should call showModal and e.stopPropagation() whenstoreLocatorType = collectFromStore', () => {
          const { wrapper, instance } = renderComponent({
            ...props,
            storeLocatorType: 'collectFromStore',
          })
          const event = {
            stopPropagation: jest.fn(),
          }
          expect(instance.props.showModal).not.toHaveBeenCalled()
          expect(event.stopPropagation).not.toHaveBeenCalled()
          wrapper
            .find('.StoreLocator-showFiltersButton')
            .simulate('click', event)
          expect(instance.props.showModal).toHaveBeenCalledTimes(1)
          expect(event.stopPropagation).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
  describe('@functions', () => {
    it('@renderMap', () => {
      props.stores = [
        {
          storeId: 'TS0001',
        },
      ]
      const { instance } = renderComponent(props)
      expect(instance.renderMap()).toMatchSnapshot()
    })
    it('@renderStorePredictions', () => {
      props.stores = [
        {
          storeId: 'TS0001',
        },
      ]
      const { instance } = renderComponent(props)
      expect(instance.renderStorePredictions()).toMatchSnapshot()
    })
  })
  describe('@decorators', () => {
    analyticsDecoratorHelper(StoreLocator, 'store-locator', {
      componentName: 'StoreLocator',
      isAsync: true,
      redux: true,
    })
  })
})
