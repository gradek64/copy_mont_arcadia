import {
  buildComponentRender,
  shallowRender,
} from 'test/unit/helpers/test-component'
import PlpHeader from '../PlpHeader'

describe('<PlpHeader />', () => {
  const renderComponent = buildComponentRender(shallowRender, PlpHeader)
  const initialProps = {
    title: 'Jeans',
    total: '492',
    isDynamicTitle: true,
    showCatHeaderForMobile: jest.fn(),
    showCatHeaderForDesktop: jest.fn(),
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('renders responsive category header', () => {
      const responsiveCatHeader = renderComponent({
        ...initialProps,
        catHeaderResponsiveCmsUrl: '/url/to/catheader/cms/template',
      })

      expect(responsiveCatHeader.getTree()).toMatchSnapshot()
    })
  })

  describe('Not mobile and responsive', () => {
    const notMobileProps = {
      ...initialProps,
      catHeaderResponsiveCmsUrl: '/url/to/catheader/cms/template',
    }
    let wrapper
    let ConnectedSandbox

    beforeEach(() => {
      ;({ wrapper } = renderComponent(notMobileProps))
      ConnectedSandbox = wrapper.find('Connect')
    })

    it('should render connected sandbox component', () => {
      expect(ConnectedSandbox).not.toBeNull()
    })

    it('should render connected sandbox with correct props', () => {
      expect(wrapper.props().children.props).toEqual({
        cmsPageName: 'catHeader',
        location: { pathname: '/url/to/catheader/cms/template' },
        shouldGetContentOnFirstLoad: true,
        isResponsiveCatHeader: true,
        isInPageContent: true,
      })
    })
  })

  describe('Mobile Header', () => {
    const rendersMobileWithExpectedTitle = (wrapper, title) =>
      it('renders mobile header with correct title', () => {
        expect(wrapper.find('.PlpHeader-title').text()).toEqual(title)
      })
    const rendersMobileWithExpectedTotal = (wrapper, total) =>
      it('renders mobile header with correct total', () => {
        expect(wrapper.find('.PlpHeader-totalValue').text()).toEqual(total)
      })
    const rendersMobileWithExpectedLabel = (wrapper) =>
      it('renders mobile header with correct label', () => {
        expect(wrapper.find('.PlpHeader-totalLabel').text()).toEqual(`results`)
      })

    describe('isMobile is true', () => {
      const props = {
        ...initialProps,
        isMobile: true,
      }
      const { wrapper } = renderComponent(props)

      rendersMobileWithExpectedTitle(wrapper, initialProps.title)
      rendersMobileWithExpectedTotal(wrapper, initialProps.total)
      rendersMobileWithExpectedLabel(wrapper)
    })

    describe('catHeaderResponsiveCmsUrl is undefined', () => {
      const props = {
        ...initialProps,
      }
      const { wrapper } = renderComponent(props)

      rendersMobileWithExpectedTitle(wrapper, initialProps.title)
      rendersMobileWithExpectedTotal(wrapper, initialProps.total)
      rendersMobileWithExpectedLabel(wrapper)
    })

    describe('falls back to categoryTitle if title is undefined or empty', () => {
      const props = {
        ...initialProps,
        title: '',
        categoryTitle: 'One Season Wonder',
      }
      const { wrapper } = renderComponent(props)

      rendersMobileWithExpectedTitle(wrapper, props.categoryTitle)
      rendersMobileWithExpectedTotal(wrapper, initialProps.total)
      rendersMobileWithExpectedLabel(wrapper)
    })

    describe('isDynamicTitle feature flag is disabled', () => {
      const props = {
        ...initialProps,
        isDynamicTitle: false,
        title: 'dynamic title',
        categoryTitle: 'Fallback Title',
      }
      const { wrapper } = renderComponent(props)

      rendersMobileWithExpectedTitle(wrapper, props.categoryTitle)
      rendersMobileWithExpectedTotal(wrapper, initialProps.total)
      rendersMobileWithExpectedLabel(wrapper)
    })
  })
  describe('showCatHeader feature', () => {
    const props = {
      ...initialProps,
      catHeaderResponsiveCmsUrl: '/url/to/catheader/cms/template',
    }
    it('renders the sandbox component if showCatHeaderForDesktop is true', () => {
      const { wrapper } = renderComponent({
        ...props,
        isMobile: false,
        showCatHeaderForDesktop: true,
      })
      expect(wrapper.find('Connect(SandBox)').length).toEqual(1)
      expect(wrapper.find('.PlpHeader').length).toEqual(0)
    })
    it('renders the sandbox component if showCatHeaderForMobile is true and isMobile is true', () => {
      const { wrapper } = renderComponent({
        ...props,
        isMobile: true,
        showCatHeaderForMobile: true,
      })
      expect(wrapper.find('Connect(SandBox)').length).toEqual(1)
      expect(wrapper.find('.PlpHeader').length).toEqual(0)
    })
    it('renders the PlpHeader component if showCatHeaderForMobile is false and isMobile is true', () => {
      const { wrapper } = renderComponent({
        ...props,
        isMobile: true,
        showCatHeaderForMobile: false,
      })
      expect(wrapper.find('Connect(SandBox)').length).toEqual(0)
      expect(wrapper.find('.PlpHeader').length).toEqual(1)
    })
    it('renders the Sandbox component if showCatHeaderForDesktop is false and isMobile is false', () => {
      const { wrapper } = renderComponent({
        ...props,
        isMobile: false,
        showCatHeaderForDesktop: false,
      })
      expect(wrapper.find('Connect(SandBox)').length).toEqual(1)
      expect(wrapper.find('.PlpHeader').length).toEqual(0)
    })
  })
})
