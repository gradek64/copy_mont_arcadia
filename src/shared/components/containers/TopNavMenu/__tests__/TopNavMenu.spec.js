import { browserHistory } from 'react-router'
import testComponentHelper from 'test/unit/helpers/test-component'
import KEYS from '../../../../constants/keyboardKeys'
import TopNavMenu from '../TopNavMenu'
import { analyticsGlobalNavClickEvent } from '../../../../analytics/tracking/site-interactions'

jest.mock('../../../../analytics/tracking/site-interactions', () => ({
  analyticsGlobalNavClickEvent: jest.fn(),
}))

const toggleTopNavMenu = jest.fn()
const closeTopNavMenu = jest.fn()
const toggleScrollToTop = jest.fn()

const props = {
  categoryHistory: [{ label: 'testCategory' }],
}

browserHistory.push = jest.fn()

const renderComponent = testComponentHelper(TopNavMenu.WrappedComponent)

describe('@renders', () => {
  it('renders in default state', () => {
    expect(renderComponent(props).getTree()).toMatchSnapshot()
  })
  it('renders in open state - menu is open', () => {
    const { wrapper } = renderComponent({
      ...props,
      topNavMenuOpen: true,
    })
    expect(wrapper.find('.TopNavMenu').hasClass('is-open')).toBe(true)
  })
})

describe('@lifecycle', () => {
  it('call scrollToTop on componentDidUpdate', () => {
    const dummyElement = [{ scrollTop: 5 }]
    document.getElementsByClassName = () => dummyElement

    const { instance } = renderComponent({
      ...props,
      mustScrollToTop: true,
      toggleScrollToTop,
    })
    instance.componentDidUpdate()
    expect(instance.props.toggleScrollToTop).toHaveBeenCalledTimes(1)
  })
})

describe('@functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('`toggleTopNavMenu()` prop called 1 time when `logout()` method is called', () => {
    const { instance } = renderComponent({
      ...props,
      topNavMenuOpen: true,
      toggleTopNavMenu,
    })

    instance.logout()

    expect(instance.props.toggleTopNavMenu).toHaveBeenCalledTimes(1)
    expect(analyticsGlobalNavClickEvent).toHaveBeenCalledWith('logout')
  })
  it('`closeTopNavMenu()` prop called 1 time when `onKeydown(...)` method is called', () => {
    const { instance } = renderComponent({
      ...props,
      topNavMenuOpen: true,
      closeTopNavMenu,
    })

    instance.onKeydown({
      keyCode: KEYS.ESCAPE,
    })

    expect(closeTopNavMenu).toHaveBeenCalledTimes(1)
  })
  it('`onHomeClick()` calls the `toggleTopNavMenu` prop and the `analyticsGlobalNavClickEvent` with the correct arguments', () => {
    const { instance } = renderComponent({
      ...props,
      topNavMenuOpen: true,
      toggleTopNavMenu,
    })
    instance.onHomeClick()

    expect(browserHistory.push).toHaveBeenCalledWith('/')
    expect(instance.props.toggleTopNavMenu).toHaveBeenCalled()
    expect(analyticsGlobalNavClickEvent).toHaveBeenCalledWith('home')
  })
  it('`popCategoryHistory()` calls the `popCategoryHistory` prop and the `analyticsGlobalNavClickEvent` with the correct arguments', () => {
    const { instance } = renderComponent({
      ...props,
      topNavMenuOpen: true,
      popCategoryHistory: jest.fn(),
    })
    instance.popCategoryHistory({ preventDefault: jest.fn() })

    expect(instance.props.popCategoryHistory).toHaveBeenCalled()
  })
})
