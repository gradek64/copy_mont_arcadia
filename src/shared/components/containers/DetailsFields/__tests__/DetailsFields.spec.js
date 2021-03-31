import testComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import DetailsFields from '../DetailsFields'
import Select from '../../../common/FormComponents/Select/Select'
import Input from '../../../common/FormComponents/Input/Input'
import { customerDetailsSchema } from '../../../../../shared/constants'
import * as formUtils from '../../../../../shared/lib/form-utilities'
import * as configSelectors from '../../../../selectors/common/configSelectors'

jest.mock('../../../../selectors/common/configSelectors')

const mockProps = {
  customerDetailsSchema,
  form: formUtils.defaultSchema(customerDetailsSchema),
  siteOptions: {
    titles: ['Mr', 'Mrs', 'Dr'],
    USStates: [],
  },
  state: {},
  deliveryCountries: ['UK', 'France', 'Germany'],
  touchedField: () => () => {},
  resetForm: jest.fn(),
  setField: () => () => {},
  rules: { 'United Kingdom': { stateFieldType: true } },
  section: 'delivery',
}
const userAPISchema = {
  lastName: 'XXXXX',
  billingDetails: {
    addressDetailsId: 231930306,
    nameAndPhone: {
      title: 'XXXXX',
      firstName: 'Billing First',
      lastName: 'XXXXXX',
      telephone: 'XXXXX',
    },
    address: {
      address1: 'XXXX',
      address2: '',
      city: 'XXXX',
      state: '',
      country: 'XXXX',
      postcode: 'XXXXX',
    },
  },
  'arcadia-session-key': 'XXXXX',
  creditCard: {
    type: 'XXXXX',
    cardNumberHash: 'XXXXX',
    cardNumberStar: '************1111',
    expiryMonth: 'XX',
    expiryYear: 'XXXX',
  },
  deliveryDetails: {
    addressDetailsId: 999999,
    nameAndPhone: {
      title: 'XX',
      firstName: 'First Name',
      lastName: 'XX',
      telephone: 'XX',
    },
    address: {
      address1: 'XXXXX',
      address2: '',
      city: 'XXXX',
      state: '',
      country: 'XXXX',
      postcode: 'XXXXX',
    },
  },
  basketItemCount: 0,
  version: '1.2',
  title: 'XX',
  firstName: 'XXXXXX',
  exists: true,
  iat: 9999999,
  email: 'aaa@bbb.com',
  userTrackingId: 99999,
}

const renderComponent = testComponentHelper(DetailsFields.WrappedComponent)

describe('<DetailsFields />', () => {
  it('does not render the billing info by default', () => {
    const { wrapper } = renderComponent(mockProps)
    expect(wrapper.find('.DetailsForm-billingInfo')).toHaveLength(0)
  })
  it('contains 7 inputs', () => {
    const { wrapper } = renderComponent(mockProps)
    expect(wrapper.find(Input)).toHaveLength(7)
  })

  it('contains 2 selects', () => {
    const { wrapper } = renderComponent(mockProps)
    expect(wrapper.find(Select)).toHaveLength(2)
  })

  it('does not pre fill the fields if there is no user', () => {
    const { wrapper } = renderComponent(mockProps)
    const firstConnectedSelect = wrapper.find('Connect(Select)').first()
    const inputValue = firstConnectedSelect.prop('value')

    expect(inputValue).toBe('')
  })

  it('does pre fill the fields if there is a user by "resetting" the form', () => {
    const { instance } = renderComponent({ ...mockProps, user: userAPISchema })
    instance.componentDidMount()
    expect(mockProps.resetForm).toHaveBeenCalledTimes(1)
  })

  describe('mapStateToProps', () => {
    it('should calculate its delivery countries using the getCountriesByAddressType selector', () => {
      const state = {
        config: {},
      }
      const fakeCountries = ['Fakeland']
      configSelectors.getCountriesByAddressType.mockReturnValue(fakeCountries)
      const renderedProps = renderConnectedComponentProps(DetailsFields, state)
      expect(renderedProps.deliveryCountries).toBe(fakeCountries)
    })
  })
})
