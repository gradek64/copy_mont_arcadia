import testComponentHelper, {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'
import RecentlyViewedTab from '../RecentlyViewedTab'
import RecentlyViewed from '../../RecentlyViewed/RecentlyViewed'

const renderMountedComponent = buildComponentRender(
  mountRender,
  RecentlyViewedTab.WrappedComponent
)

const renderComponent = testComponentHelper(RecentlyViewedTab.WrappedComponent)

const defaultProps = {
  isDismissed: false,
  isMobile: false,
  isOpen: false,
  isFeatureLatestViewedEnabled: true,
  recentlyViewedLength: 2,
  toggleRecentlyViewedTabOpen: jest.fn(),
  dismissRecentlyViewedTab: jest.fn(),
}

jest.mock('../../RecentlyViewed/RecentlyViewed')

function expectToBeNull(props) {
  const { wrapper } = renderComponent(props)

  expect(wrapper.isEmptyRender()).toBe(true)
}

describe('<RecentlyViewedTab />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@renders', () => {
    describe('the feature flag is enabled', () => {
      describe('is tablet or desktop', () => {
        describe('recentlyViewedLength is greater then 1', () => {
          describe('it hasnt been dismissed', () => {
            it('renders the tab, the toggle button, the close button and RecentlyViewed component', () => {
              const props = {
                ...defaultProps,
                isOpen: false,
              }

              const { wrapper } = renderMountedComponent(props)

              expect(wrapper.find('.RecentlyViewedTab').exists()).toBe(true)
              expect(
                wrapper.find('.RecentlyViewedTab-tabContainer').exists()
              ).toBe(true)
              expect(
                wrapper.find('.RecentlyViewedTab-toggleButton').exists()
              ).toBe(true)
              expect(
                wrapper.find('.RecentlyViewedTab-closeButton').exists()
              ).toBe(true)
              expect(wrapper.find(RecentlyViewed).exists()).toBe(true)
            })

            describe('toggleButton click', () => {
              it('should dispatch toggleRecentlyViewedTabOpen', () => {
                const props = {
                  ...defaultProps,
                  isOpen: true,
                }

                const { wrapper } = renderMountedComponent(props)

                wrapper
                  .find('.RecentlyViewedTab-toggleButton')
                  .simulate('click')

                expect(
                  defaultProps.toggleRecentlyViewedTabOpen
                ).toHaveBeenCalledTimes(1)
              })
            })

            describe('closeButton click', () => {
              it('should dispatch dismissRecentlyViewedTab', () => {
                const props = {
                  ...defaultProps,
                  isOpen: true,
                }

                const { wrapper } = renderMountedComponent(props)

                wrapper
                  .find('.RecentlyViewedTab-toggleButton')
                  .simulate('click')

                expect(
                  defaultProps.toggleRecentlyViewedTabOpen
                ).toHaveBeenCalledTimes(1)
              })
            })
          })

          describe('it has been dismissed already', () => {
            it('return null', () => {
              const props = {
                ...defaultProps,
                isDismissed: true,
              }

              expectToBeNull(props)
            })
          })
        })

        describe('recentlyViewedLength is less or equal than 1', () => {
          it('return null', () => {
            const props = {
              ...defaultProps,
              recentlyViewedLength: 0,
            }

            expectToBeNull(props)
          })
        })
      })

      describe('is mobile', () => {
        it('return null', () => {
          const props = {
            ...defaultProps,
            recentlyViewedLength: 0,
          }

          expectToBeNull(props)
        })
      })
    })

    describe('feature flag is not enabled', () => {
      it('return null', () => {
        const props = {
          ...defaultProps,
          isFeatureLatestViewedEnabled: false,
        }

        expectToBeNull(props)
      })
    })
  })
})
