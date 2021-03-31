import { addPostDispatchListeners } from '../../../middleware/analytics-middleware'
import { pageLoadedListener } from '../page-loaded-listener'
import pageViewConfig from '../index'

jest.mock('../../../middleware/analytics-middleware')

describe('pageView module index - default export', () => {
  it('should set up the post dispatch listener', () => {
    pageViewConfig()

    expect(addPostDispatchListeners).toHaveBeenCalledTimes(1)
    expect(addPostDispatchListeners).toHaveBeenCalledWith(
      'PAGE_LOADED',
      pageLoadedListener
    )
  })
})
