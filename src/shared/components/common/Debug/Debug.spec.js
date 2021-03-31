import Debug from './Debug'
import testComponentHelper from '../../../../../test/unit/helpers/test-component'

describe('<Debug/>', () => {
  const initialProps = {
    debugInfo: {
      environment: 'tst1',
      buildInfo: {
        date: 'Wed, 19 Feb 2020 13:14:39 +0000',
        hash: '468acb5251804b2912bd4804ec1c4b69ef7482e8',
        tag: 'v3.96.3',
        version: '3.96.3 (package.json)',
      },
      isAllowed: true,
      isShown: true,
      montyVisualIndicatorVisible: true,
    },
    featureStatus: {
      FEATURE1: true,
      FEATURE2: false,
      FEATURE3: true,
      FEATURE4: false,
    },
    featureOverrides: {
      FEATURE3: true,
      FEATURE4: false,
    },
  }
  const renderComponent = testComponentHelper(Debug.WrappedComponent)
  describe('@renders', () => {
    it('in a default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    it('should call hideDebug prop when close button is clicked', () => {
      const mockHideDebug = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        hideDebug: mockHideDebug,
      })

      wrapper.find('.Debug-close').simulate('click')
      expect(mockHideDebug).toHaveBeenCalled()
    })
    it('should call resetFeatures prop when button is clicked', () => {
      const mockResetFeatures = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        resetFeatures: mockResetFeatures,
      })

      wrapper.find('#reset-features-button').simulate('click')
      expect(mockResetFeatures).toHaveBeenCalled()
    })
  })
})
