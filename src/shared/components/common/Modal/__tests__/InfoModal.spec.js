import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import InfoModal from '../InfoModal'

const defaultProps = {
  infoText: 'I am some information that you should know',
  cancelClick: jest.fn(),
  cancelText: 'Cancel',
  actionClick: jest.fn(),
  actionText: 'Carry out an action',
}
const context = { l: jest.fn() }

const renderComponent = testComponentHelper(InfoModal, { context })

describe(InfoModal.name, () => {
  it('renders as expected', () => {
    expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
  })

  it('renders with clickable action buttons when passed in as props', () => {
    const { wrapper } = renderComponent(defaultProps)
    expect(wrapper.find('Button').length).toEqual(2)

    wrapper
      .find('Button')
      .first()
      .dive()
      .simulate('click')
    expect(defaultProps.cancelClick).toHaveBeenCalled()

    wrapper
      .find('Button')
      .last()
      .dive()
      .simulate('click')
    expect(defaultProps.actionClick).toHaveBeenCalled()
  })

  it('renders a router link in place of a button when passed in as a prop for cancellation', () => {
    const { wrapper } = renderComponent({
      ...defaultProps,
      cancelLink: '/cancel-time',
    })
    expect(wrapper.find('Button').length).toEqual(1)
    expect(wrapper.find('Link').length).toEqual(1)
    expect(wrapper.find('Link').props().to).toEqual('/cancel-time')
  })

  it('renders a router link in place of a button when passed in as a prop for the action which calls the actionClick as well when clicked', () => {
    const { wrapper } = renderComponent({
      ...defaultProps,
      actionLink: '/action-time',
    })
    expect(wrapper.find('Button').length).toEqual(1)
    expect(wrapper.find('Link').length).toEqual(1)
    expect(wrapper.find('Link').props().to).toEqual('/action-time')

    wrapper.find('Link').simulate('click')
    expect(defaultProps.actionClick).toHaveBeenCalled()
  })
})
