import testComponentHelper, {
  mockLocalise,
} from 'test/unit/helpers/test-component'
import BrandLogo from '../BrandLogo'

describe('<BrandLogo/>', () => {
  const initialProps = {
    brandName: 'topshop',
    className: 'class1',
    logoVersion: '0808080',
    imageAlt: 'topshop homepage',
  }

  const mountOptions = {
    context: {
      l: jest.fn(mockLocalise),
    },
  }

  const renderComponent = testComponentHelper(BrandLogo, mountOptions)

  describe('@renders', () => {
    it('should render correct default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    describe('logo', () => {
      it('should be responsive', () => {
        const props = { ...initialProps, hasResponsive: true }
        expect(renderComponent(props).getTree()).toMatchSnapshot()
      })

      it('should be regional', () => {
        const props = {
          ...initialProps,
          isRegionSpecific: true,
          region: 'eu',
        }
        expect(renderComponent(props).getTree()).toMatchSnapshot()
      })

      it('should render without a region, when region is uk', () => {
        const props = {
          ...initialProps,
          isRegionSpecific: true,
          region: 'uk',
        }
        expect(renderComponent(props).getTree()).toMatchSnapshot()
      })

      it('should be regional and responsive', () => {
        const props = {
          ...initialProps,
          hasResponsive: true,
          isRegionSpecific: true,
          region: 'eu',
        }
        expect(renderComponent(props).getTree()).toMatchSnapshot()
      })
    })
  })
})
