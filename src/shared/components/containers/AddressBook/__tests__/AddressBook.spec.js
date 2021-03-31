import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import { AddressBook } from '../AddressBook'
import AddressBookList from '../AddressBookList/AddressBookList'
import AddressBookFormWrapper from '../AddressBookForm/AddressBookFormWrapper'
import Button from '../../../common/Button/Button'

describe('AddressBook', () => {
  const renderComponent = testComponentHelper(AddressBook)

  const initialProps = {
    savedAddresses: [
      {
        addressId: 843489,
        addressName: 'London, E3 2DS, United Kingdom',
        selected: true,
        address1: '2 Foo Road',
        address2: '',
        city: 'London',
        state: '',
        postcode: 'E3 2DS',
        country: 'United Kingdom',
        title: 'Ms',
        firstName: 'Jane',
        lastName: 'Doe',
        telephone: '01234 567890',
      },
    ],
    isNewAddressFormVisible: false,
    shouldDisplayDeliveryInstructions: true,
    createAddress: jest.fn(),
    validateDDPForCountry: jest.fn(),
    updateAddress: jest.fn(),
    deleteAddress: jest.fn(),
    selectAddress: jest.fn(),
    showNewAddressForm: jest.fn(),
    hideNewAddressForm: jest.fn(),
    getAccount: jest.fn(),
  }

  describe('@render', () => {
    it('should not show the address book list when there are no saved addresses', () => {
      const props = { ...initialProps, savedAddresses: [] }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(AddressBookList)).toHaveLength(0)
    })

    it('should show the default address in the accordion header', () => {
      const { wrapper } = renderComponent(initialProps)
      const SubHeaderPropsTitle = wrapper
        .find('.DeliveryAddressAccordion')
        .props().subHeader.props.title.props
      expect(wrapper.find('.DeliveryAddressAccordion')).toHaveLength(1)
      expect(SubHeaderPropsTitle.className).toBe('AddressBookList-itemDetails')
    })

    it('should show the new address book form when isNewAddressFormVisible is true', () => {
      const props = { ...initialProps, isNewAddressFormVisible: true }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(AddressBookFormWrapper)).toHaveLength(1)
    })
    it('should not show the new address book form when isNewAddressFormVisible is false', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(AddressBookFormWrapper)).toHaveLength(0)
    })

    describe('Accordion deliveryInstructions', () => {
      const { wrapper } = renderComponent(initialProps)
      it('should display Accordion--deliveryInstructions if AddressBookList is not showing', () => {
        expect(wrapper.find('.Accordion--deliveryInstructions')).toHaveLength(1)
      })
      it('should not display Accordion--deliveryInstructions if AddressBookList is showing', () => {
        wrapper
          .find('.DeliveryAddressAccordion')
          .props()
          .onAccordionToggle()

        expect(wrapper.find('.Accordion--deliveryInstructions')).toHaveLength(0)
      })
    })
    describe('when have 4 saved addresses', () => {
      const props = {
        ...initialProps,
        savedAddresses: [
          ...initialProps.savedAddresses,
          { id: 843490 },
          { id: 843491 },
          { id: 843492 },
        ],
      }
      it('should disable add new address button and show warning message', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(Button).props().isDisabled).toBe(true)
        expect(wrapper.find('.AddressBook-addNewNote')).toHaveLength(1)
      })
    })
    describe('when saved addresses are more than 4', () => {
      const props = {
        ...initialProps,
        savedAddresses: [
          ...initialProps.savedAddresses,
          { id: 843490, selected: false },
          { id: 843491, selected: false },
          { id: 843492 },
          { id: 843493 },
        ],
      }
      it('should disable add new address button and show warning message', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(Button).props().isDisabled).toBe(true)
        expect(wrapper.find('.AddressBook-addNewNote')).toHaveLength(1)
      })
    })
    describe('when saved addresses are less than 4', () => {
      const props = {
        ...initialProps,
        savedAddresses: [
          ...initialProps.savedAddresses,
          { id: 843490, selected: false },
          { id: 843491, selected: false },
        ],
      }
      it('should not disable add new address button and not show warning message', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(Button).props().isDisabled).toBe(false)
        expect(wrapper.find('.AddressBook-addNewNote')).toHaveLength(0)
      })
    })
    describe('when there is no saved addresses', () => {
      it('should not disable add new address button and not show warning message', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find(Button).props().isDisabled).toBe(false)
        expect(wrapper.find('.AddressBook-addNewNote')).toHaveLength(0)
      })
    })
  })
  describe('@events', () => {
    it('should call the showNewAddressForm function when the addNew button is clicked', () => {
      const { wrapper } = renderComponent(initialProps)
      const addNewButton = wrapper.find(Button)

      addNewButton
        .dive()
        .find('button')
        .simulate('click')
      expect(initialProps.showNewAddressForm).toHaveBeenCalledTimes(1)
    })

    it('should call `validateDDPForCountry` if selected address is changed', async () => {
      const selectAddressMock = jest.fn(() => Promise.resolve())
      const validateDDPForCountryMock = jest.fn()

      const props = {
        savedAddresses: [
          {
            addressId: 843489,
            addressName: 'London, E3 2DS, United Kingdom',
            selected: true,
            address1: '2 Foo Road',
            address2: '',
            city: 'London',
            state: '',
            postcode: 'E3 2DS',
            country: 'France',
            title: 'Ms',
            firstName: 'Jane',
            lastName: 'Doe',
            telephone: '01234 567890',
          },
          { country: 'United Kingdom', selected: false },
        ],
        selectAddress: selectAddressMock,
        validateDDPForCountry: validateDDPForCountryMock,
      }
      const address = props.savedAddresses[0]
      const { wrapper, instance } = renderComponent(props)
      instance.getSelectedAddress = jest.fn().mockReturnValue(address)
      wrapper.setState({ preSelected: address.addressId })
      wrapper.update()
      instance.onAccordionToggle = jest.fn()

      await instance.onSelectAddress()
      expect(instance.getSelectedAddress()).toEqual(address)
      expect(selectAddressMock).toHaveBeenCalled()
      expect(validateDDPForCountryMock).toHaveBeenCalledWith('France')
      expect(instance.onAccordionToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      it('should call `validateDDPForCountry` with country of selected address', () => {
        const validateDDPForCountryMock = jest.fn()
        const props = {
          savedAddresses: [
            {
              addressId: 843489,
              addressName: 'London, E3 2DS, United Kingdom',
              selected: true,
              address1: '2 Foo Road',
              address2: '',
              city: 'London',
              state: '',
              postcode: 'E3 2DS',
              country: 'France',
              title: 'Ms',
              firstName: 'Jane',
              lastName: 'Doe',
              telephone: '01234 567890',
            },
            { country: 'United Kingdom', selected: false },
          ],
          validateDDPForCountry: validateDDPForCountryMock,
        }
        const { instance } = renderComponent(props)

        instance.componentDidMount()
        expect(validateDDPForCountryMock).toHaveBeenCalledWith('France')
      })
    })
  })

  describe('onAccordionToggle', () => {
    it('should set isAccordionExpanded to true if it is false', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      expect(instance.state.isAccordionExpanded).toBe(false)
      wrapper
        .find('.DeliveryAddressAccordion')
        .props()
        .onAccordionToggle()
      expect(instance.state.isAccordionExpanded).toBe(true)
    })
    it('should set isAccordionExpanded to false if it is true', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      instance.state.isAccordionExpanded = true
      wrapper
        .find('.DeliveryAddressAccordion')
        .props()
        .onAccordionToggle()
      expect(instance.state.isAccordionExpanded).toBe(false)
    })
    it('should set preSelected with the selected address', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      expect(instance.state.preSelected).toBe(null)
      wrapper
        .find('.DeliveryAddressAccordion')
        .props()
        .onAccordionToggle()
      expect(instance.state.preSelected).toBe(843489)
    })
  })

  describe('onPreselect', () => {
    it('should set the preSelected local state with the new ID', () => {
      const { instance } = renderComponent(initialProps)
      instance.state.preSelected = 843489
      const newID = 843490
      instance.onPreselect(newID)
      expect(instance.state.preSelected).toBe(newID)
    })
  })

  describe('subHeader', () => {
    it('should not display if there is no savedAddresses', () => {
      const props = { ...initialProps, savedAddresses: [] }
      const { wrapper } = renderComponent(props)
      const subHeader = wrapper.find('.DeliveryAddressAccordion').props()
        .subHeader
      expect(subHeader).toBe('')
    })
    it('should not display if the accordion is open', () => {
      const { wrapper } = renderComponent(initialProps)
      // expand Accordion
      wrapper
        .find('.DeliveryAddressAccordion')
        .props()
        .onAccordionToggle()

      const subHeader = wrapper.find('.DeliveryAddressAccordion').props()
        .subHeader
      expect(subHeader).toBe('')
    })
    it('should display the selected saved address details if the accordion is closed', () => {
      const { wrapper, instance } = renderComponent(initialProps)
      instance.getAccordionSubHeaderText = jest.fn()
      const subHeaderChildren = wrapper
        .find('.DeliveryAddressAccordion')
        .props().subHeader.props.title.props.children
      const firstName = subHeaderChildren[0][0]
      const lastName = subHeaderChildren[0][1]
      const telephone = subHeaderChildren[1][0]
      const address1 = subHeaderChildren[2][0]
      const address2 = subHeaderChildren[3]
      const city = subHeaderChildren[4][0]
      const postcode = subHeaderChildren[5][0]
      const country = subHeaderChildren[6][0]

      expect(firstName).toBe(initialProps.savedAddresses[0].firstName)
      expect(lastName).toBe(initialProps.savedAddresses[0].lastName)
      expect(telephone).toBe(initialProps.savedAddresses[0].telephone)
      expect(address1).toBe(initialProps.savedAddresses[0].address1)
      expect(address2).toBe(initialProps.savedAddresses[0].address2)
      expect(city).toBe(initialProps.savedAddresses[0].city)
      expect(postcode).toBe(initialProps.savedAddresses[0].postcode)
      expect(country).toBe(initialProps.savedAddresses[0].country)
    })
  })
})
