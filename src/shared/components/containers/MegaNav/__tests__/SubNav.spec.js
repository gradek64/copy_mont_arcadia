import {
  buildComponentRender,
  shallowRender,
} from '../../../../../../test/unit/helpers/test-component'

import SubNav from '../SubNav'

const renderComponent = buildComponentRender(shallowRender, SubNav)

describe('SubNav', () => {
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
    unSelectCategory: () => {},
    hideMegaNav: () => {},
    unselectCategory: () => {},
  }

  describe('@render', () => {
    it('should render all the columns passed with show class and the footer', () => {
      const newProps = { ...requiredProps, isActive: true }
      const { wrapper } = renderComponent(newProps)
      expect(wrapper.find('.MegaNav-subNav--shown')).toHaveLength(1)
    })
    it('should render all the columns passed with no show class and the footer', () => {
      const newProps = { ...requiredProps, isActive: false }
      const { wrapper } = renderComponent(newProps)
      expect(wrapper.find('.MegaNav-subNav--shown')).toHaveLength(0)
    })
  })
})
