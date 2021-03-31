import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import AccordionGroup from '../AccordionGroup'
import Accordion from '../../Accordion/Accordion'

describe('<AccordionGroup/>', () => {
  const initialProps = {
    children: [
      <div
        className="firstAccordion"
        accordionName="name1"
        key="name1"
        label="label1"
      />,
      <div
        className="secondAccordion"
        accordionName="name2"
        key="name2"
        label="label2"
      />,
    ],
    handleCollapseAll: jest.fn(),
  }
  const renderComponent = testComponentHelper(AccordionGroup)

  describe('@renders', () => {
    it('sets initial state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with className', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'AccordionGroupClassName',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with initiallyExpanded', () => {
      expect(
        renderComponent({
          ...initialProps,
          initiallyExpanded: ['name1'],
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('constructor', () => {
      it('should store initiallyExpanded prop in internal state', () => {
        const initiallyExpanded = ['name1']
        const { instance } = renderComponent({
          ...initialProps,
          initiallyExpanded,
        })
        expect(instance.state).toEqual({
          expandedAccordions: initiallyExpanded,
        })
      })
    })

    describe('UNSAFE_componentWillReceiveProps', () => {
      it('should not update state if initiallyExpanded prop has not changed', () => {
        const initiallyExpanded = ['name1']
        const { instance } = renderComponent({
          ...initialProps,
          initiallyExpanded,
        })
        const setStateSpy = jest.spyOn(instance, 'setState')
        instance.UNSAFE_componentWillReceiveProps({ initiallyExpanded })
        expect(setStateSpy).not.toBeCalled()
      })

      it('should update state if initiallyExpanded prop changed', () => {
        const { instance } = renderComponent({
          ...initialProps,
          initiallyExpanded: ['name1'],
        })
        const initiallyExpanded = ['name1', 'name2']
        const setStateSpy = jest.spyOn(instance, 'setState')
        instance.UNSAFE_componentWillReceiveProps({ initiallyExpanded })

        expect(setStateSpy).toHaveBeenCalledTimes(1)
        expect(setStateSpy).toHaveBeenCalledWith({
          expandedAccordions: initiallyExpanded,
        })
      })
    })

    describe('componentDidMount', () => {
      describe('when typeof `handleCollapseAll` is equal to a function', () => {
        it('should call `handleCollapseAll`', () => {
          const { instance } = renderComponent({
            ...initialProps,
          })
          expect(instance.props.handleCollapseAll).not.toHaveBeenCalled()
          instance.componentDidMount()
          expect(instance.props.handleCollapseAll).toHaveBeenCalledTimes(1)
          expect(instance.props.handleCollapseAll).toHaveBeenCalledWith(
            expect.any(Function)
          )
        })
      })
    })
  })

  describe('tracking accordion toggling', () => {
    const toggleAccordion = (
      wrapper,
      accordionName,
      accordionExpandedState
    ) => {
      wrapper
        .find(Accordion)
        .first()
        .props()
        .onAccordionToggle(accordionName, accordionExpandedState)
    }

    it('should call onAccordionToggle prop when an accordion is toggled', () => {
      const accordionName = 'name1'
      const accordionExpandedState = true
      const onAccordionToggleMock = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        onAccordionToggle: onAccordionToggleMock,
      })
      expect(onAccordionToggleMock).toHaveBeenCalledTimes(0)
      toggleAccordion(wrapper, accordionName, accordionExpandedState)
      expect(onAccordionToggleMock).toHaveBeenLastCalledWith(
        accordionName,
        accordionExpandedState
      )
    })

    it('should add accordion name to expandedAccordions state on its expansion', () => {
      const initiallyExpanded = ['name1']
      const newExpandedAccordionName = 'name2'
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        initiallyExpanded,
      })
      expect(instance.state.expandedAccordions).toEqual(initiallyExpanded)
      toggleAccordion(wrapper, newExpandedAccordionName, true)
      expect(instance.state.expandedAccordions).toEqual([
        ...initiallyExpanded,
        newExpandedAccordionName,
      ])
    })

    it('should remove accordion name to expandedAccordions state on its closure', () => {
      const accordionName1 = 'name1'
      const accordionName2 = 'name2'
      const initiallyExpanded = [accordionName1, accordionName2]
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        initiallyExpanded,
      })
      expect(instance.state.expandedAccordions).toEqual(initiallyExpanded)
      toggleAccordion(wrapper, accordionName2, false)
      expect(instance.state.expandedAccordions).toEqual([accordionName1])
    })

    it('should have only one expandedAccordion in state when singleOpen', () => {
      const accordionName1 = 'name1'
      const accordionName2 = 'name2'
      const initiallyExpanded = [accordionName1]
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        singleOpen: true,
        initiallyExpanded,
      })
      expect(instance.state.expandedAccordions).toEqual(initiallyExpanded)
      toggleAccordion(wrapper, accordionName2, true)
      expect(instance.state.expandedAccordions).toEqual([accordionName2])
    })
  })
})
