import testComponentHelper from 'test/unit/helpers/test-component'
import NotFound from '../../NotFound/NotFound'
import ErrorMessage from '../ErrorMessage'

const renderComponent = testComponentHelper(ErrorMessage.WrappedComponent)

describe('<ErrorMessage />', () => {
  beforeEach(jest.clearAllMocks)

  it('does not render when there is no error', () => {
    const { wrapper } = renderComponent()
    expect(wrapper.html()).toBeNull()
  })

  it('shows Modal when there is an overlay error', () => {
    const props = {
      error: {
        isOverlay: true,
        message: 'Modal error to be displayed',
      },
      showModal: jest.fn(),
    }
    const { wrapper, instance } = renderComponent(props)
    instance.componentDidMount()
    expect(wrapper.html()).toBeNull()
    expect(props.showModal).toHaveBeenCalledTimes(1)
  })

  it('suppress Modal when there is a 404 error', () => {
    const props = {
      error: {
        isOverlay: true,
        message: 'Modal error to be displayed',
        statusCode: 404,
      },
      showModal: jest.fn(),
    }
    const { wrapper } = renderComponent(props)
    expect(wrapper.html()).toBeNull()
    expect(props.showModal).not.toHaveBeenCalled()
  })

  it('shows error message with expected message', () => {
    const props = {
      error: {
        noReload: true,
        message: 'Error Message to be displayed',
        nativeError: false,
      },
    }
    const { wrapper } = renderComponent(props)
    expect(wrapper.find('.ErrorMessage')).toHaveLength(1)
    expect(wrapper.find('p').text()).toBe('Error Message to be displayed')
  })

  it('renders error message with reload button', () => {
    const props = {
      error: {
        noReload: false,
        message: 'Error Message with reload button',
      },
    }

    const originalReload = window.location.reload
    // workaround for a known bug in JSDOM reflecting in jest 25
    // https://github.com/facebook/jest/issues/9471
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    })

    Object.defineProperty(window.location, 'reload', {
      writable: true,
      value: jest.fn(),
    })

    const { wrapper } = renderComponent(props)
    expect(wrapper.find('.ErrorMessage')).toHaveLength(1)
    expect(wrapper.find('.Button').text()).toBe('Reload')
    expect(window.location.reload).toHaveBeenCalledTimes(0)
    wrapper.find('.Button').simulate('click')
    expect(window.location.reload).toHaveBeenCalledTimes(1)
    window.location.reload = originalReload
  })

  it('prints stack trace', () => {
    const props = {
      error: {
        noReload: true,
        message: 'Error Message to be displayed',
        nativeError: {
          stack: 'Mocked stack trace',
        },
      },
    }
    const { wrapper } = renderComponent(props)
    expect(wrapper.find('.ErrorMessage-stackTrace')).toHaveLength(1)
    expect(wrapper.find('.ErrorMessage-stackTrace').text()).toBe(
      'Mocked stack trace'
    )
  })

  it('loads Not Found page', () => {
    const props = {
      error: {
        statusCode: 404,
      },
    }
    const { wrapper } = renderComponent(props)
    expect(wrapper.find(NotFound)).toHaveLength(1)
  })

  it('calls handleError in componentDidUpdate if the error changes', () => {
    const props = {
      error: {
        message: 'BANG',
        isOverlay: false,
      },
    }
    const prevProps = {
      error: {
        message: 'NOT BANG',
        isOverlay: false,
      },
    }

    const { wrapper, instance } = renderComponent()
    const handleErrorSpy = jest.spyOn(instance, 'handleError')
    wrapper.setProps(props)
    instance.componentDidUpdate(prevProps)
    expect(handleErrorSpy).toHaveBeenCalled()
  })

  it('does not call handleError in componentDidUpdate if the error does not change', () => {
    const props = {
      error: {
        message: 'BANG',
        isOverlay: false,
      },
    }
    const prevProps = {
      error: {
        message: 'BANG',
        isOverlay: false,
      },
    }

    const { wrapper, instance } = renderComponent()
    const handleErrorSpy = jest.spyOn(instance, 'handleError')
    wrapper.setProps(props)
    instance.componentDidUpdate(prevProps)
    expect(handleErrorSpy).not.toHaveBeenCalled()
  })

  it('calls removeError() when component will receive props', () => {
    const props = {
      modalOpen: true,
      removeError: jest.fn(),
    }
    const nextProps = {
      modalOpen: false,
    }
    const { wrapper } = renderComponent(props)
    wrapper.setProps(nextProps)
    expect(props.removeError).toHaveBeenCalled()
  })
})
