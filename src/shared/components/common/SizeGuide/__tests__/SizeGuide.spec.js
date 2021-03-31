import testComponentHelper from 'test/unit/helpers/test-component'
import SizeGuide from '../SizeGuide'

import {
  getMatchingAttribute,
  checkIfOneSizedItem,
} from '../../../../lib/product-utilities'

jest.mock('../../../../lib/product-utilities', () => ({
  getMatchingAttribute: jest.fn(),
  checkIfOneSizedItem: jest.fn(),
}))

describe('<SizeGuide/>', () => {
  const renderComponent = testComponentHelper(SizeGuide.WrappedComponent)
  const showSizeGuideMock = jest.fn()
  const setSizeGuideMock = jest.fn()
  const requiredProps = {
    reference: 'DefaultSizeGuide',
    type: 'pdp',
    showSizeGuide: showSizeGuideMock,
    setSizeGuide: setSizeGuideMock,
    openDrawer: false,
    items: [],
  }

  describe('@events', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      checkIfOneSizedItem.mockImplementation(() => false)
      getMatchingAttribute.mockImplementation(() => 'SizeGuideReference')
    })

    it('click on size guide link should open sizeGuide in drawer when openDrawer is true', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        openDrawer: true,
      })
      const preventDefault = jest.fn()
      expect(showSizeGuideMock).not.toHaveBeenCalled()
      expect(setSizeGuideMock).not.toHaveBeenCalled()
      expect(preventDefault).not.toHaveBeenCalled()
      wrapper.find('.SizeGuide-link').prop('onClick')({ preventDefault })
      expect(preventDefault).toHaveBeenCalledTimes(1)
      expect(showSizeGuideMock).toHaveBeenCalledTimes(1)
      expect(setSizeGuideMock).toHaveBeenCalledTimes(1)
      expect(setSizeGuideMock).toHaveBeenCalledWith('SizeGuideReference')
    })

    it('click on size guide link should not open sizeGuide in drawer when openDrawer is false', () => {
      const { wrapper } = renderComponent({ ...requiredProps })
      const preventDefault = jest.fn()
      wrapper.find('.SizeGuide-link').prop('onClick')({ preventDefault })
      expect(showSizeGuideMock).not.toHaveBeenCalled()
      expect(preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('@render', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('with type bundles', () => {
      getMatchingAttribute.mockImplementation(() => 'AnotherSizeGuideReference')

      const { wrapper } = renderComponent({
        ...requiredProps,
        type: 'bundles',
      })
      expect(wrapper.find('.SizeGuide--bundles')).toHaveLength(1)
    })

    it('with size guide box class when given displayAsBox true', () => {
      getMatchingAttribute.mockImplementation(() => 'AnotherSizeGuideReference')

      const { wrapper } = renderComponent({
        ...requiredProps,
        displayAsBox: true,
      })

      expect(wrapper.find('.SizeGuide--box')).toHaveLength(1)
    })

    it('with size guide box class when given displayAsBox false', () => {
      getMatchingAttribute.mockImplementation(() => 'AnotherSizeGuideReference')

      const { wrapper } = renderComponent({
        ...requiredProps,
        displayAsBox: false,
      })

      expect(wrapper.find('.SizeGuide--box')).toHaveLength(0)
    })

    it('with size guides when product has more than one size', () => {
      getMatchingAttribute.mockImplementation(() => 'AnotherSizeGuideReference')

      checkIfOneSizedItem.mockImplementation(() => false)
      const { wrapper } = renderComponent(requiredProps)

      expect(wrapper.find('.SizeGuide')).toHaveLength(1)
    })

    it('without have size guides for one sized products', () => {
      checkIfOneSizedItem.mockImplementation(() => true)

      const { wrapper } = renderComponent(requiredProps)

      expect(wrapper.find('.SizeGuide')).toHaveLength(0)
    })

    it('without size guides for NoSizeGuide reference', () => {
      checkIfOneSizedItem.mockImplementation(() => false)
      getMatchingAttribute.mockImplementation(() => 'NoSizeGuide')

      const { wrapper } = renderComponent(requiredProps)

      expect(wrapper.find('.SizeGuide')).toHaveLength(0)
    })

    it('should return null with reference as NoSizeGuide', () => {
      getMatchingAttribute.mockImplementation(() => 'NoSizeGuide')

      const { wrapper } = renderComponent({
        ...requiredProps,
        reference: 'NoSizeGuide',
      })
      expect(wrapper.type()).toBeNull()
    })

    it('should return null if reference is an empty string', () => {
      getMatchingAttribute.mockImplementation(() => '')
      const { wrapper } = renderComponent({ showSizeGuide: jest.fn() })
      expect(wrapper.type()).toBeNull()
    })

    it('should return null if reference is undefined', () => {
      getMatchingAttribute.mockImplementation(() => undefined)
      const { wrapper } = renderComponent({ showSizeGuide: jest.fn() })
      expect(wrapper.type()).toBeNull()
    })

    it('with size guide link', () => {
      getMatchingAttribute.mockImplementation(() => 'SizeGuideReference')

      const { wrapper } = renderComponent(requiredProps)

      expect(wrapper.find('.SizeGuide-link').prop('to')).toEqual(
        '/size-guide/SizeGuideReference'
      )
    })
  })
})
