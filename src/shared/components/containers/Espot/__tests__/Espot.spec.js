import deepFreeze from 'deep-freeze'
import testComponentHelper from '../../../../../../test/unit/helpers/test-component'

import Espot from '../Espot'
import SandBox from '../../SandBox/SandBox'

function expectSandboxToRender(wrapper, props) {
  const SandBoxComp = wrapper.find(SandBox)

  expect(SandBoxComp).toHaveLength(1)
  expect(SandBoxComp.props()).toEqual({
    location: { pathname: props.responsiveCMSUrl },
    qubitid: props.qubitid,
    isFinalResponsiveEspotSolution: true,
    shouldGetContentOnFirstLoad: true,
    sandBoxClassName: '',
    contentType: 'espot',
  })
}

describe('<Espot/>', () => {
  const renderComponent = testComponentHelper(Espot.WrappedComponent, {
    disableLifecycleMethods: false,
  })

  const initialProps = deepFreeze({
    responsiveCMSUrl: 'url',
    isMobile: false,
    qubitid: 'qubitid',
    identifier: 'id',
  })

  beforeEach(jest.resetAllMocks)

  describe('@renders', () => {
    it('should not render with content on mobile', () => {
      const { wrapper } = renderComponent({ ...initialProps, isMobile: true })

      expect(wrapper.html()).toBeNull()
    })

    it('should return null if isMobile is true and isResponsive false ', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isMobile: true,
        isResponsive: false,
      })

      expect(wrapper.html()).toBeNull()
    })

    it('should render when isMobile is true and isResponsive is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isMobile: true,
        isResponsive: true,
      })

      expectSandboxToRender(wrapper, initialProps)
    })

    it('should render when isMobile is false and isResponsive is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isMobile: false,
        isResponsive: true,
      })

      expectSandboxToRender(wrapper, initialProps)
    })

    it('should render SandBox when responsiveCMSUrl is present', () => {
      const { wrapper } = renderComponent(initialProps)

      expectSandboxToRender(wrapper, initialProps)
    })

    it('should not render SandBox when responsiveCMSUrl is not present', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        responsiveCMSUrl: '',
      })
      expect(wrapper.find(SandBox)).toHaveLength(0)
    })

    const validGridSize = [1, 2, 3, 4]
    validGridSize.forEach((grid) => {
      it(`should provide Espot--plpCol${grid} as the sandBoxClassName prop to the Sandbox component when grid prop is ${grid}`, () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          customClassName: `Product--col${grid}`,
          grid,
        })
        const SandBoxComp = wrapper.find(SandBox)
        expect(SandBoxComp.prop('sandBoxClassName')).toBe(`Product--col${grid}`)
      })
    })

    const invalidGridSizes = [undefined, null, 100]
    invalidGridSizes.forEach((grid) => {
      it(`should NOT pass down a sandBoxClassName if grid prop is ${grid}`, () => {
        const { wrapper } = renderComponent({ ...initialProps, grid })
        const SandBoxComp = wrapper.find(SandBox)
        expect(SandBoxComp.prop('sandBoxClassName')).toBe('')
      })
    })

    it('Should pass down a sandBox Custom Class name', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        customClassName: 'PlpEspot',
      })
      const SandBoxComp = wrapper.find(SandBox)
      expect(SandBoxComp.prop('sandBoxClassName')).toBe('PlpEspot')
    })
  })
})
