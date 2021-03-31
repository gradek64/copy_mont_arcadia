import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import Modal from '../Modal'
import KEYS from '../../../../constants/keyboardKeys'

describe('<Modal/>', () => {
  const entryPoint = { focus: jest.fn() }
  const initialProps = {
    modalOpen: true,
    modalChildren: '<div>this is a demo modal</div>',
    toggleModal: jest.fn(),
    mode: 'normal',
    clearModalChildren: jest.fn(),
    entryPoint,
    onCloseModal: jest.fn(),
    setModalCancelled: jest.fn(),
    predecessorModal: null,
    openPredecessorModal: jest.fn(),
  }
  const renderComponent = testComponentHelper(Modal.WrappedComponent)
  const focusFn = jest.fn()
  const event = { preventDefault: jest.fn() }

  global.document.querySelector = jest.fn(() => ({
    focus: focusFn,
  }))
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('in closed state', () => {
      expect(
        renderComponent({ ...initialProps, modalOpen: false }).getTree()
      ).toMatchSnapshot()
    })
    it('in dialog state', () => {
      expect(
        renderComponent({ ...initialProps, type: 'dialog' }).getTree()
      ).toMatchSnapshot()
    })
    it('when modalChildren is a node', () => {
      const child = React.createElement('span', { prop1: 32, prop2: 44 }, [
        'hello world',
      ])
      expect(
        renderComponent({ ...initialProps, modalChildren: child }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    let renderedComponent
    beforeEach(() => {
      renderedComponent = renderComponent(initialProps)
    })
    describe('on componentDidMount', () => {
      it('should add keydown event listener', () => {
        const spy = jest.spyOn(global.document.body, 'addEventListener')
        const { instance } = renderedComponent
        instance.componentDidMount()
        expect(spy).toHaveBeenLastCalledWith('keydown', instance.onKeyDown)
        spy.mockReset()
        spy.mockRestore()
      })
    })
    describe('on UNSAFE_componentWillReceiveProps', () => {
      beforeEach(() =>
        renderedComponent.instance.props.clearModalChildren.mockReset())
      it('should not call clearModalChildren if modelOpen changes to true', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        wrapper.setProps({
          modalOpen: true,
        })
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
      })
      it('should call clearModalChildren if modalOpen changes to false', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.clearModalChildren).not.toHaveBeenCalled()
        wrapper.setProps({
          modalOpen: false,
        })
        expect(instance.props.clearModalChildren).toHaveBeenCalledTimes(1)
      })
    })
    describe('on componentDidUpdate', () => {
      beforeEach(() => {
        global.document.querySelector.mockClear()
        focusFn.mockReset()
      })
      it('should call focus on the focus item', () => {
        const { instance } = renderComponent(initialProps)
        expect(global.document.querySelector).not.toHaveBeenCalled()
        expect(focusFn).not.toHaveBeenCalled()

        instance.componentDidUpdate({ modalOpen: false })
        expect(focusFn).toHaveBeenCalledTimes(1)
        expect(global.document.querySelector).toHaveBeenCalledWith(
          '[data-modal-focus]'
        )
      })
      it('should not call focus on the focus item if it was open', () => {
        const { instance } = renderComponent(initialProps)
        expect(global.document.querySelector).not.toHaveBeenCalled()

        instance.componentDidUpdate({ modalOpen: true })
        expect(focusFn).not.toHaveBeenCalled()
        expect(global.document.querySelector).toHaveBeenCalledWith(
          '[data-modal-focus]'
        )
      })
    })
  })

  describe('@events', () => {
    beforeEach(() => jest.clearAllMocks())
    describe('on Keydown', () => {
      it('calls onCloseModal when key pressed is ESCAPE from modal', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.onCloseModal).not.toHaveBeenCalled()
        wrapper.find('.Modal').simulate('keydown', { keyCode: KEYS.ESCAPE })
        expect(instance.props.onCloseModal).toHaveBeenCalledTimes(1)
        expect(entryPoint.focus).toHaveBeenCalledTimes(1)
      })
      // TODO: simulate ESCAPE from document.body
      it('does not call onCloseModal when key is any other than ESCAPE ', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        wrapper.find('.Modal').simulate('keydown', { keyCode: KEYS.I })
        expect(instance.props.onCloseModal).not.toHaveBeenCalled()
      })
      it('does not call onCloseModal when mode is warning', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          mode: 'warning',
        })
        wrapper.find('.Modal').simulate('keydown', { keyCode: KEYS.I })
        expect(instance.props.onCloseModal).not.toHaveBeenCalled()
      })
    })
    describe('<button class="Modal-closeIcon"/>', () => {
      it('should call onCloseModal when button is clicked', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.onCloseModal).not.toHaveBeenCalled()
        wrapper.find('.Modal-closeIcon').simulate('click')
        expect(entryPoint.focus).toHaveBeenCalledTimes(1)
        expect(instance.props.onCloseModal).toHaveBeenCalledTimes(1)
      })
    })
    describe('closeModal', () => {
      it('should set modal cancelled state when called', () => {
        const { instance } = renderComponent(initialProps)
        instance.closeModal()
        expect(instance.props.setModalCancelled).toHaveBeenCalledTimes(1)
      })
      it('should render previous modal if `predecessorModal` is not null', async () => {
        const predecessorModal = {
          type: 'type',
          mode: 'dialog',
          children: {},
        }
        const { type, mode, children } = predecessorModal

        const { wrapper } = renderComponent({
          ...initialProps,
          predecessorModal,
        })

        await wrapper.find('.Modal-closeIcon').prop('onClick')(event)
        expect(initialProps.setModalCancelled).toHaveBeenCalledTimes(0)
        expect(initialProps.openPredecessorModal).toHaveBeenCalledWith({
          children,
          type,
          mode,
        })
      })
    })
  })
})
