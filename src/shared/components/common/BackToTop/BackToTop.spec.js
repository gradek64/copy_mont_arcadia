import testComponentHelper from 'test/unit/helpers/test-component'
import BackToTop from './BackToTop'
import Button from '../Button/Button'
import { scrollToTop } from '../../../lib/scroll-helper'

global.window.addEventListener = jest.fn()
global.window.removeEventListener = jest.fn()
global.document.getElementsByClassName = jest.fn()
jest.mock('../../../actions/common/infinityScrollActions', () => ({
  removeHiddenPages: () => {},
}))
jest.mock('../../../lib/scroll-helper', () => ({
  scrollToTop: jest.fn(),
}))

describe('<BackToTop />', () => {
  const renderComponent = testComponentHelper(BackToTop.WrappedComponent)
  const initialProps = {
    setVisible: jest.fn(),
  }
  describe('@renders', () => {
    it('in default state', () => {
      const { wrapper, getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('.BackToTop-returnButton').length).toBe(1)
      expect(
        wrapper.find('.BackToTop-returnButton').hasClass('is-visible')
      ).toBe(false)
      expect(wrapper.find('.BackToTop-arrow').length).toBe(1)
      expect(wrapper.find('.BackToTop-label').length).toBe(1)
      expect(wrapper.find('.BackToTop-content').length).toBe(1)
    })
    it('in visible state', () => {
      const { wrapper, getTree } = renderComponent({
        ...initialProps,
        hasPassedThreshold: true,
      })
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('.BackToTop-returnButton').length).toBe(1)
      expect(
        wrapper.find('.BackToTop-returnButton').hasClass('is-visible')
      ).toBe(true)
    })
  })
  describe('@events', () => {
    describe('on click button', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      it('calls removeHiddenPages with true if isPlp', () => {
        const removeHiddenPagesMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          isPlp: true,
          hasPassedThreshold: true,
          removeHiddenPages: removeHiddenPagesMock,
        })

        wrapper.find(Button).prop('clickHandler')()

        expect(scrollToTop).toHaveBeenCalledTimes(1)
        expect(scrollToTop).toHaveBeenCalledWith(200)

        expect(removeHiddenPagesMock).toHaveBeenCalledTimes(1)
        expect(removeHiddenPagesMock).toHaveBeenCalledWith(true)
      })

      it('calls removeHiddenPages with false if isPlp is false', () => {
        const removeHiddenPagesMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          hasPassedThreshold: true,
          removeHiddenPages: removeHiddenPagesMock,
        })

        wrapper.find(Button).prop('clickHandler')()

        expect(scrollToTop).toHaveBeenCalledTimes(1)
        expect(scrollToTop).toHaveBeenCalledWith(200)

        expect(removeHiddenPagesMock).toHaveBeenCalledTimes(1)
        expect(removeHiddenPagesMock).toHaveBeenCalledWith(false)
      })
    })
  })
})
