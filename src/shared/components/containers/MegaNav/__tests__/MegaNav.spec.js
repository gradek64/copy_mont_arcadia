import {
  buildComponentRender,
  shallowRender,
  withStore,
  mountRender,
} from '../../../../../../test/unit/helpers/test-component'
import { mockStoreCreator } from '../../../../../../test/unit/helpers/get-redux-mock-store'
import { compose } from 'ramda'
import MegaNav from '../MegaNav'
import Category from '../Category'
import * as featureSelectorsModule from '../../../../../shared/selectors/featureSelectors'

featureSelectorsModule.isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled = jest.fn()

describe('<MegaNav />', () => {
  const requiredProps = {
    megaNavCategories: [
      {
        categoryId: '208491',
        label: 'New In',
        seoUrl:
          'http://www.topshop.com/en/tsuk/category/new-in-this-week-2169932',
        isHidden: false,
        columns: [
          {
            subcategories: [
              {
                'SHOP BY CATEGORY': [
                  {
                    categoryId: '277012',
                    paddingTop: 0,
                    label: 'New In Fashion',
                    seoUrl:
                      'http://www.topshop.com/en/tsuk/category/new-in-this-week-2169932/new-in-fashion-6367514',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    getMegaNav: jest.fn(),
    megaNavSelectedCategory: '',
    setMegaNavSelectedCategory: jest.fn(),
    setMegaNavHeight: jest.fn(),
  }
  const renderComponent = buildComponentRender(
    shallowRender,
    MegaNav.WrappedComponent
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@componentDidUpdate', () => {
    it('should set MegaNav height', () => {
      const { instance } = renderComponent(requiredProps)
      instance.MegaNavSectionRef = { current: { clientHeight: 50 } }

      instance.componentDidUpdate()

      expect(requiredProps.setMegaNavHeight).toHaveBeenCalledWith(50)
    })
  })
  describe('@renders', () => {
    it('should render categories with correct props', () => {
      const categories = renderComponent(requiredProps)
        .wrapper.find('.MegaNav-categories')
        .children()
      expect(categories).toHaveLength(requiredProps.megaNavCategories.length)
      expect(categories.at(0).prop('category')).toEqual(
        requiredProps.megaNavCategories[0]
      )
    })

    it('should not render categories if default state is not available', () => {
      expect(
        renderComponent({
          ...requiredProps,
          megaNavCategories: [],
        }).wrapper.find(Category)
      ).toHaveLength(0)
    })

    describe('`MegaNav`', () => {
      it('should render with className', () => {
        expect(
          renderComponent({
            ...requiredProps,
            className: 'someClassName',
          }).wrapper.hasClass('someClassName')
        ).toBe(true)
      })
    })
  })

  describe('@methods', () => {
    describe('unselectCategory', () => {
      it('calls reset meganav selected category', () => {
        const { instance } = renderComponent(requiredProps)
        instance.unselectCategory()
        expect(requiredProps.setMegaNavSelectedCategory).toHaveBeenCalledWith(
          ''
        )
        expect(requiredProps.setMegaNavSelectedCategory).toHaveBeenCalledTimes(
          1
        )
      })
    })
    describe('selectCategory', () => {
      it('calls setMegaNavSelectedCategory when category passed is different to the one already selected', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          megaNavSelectedCategory: '2',
        })
        const categoryId = '1'

        instance.selectCategory({ categoryId })
        expect(requiredProps.setMegaNavSelectedCategory).toHaveBeenCalledWith(
          categoryId
        )
      })
      it('doesnt call setMegaNavSelectedCategory when category passed is equal to the one already selected', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          megaNavSelectedCategory: '1',
        })
        const categoryId = '1'

        instance.selectCategory({ categoryId })
        expect(requiredProps.setMegaNavSelectedCategory).not.toHaveBeenCalled()
      })
    })
  })

  describe('@lifecycle', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    describe('onComponenDidMount', () => {
      it('should not dispatch getMegaNav action if megaNav has already been fetched', () => {
        const { instance } = renderComponent(requiredProps)
        instance.MegaNavSectionRef = { current: { clientHeight: 50 } }
        instance.componentDidMount()
        expect(instance.props.getMegaNav).not.toHaveBeenCalled()
      })
      it('should dispatch getMegaNav action if is empty', () => {
        const { instance } = renderComponent({
          ...requiredProps,
          megaNavCategories: [],
        })
        instance.MegaNavSectionRef = { current: { clientHeight: 50 } }
        instance.componentDidMount()
        expect(instance.props.getMegaNav).toHaveBeenCalledTimes(1)
      })
      it('should call the `setMegaNavHeight` with the right params', () => {
        const { instance } = renderComponent(requiredProps)
        instance.MegaNavSectionRef = { current: { clientHeight: 50 } }
        expect(requiredProps.setMegaNavHeight).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(requiredProps.setMegaNavHeight).toHaveBeenCalledTimes(1)
        expect(requiredProps.setMegaNavHeight).toBeCalledWith(50)
      })
    })
  })

  describe('@connected component', () => {
    const mockMegaNav = {
      categories: requiredProps.megaNavCategories,
    }
    const initialState = {
      navigation: {
        megaNav: mockMegaNav,
      },
      config: {
        brandName: 'topshop',
      },
      viewport: {
        media: 'desktop',
      },
      debug: {
        environment: 'stage',
      },
    }
    const store = mockStoreCreator(initialState)
    const state = store.getState()

    const render = compose(
      shallowRender,
      withStore(state)
    )
    const renderComponent = buildComponentRender(render, MegaNav)
    const { instance } = renderComponent()

    it('should wrap `MegaNav` component', () => {
      expect(MegaNav.WrappedComponent.name).toBe('MegaNav')
    })

    describe('`mapStateToProps`', () => {
      it('should `megaNav` from state', () => {
        const prop = instance.stateProps.megaNavCategories
        expect(prop).toEqual(mockMegaNav.categories)
      })
    })

    describe('Category component', () => {
      describe('feature flag FEATURE_MEGANAV_TOP_LEVEL_LINKS_NO_REDIRECTIONURL is supported', () => {
        it('passes to the Category component the prop `isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled` as true', () => {
          featureSelectorsModule.isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled.mockReturnValueOnce(
            true
          )

          const fullRender = buildComponentRender(
            compose(
              mountRender,
              withStore(state)
            ),
            MegaNav
          )
          const { wrapper } = fullRender(requiredProps)

          expect(
            wrapper
              .find('.MegaNav-categories')
              .children()
              .prop('isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled')
          ).toBe(true)
        })
        it('passes to the Category component the prop `isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled` as false', () => {
          featureSelectorsModule.isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled.mockReturnValue(
            false
          )

          const fullRender = buildComponentRender(
            compose(
              mountRender,
              withStore(state)
            ),
            MegaNav
          )

          const { wrapper } = fullRender(requiredProps)

          expect(
            wrapper
              .find('.MegaNav-categories')
              .children()
              .prop('isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled')
          ).toBe(false)
        })
      })
      describe('feature flag FEATURE_MEGANAV_TOP_LEVEL_LINKS_NO_REDIRECTIONURL is not supported', () => {
        it('passes to the Category component the prop `isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled` as true', () => {
          featureSelectorsModule.isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled.mockReturnValueOnce(
            undefined
          )

          const fullRender = buildComponentRender(
            compose(
              mountRender,
              withStore(state)
            ),
            MegaNav
          )
          const { wrapper } = fullRender(requiredProps)

          expect(
            wrapper
              .find('.MegaNav-categories')
              .children()
              .prop('isFeatureMeganavTopLevelLinksNoRedirectionUrlEnabled')
          ).toBe(true)
        })
      })
    })
  })
})
