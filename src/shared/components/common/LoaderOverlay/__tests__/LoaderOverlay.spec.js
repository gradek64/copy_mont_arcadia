import React from 'react'
import { shallow } from 'enzyme'
import testComponentHelper, {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'

import LoaderOverlay from '../LoaderOverlay'
import AccessibleText from '../../AccessibleText/AccessibleText'
import configureStore from 'redux-mock-store'

describe('<LoaderOverlay />', () => {
  const renderComponent = testComponentHelper(LoaderOverlay.WrappedComponent)

  let originalQuerySelectorAll

  beforeEach(() => jest.resetAllMocks())

  beforeAll(() => {
    originalQuerySelectorAll = global.document.querySelectorAll
  })

  afterAll(() => {
    global.document.querySelectorAll = originalQuerySelectorAll
  })

  describe('@connects', () => {
    it('should receive correct props', () => {
      const initialState = {
        loaderOverlay: {
          visible: true,
        },
      }
      const container = shallow(
        <LoaderOverlay store={configureStore()(initialState)} />
      )
      expect(container).toBeTruthy()
      expect(container.prop('loaderOpen')).toBe(
        initialState.loaderOverlay.visible
      )
    })
  })

  describe('@renders', () => {
    it('should render without is-shown class', () => {
      const { wrapper } = renderComponent()
      const loaderOverlay = wrapper.find('.LoaderOverlay')
      expect(loaderOverlay).toBeTruthy()
      expect(loaderOverlay.hasClass('is-shown')).toBe(false)
    })

    it('should add ‘is-shown’ class and set ‘aria-busy’ attribute to ‘true’ if `loaderOpen` is `true`', () => {
      const { wrapper } = renderComponent({
        loaderOpen: true,
      })
      const loaderOverlay = wrapper.find('.LoaderOverlay')
      expect(loaderOverlay.hasClass('is-shown')).toBe(true)
      expect(loaderOverlay.prop('aria-busy')).toBe(true)
    })

    it('sets loader ref', () => {
      const renderComponent = buildComponentRender(
        mountRender,
        LoaderOverlay.WrappedComponent
      )
      const { instance } = renderComponent()
      expect(instance.loader).toBeTruthy()
      expect(instance.loader).toBeInstanceOf(AccessibleText)
    })

    it('should render with classNames passed from parent component', () => {
      const { wrapper } = renderComponent({
        className: 'top-loader',
      })
      const loaderOverlay = wrapper.find('.LoaderOverlay')
      expect(loaderOverlay.hasClass('top-loader')).toBe(true)
    })
  })

  describe('@willReceiveProps', () => {
    it('focuses on the first element when closed', () => {
      const { instance } = renderComponent()
      const focusMock = jest.fn()
      const querySelectorAllMock = jest.fn(() => [
        {
          focus: focusMock,
        },
      ])
      global.document.querySelectorAll = querySelectorAllMock
      instance.UNSAFE_componentWillReceiveProps({ loaderOpen: false })
      expect(focusMock).toHaveBeenCalledTimes(1)
    })
    it('focuses on the loader when open', () => {
      const { instance } = renderComponent()
      const querySelectorAllMock = jest.fn(() => [])
      const loaderFocusMock = jest.fn()
      global.document.querySelectorAll = querySelectorAllMock
      instance.loader = {
        focus: loaderFocusMock,
      }
      instance.UNSAFE_componentWillReceiveProps({ loaderOpen: true })
      expect(loaderFocusMock).toHaveBeenCalledTimes(1)
    })
  })
})
