import {
  buildComponentRender,
  shallowRender,
} from '../../../../../../test/unit/helpers/test-component'

import Category from '../Category'
import Link from '../../../common/Link'

const requiredProps = {
  category: {
    categoryId: '12345',
    url: 'http://www.topman.com',
    redirectionUrl:
      '/en/tsuk/category/new-in-this-week-2169932/new-in-fashion-6367514/N-8d7Zdgl?No=0&Nrpp=20&siteId=%2F12556',
    columns: [
      {
        span: '0',
        subcategories: {
          0: {
            newIn: [
              { image: { span: 'footer' } },
              { label: 'something to buy' },
            ],
          },
        },
      },
      {
        span: '1',
        subcategories: {
          0: {
            jeans: [{ image: { span: 'footer' } }, { label: 'blue jeans' }],
            0: [{ image: { span: 1 } }, { label: 'red jeans' }],
          },
        },
      },
      {
        span: '2',
        subcategories: {
          0: {
            socks: [{ label: 'winter socks' }],
            jeans: [{ image: { url: '' } }],
          },
        },
      },
    ],
  },
  apiEnvironment: 'prod',
  isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled: true,
  onHoverCategory: jest.fn(),
  unselectCategory: jest.fn(),
  touchEnabled: false,
}

const renderComponent = buildComponentRender(shallowRender, Category)

describe('<Category />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@renders', () => {
    beforeEach(() => jest.clearAllMocks())

    it('should not render links for touch devices', () => {
      const props = {
        ...requiredProps,
        touchEnabled: true,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('should render links for touch devices if sub category columns is empty', () => {
      expect(
        renderComponent({
          ...requiredProps,
          category: { columns: [], label: 'category' },
          touchEnabled: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should not render sub category if columns is empty', () => {
      expect(
        renderComponent({
          ...requiredProps,
          category: { columns: [], label: 'category' },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render correct state and css classes when touchDetection is true', () => {
      const props = {
        ...requiredProps,
        touchEnabled: true,
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper
          .find('li')
          .at(0)
          .hasClass('MegaNav-category--isTouch')
      ).toBe(true)
    })

    it('should render correct state and css classes when touchDetection is false', () => {
      const { wrapper } = renderComponent(requiredProps)
      expect(
        wrapper
          .find('li')
          .at(0)
          .hasClass('MegaNav-category--isNotTouch')
      ).toBe(true)
    })

    it('should render without a className categoryId', () => {
      expect(
        renderComponent({ ...requiredProps, categoryId: '' }).getTree()
      ).toMatchSnapshot()
    })

    it('should render for touch device with no sub categories', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        category: {
          categoryId: '12345',
          columns: [],
        },
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render hyperlink if url associated to the category is /blog/', () => {
      const blogCategoryProps = {
        category: {
          url: '/blog/',
          columns: [],
        },
      }
      const { wrapper } = renderComponent(blogCategoryProps)

      const categoryLink = wrapper.find(Link)
      expect(categoryLink.length).toBe(1)
      expect(categoryLink.props().to).toBe('/blog/')
      expect(categoryLink.props().isExternal).toBe(true)
    })

    it('should render Link if url associated to the category is not blog /blog/', () => {
      const blogCategoryProps = {
        category: {
          url: '/notBlog',
          columns: [],
        },
      }
      const { wrapper } = renderComponent(blogCategoryProps)

      expect(wrapper.find('Link').length).toBe(1)
      expect(wrapper.find('Link').props().to).toBe('/notBlog')
    })
  })

  describe('@Methods', () => {
    describe('getUrl()', () => {
      beforeEach(() => jest.clearAllMocks())

      it('should return the redirectionUrl value if prop isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled is false', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          apiEnvironment: 'prod',
          isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled: false,
        })

        const redirectionUrl = requiredProps.category.redirectionUrl
        const toLink = wrapper.find(Link).props().to

        expect(toLink).toEqual(redirectionUrl)
      })

      it('should return the redirectionUrl value if prop isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled is not present', () => {
        const props = {
          ...requiredProps,
        }
        delete props.isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled

        const { wrapper } = renderComponent({
          ...props,
          apiEnvironment: 'prod',
          isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled: false,
        })

        const redirectionUrl = requiredProps.category.redirectionUrl
        const toLink = wrapper.find(Link).props().to

        expect(toLink).toEqual(redirectionUrl)
      })

      it('should return the url value if prop isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled is true', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          apiEnvironment: 'prod',
          isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled: true,
        })

        const url = requiredProps.category.url
        const toLink = wrapper.find(Link).props().to

        expect(toLink).toEqual(url)
      })
    })
  })

  describe('@Events', () => {
    describe('mouseenter', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      it('calls onHoverCategory onMouseEnter', () => {
        const { wrapper } = renderComponent(requiredProps)

        expect(requiredProps.onHoverCategory).toHaveBeenCalledTimes(0)
        wrapper.find('li').simulate('mouseenter')
        expect(requiredProps.onHoverCategory).toHaveBeenCalledTimes(1)
      })

      it('calls onHoverCategory ', () => {
        const props = {
          ...requiredProps,
          isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled: false,
          touchEnabled: true,
        }
        const { wrapper } = renderComponent(props)

        expect(requiredProps.onHoverCategory).toHaveBeenCalledTimes(0)
        wrapper.find('span').simulate('touchstart')
        expect(requiredProps.onHoverCategory).toHaveBeenCalledTimes(1)
        expect(requiredProps.onHoverCategory).toHaveBeenCalledWith({
          categoryId: '12345',
          categoryUrl:
            '/en/tsuk/category/new-in-this-week-2169932/new-in-fashion-6367514/N-8d7Zdgl?No=0&Nrpp=20&siteId=%2F12556',
        })
      })
    })
  })
})
