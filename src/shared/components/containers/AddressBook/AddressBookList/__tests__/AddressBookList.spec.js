import testComponentHelper from '../../../../../../../test/unit/helpers/test-component'
import AddressBookList from '../AddressBookList'
import Button from '../../../../common/Button/Button'

describe('AddressBookList', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  const renderComponent = testComponentHelper(AddressBookList)
  describe('@render', () => {
    const props = {
      savedAddresses: [
        {
          id: 843489,
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
        {
          addressId: 843490,
          addressName: 'London, EC3N 1JJ, United Kingdom',
          selected: false,
          address1: '101 Acme Road',
          address2: '',
          city: 'London',
          state: '',
          postcode: 'EC3N 1JJ',
          country: 'United Kingdom',
          title: 'Mr',
          firstName: 'Banana',
          lastName: 'Man',
          telephone: '01234 567890',
        },
      ],
      onDeleteAddress: jest.fn(),
      onSelectAddress: jest.fn(),
      onPreselect: jest.fn(),
    }
    it('should show the address book list when there are saved addresses using address.id', () => {
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
    it('should not show the address book list when there are no saved addresses', () => {
      const { getTree } = renderComponent({ ...props, savedAddresses: [] })
      expect(getTree()).toMatchSnapshot()
    })
    it('should show the address book list when there are saved addresses using address.addressId', () => {
      const { getTree } = renderComponent({
        ...props,
        savedAddresses: [
          { ...props.savedAddresses[0], selected: false },
          { ...props.savedAddresses[1], selected: true },
        ],
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('should not display "use this address" button if only one address', () => {
      const { wrapper } = renderComponent({
        ...props,
        savedAddresses: [props.savedAddresses[0]],
      })
      const button = wrapper.find('.AddressBook-addNewBtn')
      expect(button).toHaveLength(0)
    })
    it('should display "use this address" button if more than one address', () => {
      const { wrapper } = renderComponent(props)
      const button = wrapper.find('.AddressBook-addNewBtn')
      expect(button).toHaveLength(1)
    })
  })

  describe('@events', () => {
    const props = {
      savedAddresses: [
        {
          id: 843490,
          addressName: 'London, EC3N 1JJ, United Kingdom',
          selected: true,
          address1: '101 Acme Road',
          address2: '',
          city: 'London',
          state: '',
          postcode: 'EC3N 1JJ',
          country: 'United Kingdom',
          title: 'Mr',
          firstName: 'Banana',
          lastName: 'Man',
          telephone: '01234 567890',
        },
        {
          addressId: 843491,
          addressName: 'London, EC3N 1JJ, United Kingdom',
          selected: false,
          address1: '101 Acme Road',
          address2: '',
          city: 'London',
          state: '',
          postcode: 'EC3N 1JJ',
          country: 'United Kingdom',
          title: 'Mr',
          firstName: 'Banana',
          lastName: 'Man',
          telephone: '01234 567890',
        },
      ],
      preSelected: 843490,
      onDeleteAddress: jest.fn(),
      onSelectAddress: jest.fn(),
      onPreselect: jest.fn(),
    }

    it('should call the onDeleteAddress function when the itemDelete link is clicked using address.id', () => {
      const { wrapper } = renderComponent(props)
      const itemDeleteLink = wrapper
        .find('a.AddressBookList-itemDelete')
        .first()
      itemDeleteLink.simulate('click', { preventDefault: jest.fn() })
      expect(props.onDeleteAddress).toHaveBeenCalledTimes(1)
      expect(props.onDeleteAddress).toHaveBeenCalledWith(
        props.savedAddresses[1]
      )
    })
    it('should call the onDeleteAddress function when the itemDelete link is clicked using address.addressId', () => {
      const { wrapper } = renderComponent({
        ...props,
        savedAddresses: [
          { ...props.savedAddresses[0], selected: true },
          { ...props.savedAddresses[1], selected: false },
        ],
        preSelected: 843491,
      })

      const itemDeleteLink = wrapper
        .find('a.AddressBookList-itemDelete')
        .first()
      itemDeleteLink.simulate('click', { preventDefault: jest.fn() })
      expect(props.onDeleteAddress).toHaveBeenCalledTimes(1)
      expect(props.onDeleteAddress).toHaveBeenCalledWith(
        props.savedAddresses[0]
      )
    })
    it('should not render item delete links when there is only one saved address', () => {
      const { wrapper } = renderComponent({
        ...props,
        savedAddresses: [props.savedAddresses[0]],
      })
      const itemDeleteLink = wrapper.find('a.AddressBookList-itemDelete')
      expect(itemDeleteLink.length).toBe(0)
    })

    describe('selectedAddress', () => {
      it('should return an id if addresses using address.id', () => {
        const { instance } = renderComponent(props)
        const id = instance.selectedAddress()
        expect(id).toBe(props.savedAddresses[0].id)
      })

      it('should return an id if addresses using address.addressId', () => {
        const { instance } = renderComponent({
          ...props,
          savedAddresses: [
            { ...props.savedAddresses[0], selected: false },
            { ...props.savedAddresses[1], selected: true },
          ],
          preSelected: 843491,
        })
        const id = instance.selectedAddress()
        expect(id).toBe(props.savedAddresses[1].addressId)
      })
    })

    describe('componentDidUpdate', () => {
      const newProps = { ...props }
      it('should set preselect with the new selected address', () => {
        const { wrapper } = renderComponent({
          ...props,
          savedAddresses: [
            { ...props.savedAddresses[0], selected: false },
            { ...props.savedAddresses[1], selected: true },
          ],
          preSelected: 843491,
        })
        wrapper.instance().componentDidUpdate(newProps)
        expect(wrapper.instance().props.onPreselect).toHaveBeenCalledTimes(1)
        expect(wrapper.instance().props.onPreselect).toBeCalledWith(
          props.savedAddresses[1].addressId
        )
      })
    })

    describe('onClick "use this address"', () => {
      it('should call onSelectAddress with an address containing id', () => {
        const { wrapper } = renderComponent(props)
        const addNewButton = wrapper.find(Button)
        addNewButton
          .dive()
          .find('button')
          .simulate('click')
        expect(props.onSelectAddress).toHaveBeenCalledTimes(1)
      })
      it('should call onSelectAddress with an address containing addressID', () => {
        const { wrapper } = renderComponent({
          ...props,
          preSelected: 843491,
        })
        const addNewButton = wrapper.find(Button)
        addNewButton
          .dive()
          .find('button')
          .simulate('click')
        expect(props.onSelectAddress).toHaveBeenCalledTimes(1)
      })
    })
  })
})
