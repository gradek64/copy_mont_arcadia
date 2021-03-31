import testComponentHelper from 'test/unit/helpers/test-component'
import GridSelector from '../GridSelector'

describe('<GridSelector />', () => {
  const initialProps = {
    columnOptions: [2, 3, 4],
    setGridLayout: jest.fn(),
  }
  const renderComponent = testComponentHelper(GridSelector.WrappedComponent)

  beforeEach(() => {
    initialProps.setGridLayout.mockClear()
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with columns prop', () => {
      expect(
        renderComponent({ ...initialProps, columns: 4 }).getTree()
      ).toMatchSnapshot()
    })

    it('with className prop', () => {
      expect(
        renderComponent({ ...initialProps, className: 'Foo' }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('click', () => {
      it('calls setGridLayout handler with columns', () => {
        const { wrapper } = renderComponent(initialProps)

        expect(initialProps.setGridLayout).not.toBeCalled()

        wrapper.find('.GridSelector-button').forEach((gridButton, i) => {
          gridButton.simulate('click')
          expect(initialProps.setGridLayout).toBeCalledWith(
            initialProps.columnOptions[i]
          )
        })
      })
    })
  })
})
