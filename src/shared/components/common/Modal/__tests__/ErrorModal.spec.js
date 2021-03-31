import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import ErrorModal from '../ErrorModal'

const defaultProps = {
  message: 'I am some information that you should know',
  closeModal: jest.fn(),
}
const context = { l: jest.fn() }

const renderComponent = testComponentHelper(ErrorModal.WrappedComponent, {
  context,
})

describe(ErrorModal.name, () => {
  it('renders as expected', () => {
    expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
  })

  it('renders with clickable action buttons when passed in as props', () => {
    const { wrapper } = renderComponent(defaultProps)
    expect(wrapper.find('Button').length).toEqual(1)

    wrapper
      .find('Button')
      .first()
      .dive()
      .simulate('click')
    expect(defaultProps.closeModal).toHaveBeenCalled()
  })
})
