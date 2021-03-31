import testComponentHelper from 'test/unit/helpers/test-component'

import CmsPage from '../CmsPage'
import NotFound from '../../../containers/NotFound/NotFound'

describe('<CmsPage />', () => {
  const renderComponent = testComponentHelper(CmsPage.WrappedComponent)

  describe('@renders', () => {
    it('should be empty render by default', () => {
      const { wrapper } = renderComponent()
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    describe('<NotFound />', () => {
      it('should render if `page.pageData` prop is empty', () => {
        const { wrapper } = renderComponent({
          page: {
            pageData: [],
          },
        })
        expect(wrapper.find(NotFound).exists()).toBe(true)
      })

      it('should render if page items don‘t have a `type` property, or it‘s unrecognised', () => {
        const { wrapper } = renderComponent({
          page: {
            pageData: [
              {
                data: {},
                type: '',
              },
              {
                data: {},
              },
              {
                data: {},
                type: 'foo',
              },
            ],
          },
        })
        expect(wrapper.find(NotFound).exists()).toBe(true)
      })
    })

    describe('<CmsComponent />', () => {
      it('should render if page item is a CMS type', () => {
        const { getTree } = renderComponent({
          page: {
            pageName: 'Sale Editors Picks SS16',
            pageData: [
              {
                type: 'imagelist',
                data: { source: 'foo' },
              },
              {
                type: 'video',
                data: { source: 'bar' },
              },
              {
                type: 'iframe',
                data: { source: 'baz' },
              },
            ],
          },
        })
        expect(getTree()).toMatchSnapshot()
      })
    })

    describe('Template Component', () => {
      it('should render if page item type is `custom`', () => {
        const { getTree } = renderComponent({
          page: {
            pageName: 'Sale Editors Picks SS16',
            pageData: [
              {
                type: 'custom',
                data: {
                  template: 'quiz',
                  source: 'foo',
                },
              },
            ],
          },
        })
        expect(getTree()).toMatchSnapshot()
      })
    })
  })
})
