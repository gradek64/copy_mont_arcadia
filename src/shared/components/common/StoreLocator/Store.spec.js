import testComponentHelper from 'test/unit/helpers/test-component'
import * as DateTime from './date-time'
import Store from './Store'

describe('<Store />', () => {
  const D = global.Date
  beforeEach(() => {
    jest.clearAllMocks()
    global.Date = jest.fn(
      (...args) =>
        args.length ? new D(...args) : new D('2017-03-26T13:33:00Z')
    )
    global.Date.now = () => new Date().getTime()
  })

  afterEach(() => {
    global.Date = D
  })

  const collectFromStore = {
    express: {
      dates: [
        {
          availableUntil: '2017-03-31 20:30:00',
          collectFrom: '2017-04-01',
        },
        {
          availableUntil: '2017-04-02 14:30:00',
          collectFrom: '2017-04-03',
        },
      ],
      price: 3,
    },
    standard: {
      dates: [
        {
          availableUntil: '2017-03-31 21:30:00',
          collectFrom: '2017-04-01',
        },
        {
          availableUntil: '2017-04-02 16:30:00',
          collectFrom: '2017-04-03',
        },
      ],
      price: 0,
    },
  }

  const mockOverseasStore = {
    storeId: 'TS1815',
    brandName: 'Topshop',
    brandId: '12556',
    name: 'Bondi Junction Sydney',
    distance: 0,
    latitude: 0,
    longitude: 0,
    address: {
      line1: 'Topshop Myer Bondi, 500 Oxford Street',
      line2: '',
      city: 'Bondi Junction',
      postcode: 'NSW 2022',
    },
    openingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
    telephoneNumber: '02 9300 1100',
  }

  const actionMocks = {
    showModal: jest.fn(),
    onHeaderClick: jest.fn(),
    onSelectClick: jest.fn(),
  }

  const props = {
    storeDetails: {
      address: {
        city: 'London',
        line1: 'Some street',
        postcode: 'SW11 NE2',
      },
      brandId: 12556,
      distance: '3',
      latitude: 51.463675,
      longitude: -0.215336,
      name: 'Putney',
      openingHours: {
        sunday: '11:00-17:00',
        monday: '09:30-18:00',
        tuesday: '10:30-18:00',
        wednesday: '10:30-18:00',
        thursday: '10:30-18:00',
        friday: '10:30-18:00',
        saturday: '09:30-18:05',
      },
      cfsiPickCutOffTime: '14:00',
      cfsiAvailableOn: ['YNYY'],
      storeId: 'TS1030',
      telephoneNumber: '020 7261 7283',
      stock: 1,
      brandName: 'topshop',
      stockList: [
        {
          sku: '007',
          stock: 15,
          stockSymbol: 'I',
        },
      ],
    },
    storeLocatorType: 'some-type',
    region: 'uk',
    brandName: 'topshop',
    siteId: 12556,
    basket: {},
    collectionDay: '',
    logoVersion: '2.0',
    isImmediatelyAvailable: false,
    selectedCountry: 'United Kingdom',
    ...actionMocks,
  }

  const propsOverseas = {
    isMobile: true,
    storeDetails: mockOverseasStore,
    region: 'uk',
    brandName: 'topshop',
    logoVersion: '2.0',
    selectedCountry: 'Russia',
    ...actionMocks,
  }

  const basketMock = {
    products: [
      {
        sku: '007',
        quantity: 1,
        invavls: [
          {
            cutofftime: '2100',
            quantity: 9,
            expressdates: ['2017-03-26', '2017-04-27'],
          },
        ],
      },
    ],
  }

  const renderComponent = testComponentHelper(Store.WrappedComponent)
  // not mocking ./date-time functions in the render tests
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('in selected state', () => {
      expect(
        renderComponent({ ...props, selected: true }).getTree()
      ).toMatchSnapshot()
    })
    it('with no storeLocatorType', () => {
      expect(
        renderComponent({ ...props, storeLocatorType: '' }).getTree()
      ).toMatchSnapshot()
    })
    it('with no collect from store dates', () => {
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          isCFSiEspotEnabled: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    describe('when storeLocatorType equals findInStore', () => {
      it('with stock is 0', () => {
        expect(
          renderComponent({
            ...props,
            storeLocatorType: 'findInStore',
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with stock is greater than 0', () => {
        expect(
          renderComponent({
            ...props,
            storeLocatorType: 'findInStore',
            storeDetails: {
              ...props.storeDetails,
              stock: 2,
            },
          }).getTree()
        ).toMatchSnapshot()
      })
    })
    describe('when storeLocatorType equals collectFromStore', () => {
      it('in default state', () => {
        expect(
          renderComponent({
            ...props,
            storeLocatorType: 'collectFromStore',
            storeDetails: {
              ...props.storeDetails,
              collectFromStore,
            },
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with mobile equals true', () => {
        expect(
          renderComponent({
            ...props,
            storeLocatorType: 'collectFromStore',
            storeDetails: {
              ...props.storeDetails,
              collectFromStore,
            },
            isMobile: true,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with selected', () => {
        expect(
          renderComponent({
            ...props,
            storeLocatorType: 'collectFromStore',
            storeDetails: {
              ...props.storeDetails,
              collectFromStore,
            },
            selected: true,
          }).getTree()
        ).toMatchSnapshot()
      })
    })
    describe('Collect in Store and ParcelShop with DDP', () => {
      it('collect in store layout when a DDPProduct in shopping bag', () => {
        expect(
          renderComponent({
            ...props,
            isOrderDDPEligible: true,
            storeLocatorType: 'collectFromStore',
            storeDetails: { ...props.storeDetails, collectFromStore },
            collectionDay: 'today',
            isCFSiEspotEnabled: true,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('collect in store layout when isDDPUser is true', () => {
        expect(
          renderComponent({
            ...props,
            isOrderDDPEligible: true,
            storeLocatorType: 'collectFromStore',
            storeDetails: { ...props.storeDetails, collectFromStore },
            collectionDay: 'today',
            isCFSiEspotEnabled: true,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('parcelShop in store layout when a DDPProduct in shopping bag', () => {
        expect(
          renderComponent({
            ...props,
            isOrderDDPEligible: true,
            storeLocatorType: 'collectFromStore',
            storeDetails: { ...props.storeDetails, collectFromStore },
            collectionDay: 'today',
            isCFSiEspotEnabled: false,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('parcelShop in store layout when isDDPUser is true', () => {
        expect(
          renderComponent({
            ...props,
            isOrderDDPEligible: true,
            storeLocatorType: 'collectFromStore',
            storeDetails: { ...props.storeDetails, collectFromStore },
            collectionDay: 'today',
            isCFSiEspotEnabled: false,
          }).getTree()
        ).toMatchSnapshot()
      })
    })

    it('find in store layout when CFSi is enabled', () => {
      expect(
        renderComponent({
          ...props,
          onCFSIClick: jest.fn(),
          storeLocatorType: 'findInStore',
          storeDetails: { ...props.storeDetails, collectFromStore },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('find in store layout when CFSi is disabled', () => {
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'findInStore',
          storeDetails: { ...props.storeDetails, collectFromStore },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('capitalizes name for Miss Selfridge', () => {
      const updateBrandName = { brandName: 'miss selfridge' }
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'findInStore',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
            ...updateBrandName,
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('collect in store layout when CFSi is enabled', () => {
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          storeDetails: { ...props.storeDetails, collectFromStore },
          collectionDay: 'today',
          isCFSiEspotEnabled: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('collect in store layout when CFSi is enabled and basket is available', () => {
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          storeDetails: { ...props.storeDetails, collectFromStore },
          basket: basketMock,
          collectionDay: 'today',
          isCFSiEspotEnabled: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('collect in store layout when CFSi is disabled', () => {
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          storeDetails: { ...props.storeDetails, collectFromStore },
          CFSi: false,
          isCFSiEspotEnabled: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('store locator layout', () => {
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'storeSearch',
          storeDetails: { ...props.storeDetails, collectFromStore },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('find in store locator layout', () => {
      expect(
        renderComponent({
          ...props,
          storeLocatorType: 'findInStore',
          storeDetails: { ...props.storeDetails, collectFromStore },
          isMobile: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('store locator layout for overseas store', () => {
      expect(
        renderComponent({
          ...propsOverseas,
          storeLocatorType: 'storeSearch',
          storeDetails: {
            ...propsOverseas,
            ...props.storeDetails,
            collectFromStore,
          },
        }).getTree()
      ).toMatchSnapshot()
    })
  })
  describe('@events', () => {
    it('should call showModal when openingTimesButtons is clicked', () => {
      const { instance, wrapper } = renderComponent({
        ...props,
        storeLocatorType: 'collectFromStore',
        storeDetails: {
          ...props.storeDetails,
          collectFromStore,
        },
        isMobile: true,
      })
      const button = wrapper.find('.Store-details .Store-openingTimesButton')
      expect(button.length).toBe(1)

      expect(instance.props.showModal).not.toHaveBeenCalled()
      button.simulate('click')
      expect(instance.props.showModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('instance methods', () => {
    describe('getCollectionTime', () => {
      it('returns collection day if cfsi flag is true', () => {
        const { instance } = renderComponent({
          ...props,
          CFSi: true,
          isImmediatelyAvailable: true,
        })

        const collection = instance.getCollectionTime()
        expect(collection).toBe('Collect today')
      })
    })
    describe('renderHeaderDetailsInfo', () => {
      it('calls renderStockData() if storeLocatorType = findInStore', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'findInStore',
        })
        instance.renderStockData = jest.fn()

        expect(instance.renderStockData).not.toHaveBeenCalled()
        instance.renderHeaderDetailsInfo()
        expect(instance.renderStockData).toHaveBeenCalledTimes(1)
      })

      it('renders Store-openNowInfo and does not call renderStockData() if storeLocatorType = storeSearch', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'storeSearch',
        })
        instance.renderStockData = jest.fn()

        expect(instance.renderStockData).not.toHaveBeenCalled()
        instance.renderHeaderDetailsInfo()
        expect(instance.renderStockData).not.toHaveBeenCalled()
        expect(instance.renderHeaderDetailsInfo()).toMatchSnapshot()
      })

      it('returns null if storeLocatorType is empty', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: '',
        })
        instance.renderStockData = jest.fn()

        expect(instance.renderStockData).not.toHaveBeenCalled()
        expect(instance.renderHeaderDetailsInfo()).toBe(null)
      })
    })
    describe('getTodaysOpeningTimes', () => {
      const date = props.storeDetails.openingHours.sunday
      let getTimeInMinutesSpy
      beforeEach(() => {
        getTimeInMinutesSpy = jest.spyOn(DateTime, 'getTimeInMinutes')
      })
      afterEach(() => {
        getTimeInMinutesSpy.mockRestore()
      })
      it('should return null if after opening hours', () => {
        const { instance } = renderComponent(props)
        getTimeInMinutesSpy
          .mockImplementation(() => 873)
          .mockImplementationOnce(() => 1020)
          .mockImplementationOnce(() => 660)
        const openTimesComp = instance.getTodaysOpeningTimes(date, 22, 30)
        expect(openTimesComp).toBe(null)
      })
      it('should show closed now message', () => {
        const { instance } = renderComponent(props)
        getTimeInMinutesSpy
          .mockImplementation(() => 1020)
          .mockImplementationOnce(() => 660)
          .mockImplementationOnce(() => 873)
        const openTimesComp = instance.getTodaysOpeningTimes(date, 6, 30)
        expect(openTimesComp.length).toBe(2)
        expect(openTimesComp[0].props.className).toBe('Store-error')
        expect(openTimesComp[0].props.children).toBe('Closed now. ')
        expect(openTimesComp[1].props.className).toBe('Store-openAt')
        expect(openTimesComp[1].props.children[0]).toBe('Opens today at')
        expect(openTimesComp[1].props.children[2]).toBe('11:00')
      })
      it('should show open until message', () => {
        const { instance } = renderComponent(props)
        getTimeInMinutesSpy
          .mockImplementation(() => 660)
          .mockImplementationOnce(() => 873)
          .mockImplementationOnce(() => 1020)
        const openTimesComp = instance.getTodaysOpeningTimes(date, 13, 30)
        expect(openTimesComp.props.className).toBe('Store-success')
        expect(openTimesComp.props.children[0]).toBe('Open today until')
        expect(openTimesComp.props.children[2]).toBe('17:00')
      })
      it('should show closing soon message', () => {
        const { instance } = renderComponent(props)
        getTimeInMinutesSpy
          .mockImplementationOnce(() => 873)
          .mockImplementationOnce(() => 874)
          .mockImplementationOnce(() => 600)
        const openTimesComp = instance.getTodaysOpeningTimes(date, 16, 30)
        expect(openTimesComp.props.className).toBe('Store-closingSoon')
        expect(openTimesComp.props.children[0]).toBe('Closing soon at')
        expect(openTimesComp.props.children[2]).toBe('17:00')
      })
      it('should return false if store is closed', () => {
        const { instance } = renderComponent(props)
        expect(instance.getTodaysOpeningTimes('Closed')).toBe(null)
      })
      it('should return false if todays opening hours is falsy', () => {
        const { instance } = renderComponent(props)
        expect(instance.getTodaysOpeningTimes()).toBe(null)
      })
    })
    describe('getTomorrowOpeningTimes', () => {
      it('should get tomorrow opening times', () => {
        const { instance } = renderComponent(props)
        const tomorrowOpeningTimes = instance.getTomorrowOpeningTimes(0)

        expect(tomorrowOpeningTimes.length).toBe(2)
        expect(tomorrowOpeningTimes[0].props.className).toBe('Store-error')
        expect(tomorrowOpeningTimes[0].props.children).toBe('Closed today. ')
        expect(tomorrowOpeningTimes[1].props.className).toBe('Store-openAt')
        expect(tomorrowOpeningTimes[1].props.children[0]).toBe(
          'Opens tomorrow at'
        )
        expect(tomorrowOpeningTimes[1].props.children[2]).toBe('09:30')
      })
      it('should show only closed today if opening times data is available', () => {
        const { instance } = renderComponent({
          ...props,
          storeDetails: {
            ...props.storeDetails,
          },
        })
        const tomorrowOpeningTimes = instance.getTomorrowOpeningTimes(3)

        expect(tomorrowOpeningTimes.length).toBe(2)
        expect(tomorrowOpeningTimes[0].props.className).toBe('Store-error')
        expect(tomorrowOpeningTimes[0].props.children).toBe('Closed today. ')
        expect(tomorrowOpeningTimes[1].props.className).toBe('Store-openAt')
      })
      it('should not show closed today if no opening times data is available', () => {
        const { instance } = renderComponent({ ...propsOverseas })
        const tomorrowOpeningTimes = instance.getTomorrowOpeningTimes(3)

        expect(tomorrowOpeningTimes.length).toBe(2)
        expect(tomorrowOpeningTimes[0]).toEqual(null)
        expect(tomorrowOpeningTimes[1]).toEqual(null)
      })
    })
    describe('renderOpenNowInfo', () => {
      it('should called only getTodaysOpeningTimes if it returns something', () => {
        const { instance } = renderComponent(props)
        instance.getTomorrowOpeningTimes = jest.fn()
        instance.getTodaysOpeningTimes = jest.fn().mockReturnValue(true)

        instance.renderOpenNowInfo()
        expect(instance.getTodaysOpeningTimes).toHaveBeenCalledTimes(1)
        expect(instance.getTomorrowOpeningTimes).not.toHaveBeenCalled()
      })
      it('should called getTodaysOpeningTimes & getTomorrowOpeningTimes if first function returns false', () => {
        const { instance } = renderComponent(props)
        instance.getTomorrowOpeningTimes = jest.fn()
        instance.getTodaysOpeningTimes = jest.fn().mockReturnValue(false)

        instance.renderOpenNowInfo()
        expect(instance.getTodaysOpeningTimes).toHaveBeenCalledTimes(1)
        expect(instance.getTomorrowOpeningTimes).toHaveBeenCalledTimes(1)
      })
    })
    it('on onHeaderSelectButtonClick', () => {
      const { instance } = renderComponent(props)
      const event = {
        stopPropagation: jest.fn(),
      }
      expect(event.stopPropagation).not.toHaveBeenCalled()
      expect(instance.props.onSelectClick).not.toHaveBeenCalled()
      instance.onHeaderSelectButtonClick(event)
      expect(event.stopPropagation).toHaveBeenCalledTimes(1)
      expect(instance.props.onSelectClick).toHaveBeenCalledTimes(1)
    })
    describe('getEarliestCollectionDateTime', () => {
      let getEarliestCollectionDate
      let getEnglishDateSpy
      beforeEach(() => {
        getEarliestCollectionDate = jest.spyOn(
          DateTime,
          'getEarliestCollectionDate'
        )
        getEnglishDateSpy = jest.spyOn(DateTime, 'getEnglishDate')
      })
      afterEach(() => {
        getEarliestCollectionDate.mockRestore()
        getEnglishDateSpy.mockRestore()
      })
      it('is not parcelShop', () => {
        getEarliestCollectionDate.mockImplementation(() => '2017-04-01')
        getEnglishDateSpy.mockImplementation(() => '1st April')
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',

          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
          },
        })
        const collectionDate = instance.getEarliestCollectionDateTime()
        expect(collectionDate).toBe('1pm 1st April')
      })
      it('is parcelShop (has brandId of 14000)', () => {
        getEarliestCollectionDate.mockImplementation(() => '2017-04-01')
        getEnglishDateSpy.mockImplementation(() => '1st April')
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
            brandId: 14000,
          },
        })

        const collectionDate = instance.getEarliestCollectionDateTime()
        expect(collectionDate).toBe('6pm 1st April (latest)')
      })
    })
    describe('getDirectionsUrl', () => {
      // assuming we always have proper storeDetails.latitude and storeDetails.longitude from backend
      it('with proper directionsFrom and destinationLocationParam', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
          },
          directionsFrom: {
            latitude: '51.07',
            longitude: '43.22',
          },
        })
        const url = instance.getDirectionsUrl()
        expect(url).toBe(
          'http://maps.apple.com/?saddr=51.07,43.22&daddr=51.463675,-0.215336'
        )
      })
      it('with no directionsFrom', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
          },
          directionsFrom: null,
        })
        const url = instance.getDirectionsUrl()
        expect(url).toBe(
          'http://maps.apple.com/?saddr=&daddr=51.463675,-0.215336'
        )
      })
    })
    describe('getStoreDistance', () => {
      it('when region is uk and storeLocatorType is collectFromStore', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'collectFromStore',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
          },
        })
        const storeDistance = instance.getStoreDistance()
        expect(storeDistance).toBe('3 miles')
      })
      it('when region is uk and storeLocatorType is not collectFromStore', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'some-type',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
          },
        })
        const storeDistance = instance.getStoreDistance()
        expect(storeDistance).toBe('3 miles')
      })
      it('when region is not uk', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'some-type',
          region: 'pl',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
          },
        })
        const storeDistance = instance.getStoreDistance()
        expect(storeDistance).toBe('3 kilometres')
      })
      it('when distance is not a number', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'some-type',
          region: 'pl',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
            distance: '3 miles',
          },
        })
        const storeDistance = instance.getStoreDistance()
        expect(storeDistance).toBe(false)
      })
      it('when distance is 0', () => {
        const { instance } = renderComponent({
          ...props,
          storeLocatorType: 'some-type',
          region: 'pl',
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
            distance: 0,
          },
        })
        const storeDistance = instance.getStoreDistance()
        expect(storeDistance).toBe(false)
      })
    })

    describe('getIconSrc', () => {
      it('should return store-marker-icon', () => {
        const { instance } = renderComponent(props)
        const imageSrc = instance.getIconSrc()
        expect(imageSrc).toBe(
          '/assets/topshop/images/store-marker-icon.svg?version=2.0'
        )
      })

      it('should return hermes-icon when brandName === "Hermes"', () => {
        const { instance } = renderComponent({
          ...props,
          storeDetails: {
            ...props.storeDetails,
            collectFromStore,
            brandName: 'Hermes',
          },
        })
        const imageSrc = instance.getIconSrc()
        expect(imageSrc).toBe(
          '/assets/topshop/images/parcelshop-marker-icon.svg?version=2.0'
        )
      })
    })

    describe('hasLocation', () => {
      it('should return true if has valid longitude and latitude', () => {
        const { instance } = renderComponent(props)
        expect(instance.hasLocation()).toBe(true)
      })
      it('should return true if only longitude is 0', () => {
        const { instance } = renderComponent({
          ...props,
          storeDetails: {
            ...props.storeDetails,
            longitude: 0,
          },
        })
        expect(instance.hasLocation()).toBe(true)
      })
      it('should return true if only latitude is 0', () => {
        const { instance } = renderComponent({
          ...props,
          storeDetails: {
            ...props.storeDetails,
            latitude: 0,
          },
        })
        expect(instance.hasLocation()).toBe(true)
      })
      it('should return false if longitude and latitude are 0', () => {
        const { instance } = renderComponent({
          ...props,
          storeDetails: {
            ...props.storeDetails,
            longitude: 0,
            latitude: 0,
          },
        })
        expect(instance.hasLocation()).toBe(false)
      })
    })
  })
})
