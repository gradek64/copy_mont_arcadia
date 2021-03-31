import testComponentHelper from 'test/unit/helpers/test-component'

import BazaarVoiceWidget from '../BazaarVoiceWidget'

import loadBazaarVoiceApi from '../../../../../lib/load-bazaar-voice-api'
import { scrollElementIntoView } from '../../../../../lib/scroll-helper'

jest.mock('../../../../../lib/load-bazaar-voice-api')
jest.mock('../../../../../lib/scroll-helper', () => ({
  scrollElementIntoView: jest.fn(),
}))

describe('<BazaarVoiceWidget />', () => {
  const renderComponent = testComponentHelper(
    BazaarVoiceWidget.WrappedComponent,
    {
      disableLifecycleMethods: false,
    }
  )

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@componentDidMount', () => {
    let promise
    beforeEach(() => {
      promise = Promise.resolve()
      loadBazaarVoiceApi.mockImplementation(() => promise)
    })
    it('should call scrollToBazaar', async () => {
      const dummyElement = {
        thisIsAnElement: true,
      }
      const getElementById = document.getElementById
      document.getElementById = () => dummyElement

      renderComponent({
        bazaarVoiceEnabled: true,
        location: {
          hash: '#BVReviews',
        },
      })
      await promise
      expect(loadBazaarVoiceApi).toHaveBeenCalledTimes(1)
      expect(scrollElementIntoView).toHaveBeenCalledWith(dummyElement)

      document.getElementById = getElementById
    })
    it('should not call scrollToBazaar when no reviews id in url', async () => {
      renderComponent({
        bazaarVoiceEnabled: true,
        location: {
          hash: '',
        },
      })
      await promise
      expect(loadBazaarVoiceApi).toHaveBeenCalledTimes(1)
      expect(scrollElementIntoView).not.toHaveBeenCalled()
    })
  })

  describe('@componentDidUpdate', () => {
    let promise
    const props = {
      bazaarVoiceEnabled: true,
      lineNumber: 'TS378392783',
      summaryOnly: true,
      containerOnly: true,
      productId: 27921912,
      location: {
        hash: '#BVReviews',
      },
    }

    beforeEach(() => {
      jest.resetAllMocks()
      promise = Promise.resolve()
      loadBazaarVoiceApi.mockImplementation(() => promise)
    })

    it('should call loadBazaarVoiceApi if lineNumber changes', async () => {
      const component = renderComponent(props)
      component.instance.componentDidUpdate({
        ...props,
        lineNumber: '378392783',
      })
      await promise

      expect(loadBazaarVoiceApi).toHaveBeenCalledTimes(2)
    })

    it('should call loadBazaarVoiceApi if summaryOnly changes', async () => {
      const component = renderComponent(props)
      component.instance.componentDidUpdate({
        ...props,
        summaryOnly: false,
      })
      await promise

      expect(loadBazaarVoiceApi).toHaveBeenCalledTimes(2)
    })

    it('should call loadBazaarVoiceApi if containerOnly changes', async () => {
      const component = renderComponent(props)
      component.instance.componentDidUpdate({
        ...props,
        containerOnly: false,
      })
      await promise

      expect(loadBazaarVoiceApi).toHaveBeenCalledTimes(2)
    })
  })

  describe('@renders', () => {
    let promise
    beforeEach(() => {
      promise = Promise.resolve()
      loadBazaarVoiceApi.mockImplementation(() => promise)
    })

    it('should render markup when bazaarVoiceEnabled flag is enabled', () => {
      const { getTree } = renderComponent({
        bazaarVoiceEnabled: true,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should not render summary container if `containerOnly` is `true`', () => {
      const { wrapper } = renderComponent({
        containerOnly: true,
      })
      expect(wrapper.find('#BVRRSummaryContainer').exists()).toBe(false)
    })

    it('should not render container if `summaryOnly` is `true`', () => {
      const { wrapper } = renderComponent({
        summaryOnly: true,
      })
      expect(wrapper.find('#BVRRContainer').exists()).toBe(false)
    })

    it('should render null if `bazaarVoiceEnabled` prop is false', () => {
      const { wrapper } = renderComponent({
        bazaarVoiceEnabled: false,
      })

      expect(wrapper.html()).toBe(null)
    })
  })

  describe('with Bazaarvoice disabled', () => {
    it("shouldn't load bazaarvoice on mount", () => {
      expect(loadBazaarVoiceApi).not.toHaveBeenCalled()
      renderComponent({
        bazaarVoiceEnabled: false,
      })
      expect(loadBazaarVoiceApi).not.toHaveBeenCalled()
    })

    it("shouldn't load bazaarvoice on update", () => {
      expect(loadBazaarVoiceApi).not.toHaveBeenCalled()
      const { wrapper } = renderComponent({
        bazaarVoiceEnabled: false,
      })
      wrapper.setProps({
        bazaarVoiceEnabled: false,
        containerOnly: false,
      })
      expect(loadBazaarVoiceApi).not.toHaveBeenCalled()
    })
  })
  describe('with Bazaarvoice enabled', () => {
    beforeEach(() => {
      loadBazaarVoiceApi.mockImplementation(() => Promise.resolve())
    })

    it('should load bazaarvoice on mount', () => {
      expect(loadBazaarVoiceApi).not.toHaveBeenCalled()
      renderComponent({
        bazaarVoiceEnabled: true,
      })
      expect(loadBazaarVoiceApi).toHaveBeenCalledTimes(1)
    })

    it('should load bazaarvoice on update', () => {
      expect(loadBazaarVoiceApi).not.toHaveBeenCalled()
      const { wrapper } = renderComponent({
        bazaarVoiceEnabled: true,
        containerOnly: true,
      })
      wrapper.setProps({
        containerOnly: false,
      })
      expect(loadBazaarVoiceApi).toHaveBeenCalledTimes(2)
    })
  })
})
