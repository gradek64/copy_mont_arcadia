import testComponentHelper from 'test/unit/helpers/test-component'
import Filters from '../Filters'

describe('<Filters />', () => {
  const initialProps = {
    isMobile: false,
    toggleRefinements: jest.fn(),
    activeRefinements: [],
  }

  const renderComponent = testComponentHelper(Filters.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with numRefinements prop', () => {
      expect(
        renderComponent({ ...initialProps, numRefinements: 5 }).getTree()
      ).toMatchSnapshot()
    })

    it('with totalProducts prop', () => {
      expect(
        renderComponent({ ...initialProps, totalProducts: 30 }).getTree()
      ).toMatchSnapshot()
    })
  })

  it('Should render the Filter button with 1 active refinement (isMobile)', () => {
    const props = {
      ...initialProps,
      isMobile: true,
      activeRefinements: [
        {
          title: 'Category',
          key: 'TOPSHOP_UK_CATEGORY',
        },
        {
          title: 'Price',
        },
      ],
    }
    expect(renderComponent(props).getTree()).toMatchSnapshot()
  })

  describe('@children', () => {
    describe('Button.Filters-refineButton', () => {
      it('calls toggleRefinements handler on clickHandler prop', () => {
        const { wrapper } = renderComponent({ ...initialProps, isMobile: true })

        expect(initialProps.toggleRefinements).not.toBeCalled()
        wrapper
          .find('.Filters-refineButton')
          .props()
          .clickHandler()
        expect(initialProps.toggleRefinements).toBeCalledWith(true)
      })
    })
  })
})
