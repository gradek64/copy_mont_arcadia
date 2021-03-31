import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import Accordion from '../Accordion'
import Loader from '../../Loader/Loader'

const TestComponent = (props) => (
  <div key="test" {...props}>
    Children
  </div>
)

describe('<Accordion/>', () => {
  const initialProps = {
    header: '<div>Mock Header</div>',
    accordionName: 'foo',
    children: null,
    className: '',
  }
  const renderComponent = testComponentHelper(Accordion)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with className', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'myBeautifulAccordion',
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('when `withoutBorders` prop is equal to false', () => {
      it('should not have `Accordion-withoutBorders` as className', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
        })

        expect(
          wrapper.find('.Accordion').hasClass('Accordion-withoutBorders')
        ).toBe(false)
      })
    })

    describe('when `withoutBorders` prop is equal to true', () => {
      it('should have `Accordion-withoutBorders` as className', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
          withoutBorders: true,
        })

        expect(
          wrapper.find('.Accordion').hasClass('Accordion-withoutBorders')
        ).toBe(true)
      })
    })

    it('when noContentPadding is falsey, .Accordion-content has .is-padded class', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        children: <TestComponent />,
        noContentPadding: false,
      })
      expect(
        wrapper
          .find('.Accordion-content')
          .first()
          .hasClass('is-padded')
      ).toBe(true)
    })

    it('when noContentPadding is truthy, .Accordion-content does NOT have .is-padded class', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        children: <TestComponent />,
        noContentPadding: true,
      })

      expect(
        wrapper
          .find('.Accordion-content')
          .first()
          .hasClass('is-padded')
      ).toBe(false)
    })

    it('when noContentBorderTop is falsey,  .Accordion-content has .Accordion-content--borderTop class', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        children: <TestComponent />,
      })
      expect(
        wrapper
          .find('.Accordion-content')
          .first()
          .hasClass('Accordion-content--borderTop')
      ).toBe(true)
    })

    it('when noContentBorderTop is truthy,  .Accordion-content does NOT have .Accordion-content--borderTop class', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        children: <TestComponent />,
        noContentBorderTop: true,
      })
      expect(
        wrapper
          .find('.Accordion-content')
          .first()
          .hasClass('Accordion-content--borderTop')
      ).toBe(false)
    })

    it('in noHeaderPadding state', () => {
      expect(
        renderComponent({ ...initialProps, noHeaderPadding: true }).getTree()
      ).toMatchSnapshot()
    })

    it('in contracted state', () => {
      expect(
        renderComponent({
          ...initialProps,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('in expanded state', () => {
      expect(
        renderComponent({
          ...initialProps,
          expanded: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('in children state', () => {
      expect(
        renderComponent({
          ...initialProps,
          children: <TestComponent />,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with analytics action on toggle', () => {
      expect(
        renderComponent({
          ...initialProps,
          analyticsOnToggle: jest.fn(),
        }).getTree()
      ).toMatchSnapshot()
    })

    it('in expanded state with expandedHeight updated', () => {
      const renderedComponent = renderComponent({
        ...initialProps,
        accordionName: 'accordionName',
        expanded: true,
      })
      const { instance, wrapper } = renderedComponent
      wrapper
        .find('.Accordion-wrapper')
        .getElement()
        .ref({ scrollHeight: 50 })
      instance.componentDidUpdate()
      wrapper.update()
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })

    it('should add `noExpandedBackground` class modifier to header if `noExpandedHeaderBackground` prop is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        noExpandedHeaderBackground: true,
      })
      expect(
        wrapper
          .find('.Accordion-header')
          .hasClass('Accordion-header--noExpandedBackground')
      ).toBe(true)
    })

    it('showLoader=true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        showLoader: true,
        children: <TestComponent />,
      })
      expect(wrapper.find('.Accordion-content').exists()).toBe(true)
      expect(wrapper.find('.Accordion-content.is-visible').exists()).toBe(false)
      expect(wrapper.find(Loader).exists()).toBe(true)
    })

    it('showLoader=false (default)', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        children: <TestComponent />,
      })
      expect(wrapper.find('.Accordion-content.is-visible').exists()).toBe(true)
      expect(wrapper.find(Loader).exists()).toBe(false)
    })

    it('should render a subHeader if one is provided', () => {
      expect(
        renderComponent({
          ...initialProps,
          subHeader: 'This is a sub header',
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('when typeof children is string', () => {
      it('should render the accordion content', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: 'Children',
        })
        expect(wrapper.find('.Accordion-content').exists()).toBe(true)
        expect(wrapper.find('.Accordion-content').text()).toEqual('Children')
      })
    })

    describe('when `statusIndicatorText` is not falsy', () => {
      it('should render a div with `Accordion-statusIndicatorText` as className instead of `Accordion-icon`', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
          statusIndicatorText: 'CHANGE',
        })

        expect(wrapper.find('.Accordion-icon')).toHaveLength(0)
        expect(wrapper.find('.Accordion-statusIndicatorText')).toHaveLength(1)
        expect(wrapper.find('.Accordion-statusIndicatorText').text()).toBe(
          'CHANGE'
        )
      })

      describe('when `isDisabled` is equal to false', () => {
        it('should not have class `Accordion-statusIndicatorText--hidden`', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            children: <TestComponent />,
            statusIndicatorText: 'CHANGE',
          })

          expect(
            wrapper
              .find('.Accordion-statusIndicatorText')
              .hasClass('Accordion-statusIndicatorText--hidden')
          ).toBe(false)
        })

        it('should not set the cursor inline css property to `auto` on the accordion header', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            children: <TestComponent />,
            statusIndicatorText: 'CHANGE',
          })
          const headerInLineStyle = wrapper
            .find('.Accordion-header')
            .prop('style')

          expect(headerInLineStyle).toEqual({})
        })
      })

      describe('when `isDisabled` is equal to true', () => {
        it('should have class `Accordion-statusIndicatorText--hidden`', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            children: <TestComponent />,
            statusIndicatorText: 'CHANGE',
            isDisabled: true,
          })

          expect(
            wrapper
              .find('.Accordion-statusIndicatorText')
              .hasClass('Accordion-statusIndicatorText--hidden')
          ).toBe(true)
        })

        it('should set the cursor inline css property to `auto` on the accordion header', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            children: <TestComponent />,
            statusIndicatorText: 'CHANGE',
            isDisabled: true,
          })
          const headerInLineStyle = wrapper
            .find('.Accordion-header')
            .prop('style')

          expect(headerInLineStyle).toEqual({ cursor: 'auto' })
        })
      })
    })

    describe('when `statusIndicatorText` is falsy', () => {
      it('should render a div with `Accordion-icon` as className instead of `Accordion-statusIndicatorText`', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
        })

        expect(wrapper.find('.Accordion-statusIndicatorText')).toHaveLength(0)
        expect(wrapper.find('.Accordion-icon')).toHaveLength(1)
      })

      it('should add `arrowStyle` class modifier to icon', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          arrowStyle: 'secondary',
        })
        expect(wrapper.find('.Accordion-statusIndicatorText')).toHaveLength(0)
        expect(
          wrapper.find('.Accordion-icon').hasClass('Accordion-icon--secondary')
        ).toBe(true)
      })

      it('should add `arrowPosition` class modifier to icon', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          arrowPosition: 'right',
        })
        expect(wrapper.find('.Accordion-statusIndicatorText')).toHaveLength(0)
        expect(
          wrapper.find('.Accordion-icon').hasClass('Accordion-icon--right')
        ).toBe(true)
      })
    })

    describe('when `isDisabled` is equal to false', () => {
      it('should not have class `Accordion-icon--hidden`', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
        })

        expect(
          wrapper.find('.Accordion-icon').hasClass('Accordion-icon--hidden')
        ).toBe(false)
      })

      it('should not set the cursor inline css property to `auto` on the accordion header', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
        })
        const headerInLineStyle = wrapper
          .find('.Accordion-header')
          .prop('style')

        expect(headerInLineStyle).toEqual({})
      })
    })

    describe('when `isDisabled` is equal to true', () => {
      it('should have class `Accordion-icon--hidden`', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
          isDisabled: true,
        })

        expect(
          wrapper.find('.Accordion-icon').hasClass('Accordion-icon--hidden')
        ).toBe(true)
      })

      it('should set the cursor inline css property to `auto` on the accordion header', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
          isDisabled: true,
        })
        const headerInLineStyle = wrapper
          .find('.Accordion-header')
          .prop('style')

        expect(headerInLineStyle).toEqual({ cursor: 'auto' })
      })
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => jest.resetAllMocks())

    describe('on constructor', () => {
      const defaultState = {
        expanded: false,
        expandedHeight: 0,
        hasCollapseAnimationFinished: true,
      }

      it('sets initial state for contracted state', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.state).toEqual(defaultState)
      })

      it('sets initial state for expanded state', () => {
        const { instance } = renderComponent({
          ...initialProps,
          expanded: true,
          hasCollapseAnimationFinished: false,
        })
        expect(instance.state).toEqual({
          ...defaultState,
          expanded: true,
          hasCollapseAnimationFinished: false,
        })
      })
    })

    describe('on componentDidMount', () => {
      it('should call updateExpandedHeight', () => {
        const { instance } = renderComponent(initialProps)
        const updateExpandedHeightSpy = jest.spyOn(
          instance,
          'updateExpandedHeight'
        )
        instance.componentDidMount()
        expect(updateExpandedHeightSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('on componentDidUpdate', () => {
      it('should call updateExpandedHeight', () => {
        const { instance } = renderComponent(initialProps)
        const updateExpandedHeightSpy = jest.spyOn(
          instance,
          'updateExpandedHeight'
        )
        instance.componentDidUpdate()
        expect(updateExpandedHeightSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('on UNSAFE_componentWillReceiveProps', () => {
      it('should not call setState when accordion is contracted and incoming prop is the same', () => {
        const { instance } = renderComponent(initialProps)
        const setStateSpy = jest.spyOn(instance, 'setState')
        instance.UNSAFE_componentWillReceiveProps({
          expanded: false,
        })
        expect(setStateSpy).not.toBeCalled()
      })

      it('should not call setState when accordion is expanded and incoming prop is the same', () => {
        const { instance } = renderComponent({
          ...initialProps,
          expanded: true,
        })
        const setStateSpy = jest.spyOn(instance, 'setState')
        instance.UNSAFE_componentWillReceiveProps({
          expanded: true,
        })
        expect(setStateSpy).not.toBeCalled()
      })

      it('should call setState when accordion is contracted and incoming prop is expanded', () => {
        const { instance } = renderComponent(initialProps)
        const expandedState = {
          expanded: true,
        }
        const setStateSpy = jest.spyOn(instance, 'setState')
        instance.UNSAFE_componentWillReceiveProps(expandedState)
        expect(setStateSpy).toHaveBeenCalledTimes(1)
        expect(setStateSpy).toHaveBeenCalledWith(expandedState)
      })

      it('should call setState when accordion is expanded and incoming prop is contracted', () => {
        const { instance } = renderComponent({
          ...initialProps,
          expanded: true,
        })
        const contractedState = {
          expanded: false,
        }
        const setStateSpy = jest.spyOn(instance, 'setState')
        instance.UNSAFE_componentWillReceiveProps(contractedState)
        expect(setStateSpy).toHaveBeenCalledTimes(1)
        expect(setStateSpy).toHaveBeenCalledWith(contractedState)
      })
    })

    describe('shouldComponentUpdate', () => {
      const initialState = {
        expanded: false,
        expandedHeight: 0,
      }
      it('should return false if state did not change', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.shouldComponentUpdate(initialProps, initialState)).toBe(
          false
        )
      })

      it('should return true if showLoader prop changes to false', () => {
        const { instance } = renderComponent({
          ...initialProps,
          showLoader: true,
        })
        expect(
          instance.shouldComponentUpdate(
            { ...initialProps, showLoader: false },
            initialState
          )
        ).toBe(true)
      })

      it('should return true if state changed from contracted to expanded', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          instance.shouldComponentUpdate(initialProps, {
            ...initialState,
            expanded: true,
          })
        ).toBe(true)
      })

      it('should return true if state changed from expanded to contracted', () => {
        const props = { ...initialProps, expanded: true }
        const { instance } = renderComponent(props)
        expect(
          instance.shouldComponentUpdate(props, {
            ...initialState,
            expanded: false,
          })
        ).toBe(true)
      })

      it('should rerender if expandedHeight changed', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          instance.shouldComponentUpdate(initialProps, {
            ...initialState,
            expandedHeight: 10,
          })
        ).toBe(true)
      })

      it('should return false if children are equal', () => {
        const children = [<TestComponent foo />, <TestComponent bar />]
        const children2 = [<TestComponent foo />, <TestComponent bar />]

        const { instance } = renderComponent({ ...initialProps, children })
        expect(
          instance.shouldComponentUpdate(
            { ...initialProps, children: children2 },
            initialState
          )
        ).toBe(false)
      })

      it('should return true if children change', () => {
        const children = <TestComponent foo />
        const children2 = <TestComponent bar />

        const { instance } = renderComponent({ ...initialProps, children })
        expect(
          instance.shouldComponentUpdate(
            { ...initialProps, children: children2 },
            initialState
          )
        ).toBe(true)
      })

      it('should rerender if children are not deep equal', () => {
        const children = [<TestComponent foo />, <TestComponent foo />]
        const children2 = [<TestComponent foo />, <TestComponent bar />]

        const { instance } = renderComponent({ ...initialProps, children })
        expect(
          instance.shouldComponentUpdate(
            { ...initialProps, children: children2 },
            initialState
          )
        ).toBe(true)
      })

      it('should rerender if incoming className is not equal', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          instance.shouldComponentUpdate(
            {
              ...initialProps,
              className: 'blink-182',
            },
            initialState
          )
        ).toBe(true)
      })
    })
  })

  describe('#updateExpandedHeight', () => {
    const initialScrollHeight = 0

    it('should not update expandedHeight when scrollHeight of accordion wrapper is undefined', () => {
      const { instance, wrapper } = renderComponent(initialProps)
      const setStateSpy = jest.spyOn(instance, 'setState')
      wrapper
        .find('.Accordion-wrapper')
        .getElement()
        .ref({ scrollHeight: undefined })
      instance.updateExpandedHeight()
      expect(setStateSpy).not.toBeCalled()
    })

    it('should set expandedHeight to `none` if noMaxHeight is provided', () => {
      const { instance } = renderComponent({
        ...initialProps,
        noMaxHeight: true,
      })
      const setStateSpy = jest.spyOn(instance, 'setState')

      instance.updateExpandedHeight()
      expect(setStateSpy).toBeCalled()
      expect(instance.state.expandedHeight).toBe('none')
    })

    it('should not update expandedHeight has not changed', () => {
      const { instance, wrapper } = renderComponent(initialProps)
      expect(instance.state.expandedHeight).toBe(initialScrollHeight)
      const setStateSpy = jest.spyOn(instance, 'setState')
      wrapper
        .find('.Accordion-wrapper')
        .getElement()
        .ref({ scrollHeight: initialScrollHeight })

      instance.updateExpandedHeight()
      expect(setStateSpy).not.toBeCalled()
    })

    it('should update expandedHeight if it changed', () => {
      const { instance, wrapper } = renderComponent(initialProps)
      const newScrollHeight = 10

      expect(instance.state.expandedHeight).toBe(initialScrollHeight)
      wrapper
        .find('.Accordion-wrapper')
        .getElement()
        .ref({ scrollHeight: newScrollHeight })
      instance.updateExpandedHeight()
      expect(instance.state.expandedHeight).toBe(newScrollHeight)
    })
  })

  describe('@events', () => {
    describe('on click', () => {
      const props = {
        ...initialProps,
        children: <TestComponent />,
      }

      it('should do nothing if there are no children', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          onAccordionToggle: jest.fn(),
          analyticsOnToggle: jest.fn(),
        })
        const setStateSpy = jest.spyOn(instance, 'setState')

        wrapper.find('.Accordion-header').simulate('click')
        expect(instance.props.analyticsOnToggle).not.toBeCalled()
        expect(instance.props.onAccordionToggle).not.toBeCalled()
        expect(setStateSpy).not.toBeCalled()
      })

      it('should not expand if there are children and is contracted but is disabled', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
          statusIndicatorText: 'CHANGE',
          expanded: false,
          isDisabled: true,
        })

        wrapper.find('.Accordion-header').simulate('click')

        expect(instance.state.expanded).toBe(false)
      })

      it('should not contract if there are children and is expanded but is disabled', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          children: <TestComponent />,
          statusIndicatorText: 'CHANGE',
          expanded: true,
          isDisabled: true,
        })

        wrapper.find('.Accordion-header').simulate('click')

        expect(instance.state.expanded).toBe(true)
      })

      it('should change state to expanded if previously contracted', () => {
        const { instance, wrapper } = renderComponent(props)

        expect(instance.state.expanded).toBe(false)
        wrapper.find('.Accordion-header').simulate('click')
        expect(instance.state.expanded).toBe(true)
      })

      it('should change state to contracted if previously expanded', () => {
        const { instance, wrapper } = renderComponent({
          ...props,
          expanded: true,
        })

        expect(instance.state.expanded).toBe(true)
        wrapper.find('.Accordion-header').simulate('click')
        expect(instance.state.expanded).toBe(false)
      })

      it('should call onAccordionToggle with correct params when expanding', () => {
        const { instance, wrapper } = renderComponent({
          ...props,
          onAccordionToggle: jest.fn(),
        })

        wrapper.find('.Accordion-header').simulate('click')

        expect(instance.props.onAccordionToggle).toHaveBeenCalledWith(
          instance.props.accordionName,
          true
        )
      })

      it('should call onAccordionToggle with correct params when contracting', () => {
        const { instance, wrapper } = renderComponent({
          ...props,
          expanded: true,
          onAccordionToggle: jest.fn(),
        })

        wrapper.find('.Accordion-header').simulate('click')

        expect(instance.props.onAccordionToggle).toHaveBeenCalledWith(
          instance.props.accordionName,
          false
        )
      })

      it('should not call analyticsOnToggle when contracting', () => {
        const { instance, wrapper } = renderComponent({
          ...props,
          expanded: true,
          analyticsOnToggle: jest.fn(),
        })

        expect(instance.props.analyticsOnToggle).not.toBeCalled()
        wrapper.find('.Accordion-header').simulate('click')
        expect(instance.props.analyticsOnToggle).not.toBeCalled()
      })
    })

    describe('on key down', () => {
      it('should call toogle if pressed enter', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        const toggleSpy = jest.spyOn(instance, 'toggle')
        wrapper.find('.Accordion-header').simulate('keydown', { keyCode: 13 })
        expect(toggleSpy).toHaveBeenCalledTimes(1)
      })

      it('should call toogle if pressed space', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        const toggleSpy = jest.spyOn(instance, 'toggle')
        wrapper.find('.Accordion-header').simulate('keydown', { keyCode: 32 })
        expect(toggleSpy).toHaveBeenCalledTimes(1)
      })

      it('should not call toggle if pressed a different key', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        const toggleSpy = jest.spyOn(instance, 'toggle')
        wrapper.find('.Accordion-header').simulate('keydown', { keyCode: 77 })
        expect(toggleSpy).not.toBeCalled()
      })
    })
  })
})
