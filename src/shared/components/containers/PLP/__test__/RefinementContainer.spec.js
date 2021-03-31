import {
  buildComponentRender,
  shallowRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import RefinementContainer from '../RefinementContainer'
import { compose } from 'ramda'

describe('<RefinementContainer/>', () => {
  const renderComponent = buildComponentRender(
    shallowRender,
    RefinementContainer
  )
  const initialProps = {
    stickyHeader: false,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with `stickyHeader` to true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        stickyHeader: true,
      })
      expect(
        wrapper.find('.RefinementContainer').hasClass('is-stickyHeader')
      ).toBe(true)
    })
  })

  describe('@lifecycle', () => {
    describe('constructor', () => {
      it('should set initial state', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.state).toEqual({
          fixed: false,
        })
      })
    })
    describe('componentDidMount', () => {
      it('should add `onScroll` to window scroll event listener', () => {
        const { instance } = renderComponent(initialProps)
        const addEventListenerMock = jest.spyOn(window, 'addEventListener')
        expect(addEventListenerMock).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(addEventListenerMock).toHaveBeenCalledTimes(1)
        expect(addEventListenerMock).toHaveBeenCalledWith(
          'scroll',
          instance.onScroll
        )
      })
    })
    describe('componentWillUnmount', () => {
      it('should remove `onScroll` from window scroll event listener', () => {
        const { instance } = renderComponent(initialProps)
        const removeEventListenerMock = jest.spyOn(
          window,
          'removeEventListener'
        )
        expect(removeEventListenerMock).toHaveBeenCalledTimes(0)
        instance.componentWillUnmount()
        expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
        expect(removeEventListenerMock).toHaveBeenCalledWith(
          'scroll',
          instance.onScroll
        )
      })
    })
  })

  describe('@methods', () => {
    it('should set `element` in `ref`', () => {
      // we have to use mount here because need acc
      const render = compose(
        mountRender,
        withStore({
          config: {
            brandName: 'topshop',
          },
          products: {
            categoryTitle: 'cat 1',
            refinements: [],
            activeRefinements: [],
            sortOptions: [],
          },
          refinements: {
            selectedOptions: {},
          },
          features: {
            status: {},
          },
        })
      )
      const renderComponent = buildComponentRender(render, RefinementContainer)
      const { instance } = renderComponent(initialProps)
      expect(instance.element).toBeDefined()
    })

    describe('onScroll', () => {
      it('should call `calculateFixed` when `onScroll` is triggered', () => {
        const { instance } = renderComponent(initialProps)
        window.pageYOffset = 0
        instance.element = {
          parentNode: {
            offsetTop: 150,
            nextSibling: {
              clientHeight: 300,
            },
          },
        }
        const calculateFixedMock = jest.spyOn(instance, 'calculateFixed')
        expect(calculateFixedMock).toHaveBeenCalledTimes(0)
        instance.onScroll()
        expect(calculateFixedMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('onAccordionToggle', () => {
      beforeEach(() => {
        jest.resetAllMocks()
      })
      const { instance } = renderComponent(initialProps)
      window.pageYOffset = 0
      instance.element = {
        clientHeight: 1200,
        parentNode: {
          offsetTop: 150,
          nextSibling: {
            clientHeight: 300,
          },
        },
      }
      it('should call `calculateFixed` with on accordion toggle', () => {
        const calculateFixedMock = jest.spyOn(instance, 'calculateFixed')
        expect(calculateFixedMock).toHaveBeenCalledTimes(0)
        instance.onAccordionToggle('accordionName', true)
        expect(calculateFixedMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('calculateFixed', () => {
      describe('when plpContainer is small', () => {
        it('should return `fixed`:`false` when plpContainerClientHeight smaller than refinementContainer height', () => {
          const { instance } = renderComponent(initialProps)
          window.pageYOffset = 451
          instance.element = {
            clientHeight: 1200,
            parentNode: {
              offsetTop: 150,
              nextSibling: {
                clientHeight: 300,
              },
            },
          }
          expect(instance.state).toEqual({
            fixed: false,
          })
          instance.calculateFixed()
          expect(instance.state).toEqual({
            fixed: false,
          })
        })
        it('should return `fixed`:`false` when plpContainerClientHeight equals to refinementContainer height', () => {
          const { instance } = renderComponent(initialProps)
          window.pageYOffset = 451
          instance.element = {
            clientHeight: 300,
            parentNode: {
              offsetTop: 150,
              nextSibling: {
                clientHeight: 300,
              },
            },
          }
          expect(instance.state).toEqual({
            fixed: false,
          })
          instance.calculateFixed()
          expect(instance.state).toEqual({
            fixed: false,
          })
        })
      })
      describe('when plpContainer is big', () => {
        it('`fixed`:`false` when pageYOffset is lower than offsetTop', () => {
          const { instance } = renderComponent(initialProps)
          window.pageYOffset = 149
          instance.element = {
            clientHeight: 300,
            parentNode: {
              offsetTop: 150,
              nextSibling: {
                clientHeight: 301,
              },
            },
          }
          expect(instance.state).toEqual({
            fixed: false,
          })
          instance.calculateFixed()
          expect(instance.state).toEqual({
            fixed: false,
          })
        })
        it('`fixed`:`true` when pageYOffset is higher than offSetTop', () => {
          const { instance } = renderComponent(initialProps)
          window.pageYOffset = 151
          instance.element = {
            clientHeight: 300,
            parentNode: {
              offsetTop: 150,
              nextSibling: {
                clientHeight: 301,
              },
            },
          }
          expect(instance.state).toEqual({
            fixed: false,
          })
          instance.calculateFixed()
          expect(instance.state).toEqual({
            fixed: true,
          })
        })
        it('`fixed`:`false` when pageYOffset is equals to offSetTop', () => {
          const { instance } = renderComponent(initialProps)
          window.pageYOffset = 150
          instance.element = {
            clientHeight: 300,
            parentNode: {
              offsetTop: 150,
              nextSibling: {
                clientHeight: 301,
              },
            },
          }
          expect(instance.state).toEqual({
            fixed: false,
          })
          instance.calculateFixed()
          expect(instance.state).toEqual({
            fixed: false,
          })
        })
      })
    })
  })
})
