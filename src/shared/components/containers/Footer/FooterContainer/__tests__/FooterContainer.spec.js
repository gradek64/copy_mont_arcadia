import testComponentHelper from 'test/unit/helpers/test-component'
import FooterContainer from '../FooterContainer'
import FooterNewsletter from '../../FooterNewsletter/FooterNewsletter'
import FooterSocialLinks from '../../FooterSocialLinks/FooterSocialLinks'
import { getFooterConfig } from '../../../../../../server/config/footer_config'

const initialProps = {
  brandName: 'topshop',
  isInCheckout: false,
  footerConfig: getFooterConfig('topshop', 'uk'),
}

describe('<FooterContainer />', () => {
  const renderComponent = testComponentHelper(FooterContainer.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })

    describe(`when newsletter and social icons have location as 'TOP_CENTER' in footer config`, () => {
      const props = {
        ...initialProps,
        brandName: 'dorothyperkins',
        footerConfig: getFooterConfig('dorothyperkins', 'uk'),
      }

      it('elements should have centering classes', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find('.FooterContainer-topSectionCentered').length).toBe(
          1
        )
        expect(
          wrapper.find('.FooterContainer-socialLinksTopCentered').length
        ).toBe(1)
        expect(
          wrapper.find('.FooterContainer-socialLinksTopCenteredProp').length
        ).toBe(1)
        expect(
          wrapper.find('.FooterContainer-newsletterTopCentered').length
        ).toBe(1)
      })
    })

    describe(`when newsletter and social icons do NOT have location as 'TOP_CENTER' in footer config`, () => {
      const props = {
        ...initialProps,
        brandName: 'burton',
        footerConfig: getFooterConfig('burton', 'uk'),
      }

      it('elements should NOT have centering classes', () => {
        const { wrapper } = renderComponent(props)
        expect(wrapper.find('.FooterContainer-topSectionCentered').length).toBe(
          0
        )
        expect(
          wrapper.find('.FooterContainer-socialLinksTopCentered').length
        ).toBe(0)
        expect(
          wrapper.find('.FooterContainer-socialLinksTopCenteredProp').length
        ).toBe(0)
        expect(
          wrapper.find('.FooterContainer-newsletterTopCentered').length
        ).toBe(0)
      })
    })

    describe('when pageType prop is set', () => {
      it('should hide the footer container with a class if plp', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          pageType: 'plp',
          totalProducts: 10,
        })

        expect(wrapper.find('.FooterContainer--hidden').length).toBe(1)
      })

      it('should not hide the footer if plp no products page', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          pageType: 'plp',
          totalProducts: 0,
        })

        expect(wrapper.find('.FooterContainer--hidden').length).toBe(0)
      })

      it('should not hide the footer container with a class if not plp', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          pageType: 'pdp',
        })

        expect(wrapper.find('.FooterContainer--hidden').length).toBe(0)
      })
    })

    describe('`newsletter.isVisible` property in footer_config', () => {
      it('FooterNewsletter should render if newsletter.isVisible is truthy and isInCheckout is false', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find(FooterNewsletter).length).toBe(1)
      })
      it('FooterNewsletter should not render if isInCheckout is true', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isInCheckout: true,
        })
        expect(wrapper.find(FooterNewsletter).exists()).toBe(false)
      })
      it('FooterNewsletter should NOT render if newsletter.isVisible is falsey', () => {
        const footerConfig = getFooterConfig('burton', 'uk')
        const props = {
          ...initialProps,
          brandName: 'burton',
          footerConfig: {
            ...footerConfig,
            newsletter: {
              ...footerConfig.newsletter,
              isVisible: false,
            },
          },
        }

        const { wrapper } = renderComponent(props)
        expect(wrapper.find(FooterNewsletter).length).toBe(0)
      })
    })

    describe('`socialLinks.isVisible` property in footer_config', () => {
      it('FooterSocialLinks should render if newsletter.isVisible is truthy', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find(FooterSocialLinks).length).toBe(1)
      })
      it('FooterSocialLinks should NOT render if newsletter.isVisible is falsey', () => {
        const footerConfig = getFooterConfig('burton', 'uk')
        const props = {
          ...initialProps,
          brandName: 'burton',
          footerConfig: {
            ...footerConfig,
            socialLinks: {
              ...footerConfig.socialLinks,
              isVisible: false,
            },
          },
        }

        const { wrapper } = renderComponent(props)
        expect(wrapper.find(FooterSocialLinks).length).toBe(0)
      })
    })

    describe('bottomContentSection instance method', () => {
      it('should render correct content', () => {
        const { instance } = renderComponent(initialProps)
        const footerConfig = getFooterConfig('dorothyperkins', 'uk')
        const left = instance.bottomContentSection(
          footerConfig.bottomContent,
          'left'
        )
        const right = instance.bottomContentSection(
          footerConfig.bottomContent,
          'right'
        )
        expect(left).toMatchSnapshot()
        expect(right).toMatchSnapshot()
      })
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      it('should call getfootercontent if desktop and client', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['/', '/prova'],
          isMobile: false,
          getFooterContent: jest.fn(),
        })
        instance.componentDidMount()
        expect(instance.props.getFooterContent).toHaveBeenCalledTimes(1)
      })
    })
  })
})
