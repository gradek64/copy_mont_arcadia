import testComponentHelper from '../../../../../../../test/unit/helpers/test-component'
import GuestRegisterForm from '../GuestRegisterForm'

describe('<GuestRegisterForm />', () => {
  const props = { l: jest.fn().mockImplementation((val) => val) }
  const renderComponent = testComponentHelper(GuestRegisterForm)

  it('default render', () => {
    const { getTree } = renderComponent(props)
    expect(getTree()).toMatchSnapshot()
  })
})
