import testComponentHelper from 'test/unit/helpers/test-component'
import FooterNavigation from '../FooterNavigation'
import footerCol3Img2Lg from '../../../../../../server/handlers/mocks/footer-3-category-cols-2-large-image-cols.json'
import footerCol4Img1Sm from '../../../../../../server/handlers/mocks/footer-4-category-cols-1-small-images-col.json'

const initialProps = {
  footerCategories: [footerCol4Img1Sm.categories[0]],
}
const link = footerCol4Img1Sm.categories[0].links[0]

describe('<FooterNavigation />', () => {
  const renderComponent = testComponentHelper(FooterNavigation)

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('displays category title', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.FooterNavigation-categoryTitle')).toHaveLength(1)
    })

    it('displays a column with 8 text links', () => {
      const { instance, wrapper } = renderComponent(initialProps)
      instance.getTextLink = jest.fn()
      instance.render()
      expect(instance.getTextLink).toHaveBeenCalledTimes(8)
      expect(wrapper.find('.FooterNavigation-textLink')).toHaveLength(8)
    })

    it('displays a column with 1 large image link', () => {
      const footerCategories = [footerCol3Img2Lg.categories[4]]
      const { instance, wrapper } = renderComponent({ footerCategories })
      instance.getImageLink = jest.fn()
      instance.render()
      expect(instance.getImageLink).toHaveBeenCalledTimes(1)
      expect(wrapper.find('.FooterNavigation-imageLarge')).toHaveLength(1)
      expect(wrapper.find('.FooterNavigation-imageLink').props().to).toBe(
        footerCategories[0].images[0].linkUrl
      )
    })

    it('displays a column with 2 small image links', () => {
      const { instance, wrapper } = renderComponent({
        footerCategories: [footerCol4Img1Sm.categories[4]],
      })
      instance.getImageLink = jest.fn()
      instance.render()
      expect(instance.getImageLink).toHaveBeenCalledTimes(2)
      expect(wrapper.find('.FooterNavigation-imageSmall')).toHaveLength(2)
    })

    it('link should open in a new window if openNewWindow is true', () => {
      link.openNewWindow = true
      const { wrapper } = renderComponent({
        footerCategories: [{ links: [link] }],
      })
      expect(wrapper.find('.FooterNavigation-textLink').prop('target')).toBe(
        '_blank'
      )
    })

    it('link should not set target prop when openNewWindow is false and linkUrl is not a yext domain', () => {
      link.openNewWindow = false
      const { wrapper } = renderComponent({
        footerCategories: [{ links: [link] }],
      })
      expect(wrapper.find('.FooterNavigation-textLink').prop('target')).toBe(
        null
      )
    })

    it("should set target prop to '_self' when openNewWindow is false and linkUrl begins with http", () => {
      link.openNewWindow = false
      link.linkUrl = 'https://stores.topshop.com/'
      const { wrapper } = renderComponent({
        footerCategories: [{ links: [link] }],
      })
      expect(wrapper.find('.FooterNavigation-textLink').prop('target')).toBe(
        '_self'
      )
    })

    describe('when click on a link', () => {
      describe('and link label match `Manage Cookies` copy and cookiemanager is enabled and truste third party is on window object', () => {
        it('should prevent link href and call truste event handler', () => {
          const clickListener = jest.fn()
          global.window.truste = { eu: { clickListener } }
          const event = { preventDefault: jest.fn() }
          const mockManageCookiesLink = {
            label: 'Manage Cookies',
            linkUrl: '#',
          }
          const footerCategories = [
            {
              ...footerCol4Img1Sm.categories[1],
              links: footerCol4Img1Sm.categories[1].links.concat(
                mockManageCookiesLink
              ),
            },
          ]
          const { wrapper } = renderComponent({
            footerCategories,
            isCookieManagerEnabled: true,
          })
          const cookieLink = wrapper
            .find('.FooterNavigation-textLink')
            .findWhere(
              (ele) => ele.props().children === mockManageCookiesLink.label
            )

          cookieLink.simulate('click', event)
          expect(clickListener).toHaveBeenCalled()
          expect(event.preventDefault).toHaveBeenCalled()
          delete global.window.truste
        })
      })
    })

    describe('when the linkUrl is encoded', () => {
      it('should render the `<Link />` with the `to` prop value decoded', () => {
        const links = [
          {
            label: 'Miss S Mastercard',
            linkUrl: '/en/tsuk/home?cat2=someValue&amp;intcmpid=newdaypdp',
          },
        ]

        const { wrapper } = renderComponent({
          footerCategories: [{ links }],
        })
        expect(
          wrapper
            .find('Link')
            .first()
            .prop('to')
        ).toBe('/en/tsuk/home?cat2=someValue&intcmpid=newdaypdp')
      })
    })
  })
})
