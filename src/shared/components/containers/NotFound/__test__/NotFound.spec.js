import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import NotFound from '../NotFound'
import { setPageStatusCode } from '../../../../actions/common/routingActions'

import Sandbox from '../../SandBox/SandBox'
import Helmet from 'react-helmet'

jest.mock('../../../../actions/common/routingActions')

describe('<NotFound />', () => {
  const renderComponent = testComponentHelper(
    NotFound.WrappedComponent.WrappedComponent
  )
  const props = {
    setPageStatusCode,
    route: {
      contentType: 'page',
    },
  }

  describe('@render', () => {
    it('renders as expected', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('Page head', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    it('sets the page title', () => {
      const { wrapper } = renderComponent(props)

      const helmet = wrapper.find(Helmet).first()

      expect(helmet.prop('title')).toBe('404 - Page not found')
    })

    it('sets the status code to 404 for ssr pages', () => {
      expect(setPageStatusCode).not.toHaveBeenCalled()

      renderComponent(props)

      expect(setPageStatusCode).toBeCalledWith(404)
    })

    it('does not the status code to client side renders', () => {
      global.process.browser = true

      renderComponent(props)

      expect(setPageStatusCode).not.toHaveBeenCalled()

      global.process.browser = false
    })

    it('sets the page meta', () => {
      const { wrapper } = renderComponent(props)

      const helmet = wrapper.find(Helmet).first()

      expect(helmet.prop('meta')).toEqual([
        { name: 'description', content: 'Page not found' },
        { name: 'ROBOTS', content: 'NOINDEX, NOFOLLOW' },
      ])
    })
  })

  describe('CMS page data', () => {
    it('defaults the cmsPageName to be error404', () => {
      const { wrapper } = renderComponent(props)

      const sandbox = wrapper.find(Sandbox)

      expect(sandbox.prop('cmsPageName')).toBe('error404')
    })
  })

  describe('Analytics', () => {
    // it reports 404 analytics
    analyticsDecoratorHelper(NotFound, 'not-found', {
      componentName: 'NotFound',
      isAsync: true,
    })
  })
})
