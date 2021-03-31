import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import { Measure } from '../measure'

describe('<Measure/>', () => {
  jest.useFakeTimers()

  const renderComponent = testComponentHelper(Measure)

  const initialProps = {
    children: () => <div>Mock</div>,
  }

  describe('@renders', () => {
    it('children', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('passes the height and the width to the child', () => {
      const mockFunction = jest.fn(() => <div />)
      const { instance } = renderComponent({
        children: mockFunction,
      })
      expect(mockFunction).toHaveBeenCalledTimes(1)
      const mockState = {
        componentHeight: 555,
        componentWidth: 333,
      }
      instance.setState(mockState)
      expect(mockFunction).toHaveBeenCalledTimes(2)
      expect(mockFunction.mock.calls[1][0].componentHeight).toBe(
        mockState.componentHeight
      )
      expect(mockFunction.mock.calls[1][0].componentWidth).toBe(
        mockState.componentWidth
      )
    })
    it('calls children with height and width', () => {
      const mockFunction = jest.fn(() => <div />)
      const initialState = {
        componentWidth: null,
        componentHeight: null,
      }
      const resizedState = {
        componentWidth: 10,
        componentHeight: 5,
      }
      const { instance } = renderComponent({
        children: mockFunction,
      })
      expect(mockFunction).toHaveBeenCalledTimes(1)
      expect(mockFunction).toHaveBeenLastCalledWith(initialState)
      instance.setState({
        componentWidth: 10,
        componentHeight: 5,
      })
      expect(mockFunction).toHaveBeenCalledTimes(2)
      expect(mockFunction).toHaveBeenLastCalledWith(resizedState)
    })
    it('throws for invalid children (non-function)', () => {
      expect(() => {
        renderComponent({
          children: <div />,
        })
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('on componentDidMount', () => {
      it('sets data of _resizeElement', () => {
        const { instance } = renderComponent(initialProps)
        instance._resizeElement = {}
        instance.componentDidMount()
        expect(instance._resizeElement.data).toBe('about:blank')
      })
    })

    describe('on componenWillUnmount', () => {
      it('calls element.removeEventListener', () => {
        const { instance } = renderComponent(initialProps)
        instance._elementObject = {
          removeEventListener: jest.fn(),
        }
        expect(
          instance._elementObject.removeEventListener
        ).not.toHaveBeenCalled()
        instance.componentWillUnmount()
        expect(
          instance._elementObject.removeEventListener
        ).toHaveBeenCalledTimes(1)
        expect(
          instance._elementObject.removeEventListener
        ).toHaveBeenCalledWith('resize', instance.updateDimensionsDebounced)
      })
      it('calls clearTimeout when the delayedFunction has not ran yet', () => {
        const { instance } = renderComponent(initialProps)
        instance._delayedFunction = 555
        expect(clearTimeout).not.toHaveBeenCalled()
        instance.componentWillUnmount()
        expect(clearTimeout).toHaveBeenCalledTimes(1)
        expect(clearTimeout).toHaveBeenCalledWith(555)
        clearTimeout.mockClear()
      })
    })
  })

  describe('@instance methods', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.clearAllTimers()
    })

    describe('containerDidLoad', () => {
      const mockedElement = {
        addEventListener: jest.fn(),
      }

      const event = {
        target: {
          contentDocument: {
            defaultView: mockedElement,
          },
        },
      }

      beforeEach(() => {
        mockedElement.addEventListener.mockClear()
      })

      it('sets element in state', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance._elementObject).toBeUndefined()
        instance.containerDidLoad(event)
        expect(instance._elementObject).toBe(mockedElement)
      })
      it('sets eventListener', () => {
        const { instance } = renderComponent(initialProps)
        expect(mockedElement.addEventListener).not.toHaveBeenCalled()
        instance.containerDidLoad(event)
        expect(instance._elementObject).toBe(mockedElement)
        expect(instance._elementObject.addEventListener).toHaveBeenCalledTimes(
          1
        )
        expect(
          instance._elementObject.addEventListener
        ).toHaveBeenLastCalledWith('resize', instance.updateDimensionsDebounced)
      })
      it('calls updateDimensions', () => {
        const { instance } = renderComponent(initialProps)
        instance.updateDimensions = jest.fn()
        expect(instance.updateDimensions).not.toHaveBeenCalled()
        instance.containerDidLoad(event)
        expect(instance.updateDimensions).toHaveBeenCalledTimes(1)
      })
    })

    describe('updateDimensions', () => {
      it('sets componentHeight and componentWidth if they exists', () => {
        const { instance } = renderComponent(initialProps)
        const mockElement = {
          offsetHeight: 5,
          offsetWidth: 10,
        }
        instance.setState = jest.fn()
        instance._element = { ...mockElement }
        expect(setTimeout).not.toHaveBeenCalled()
        instance.updateDimensions()
        expect(instance.setState).toHaveBeenCalledTimes(1)
        expect(instance.setState).toHaveBeenCalledWith({
          componentHeight: mockElement.offsetHeight,
          componentWidth: mockElement.offsetWidth,
        })
      })
    })

    describe('updateDimensionsDebounced', () => {
      it('calls clearTimeout if there is a function in the queue', () => {
        const { instance } = renderComponent(initialProps)
        instance._delayedFunction = 333
        expect(clearTimeout).not.toHaveBeenCalled()
        instance.updateDimensionsDebounced()
        expect(clearTimeout).toHaveBeenCalledTimes(1)
        expect(clearTimeout).toHaveBeenCalledWith(333)
      })
      it('sets a timeOut for updateDimensions()', () => {
        const { instance } = renderComponent(initialProps)
        expect(setTimeout).not.toHaveBeenCalled()
        instance.updateDimensionsDebounced()
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledWith(instance.updateDimensions, 10)
      })
    })
  })
})
