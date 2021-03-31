import testComponentHelper from 'test/unit/helpers/test-component'
import SizeGuideDrawer from '../SizeGuideDrawer'
import SandBox from '../../../containers/SandBox/SandBox'

describe('<SizeGuideDrawer/>', () => {
  const renderComponent = testComponentHelper(SizeGuideDrawer.WrappedComponent)
  const requiredProps = {
    sizeGuideType: 'example',
  }

  describe('@render', () => {
    it('should pass the correct props to the sandbox', () => {
      const { wrapper } = renderComponent(requiredProps)
      const sandbox = wrapper.find(SandBox)

      expect(sandbox).toHaveLength(1)

      expect(Object.keys(sandbox.props()).length).toBe(5)

      expect(sandbox.prop('isInPageContent')).toEqual(true)
      expect(sandbox.prop('cmsPageName')).toEqual('example')
      expect(sandbox.prop('shouldGetContentOnFirstLoad')).toEqual(true)
      expect(sandbox.prop('contentType')).toEqual('page')
      expect(sandbox.prop('forceMobile')).toEqual(true)
    })
  })
})
