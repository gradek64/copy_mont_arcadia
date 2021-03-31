import testComponentHelper from 'test/unit/helpers/test-component'
import QubitReact from 'qubit-react/wrapper'
import SwatchesPrivate from '../SwatchesPrivate'
import SwatchList from '../../SwatchList/SwatchList'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

jest.mock('react-router', () => ({
  browserHistory: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}))

const productId = 987
const selectedId = 123

const swatch1 = {
  imageUrl: 'swatch0',
  colourName: 'swatch0',
  productId: '777',
  swatchProduct: {
    productId: 777,
    grouping: 'DP56672700',
  },
}
const swatch2 = {
  imageUrl: 'swatch1',
  colourName: 'swatch1',
  productId: selectedId.toString(),
  swatchProduct: {
    productId: selectedId.toString(),
    grouping: 'DP56672900',
  },
}

describe('</SwatchesPrivate>', () => {
  const renderComponent = testComponentHelper(SwatchesPrivate.WrappedComponent)
  const initialProps = {
    name: 'test name',
    maxSwatches: 5,
    productId,
    selectedId,
    showAllColours: false,
    swatchProducts: {},
    lineNumber: 'DP56672700',
  }

  it('should render null with only one swatch', () => {
    expect(
      renderComponent(
        Object.assign({}, initialProps, { swatches: [swatch1] })
      ).getTree()
    ).toBe('')
  })

  it('should render with two swatches without showAllColours flag, and first default selected and page', () => {
    const renderedComponent = renderComponent(
      Object.assign({}, initialProps, {
        swatches: [swatch1, swatch2],
        productId: 111,
      })
    )
    const swatchesList = renderedComponent.wrapper.find('Connect(SwatchList)')
    expect(swatchesList.length).toBe(1)
    expect(swatchesList.props().maxSwatches).toBe(5)
    expect(swatchesList.props().selected).toBe(0)
    expect(swatchesList.props().page).toBe(0)
  })

  it('should render with two swatches without showAllColours flag, and second default selected', () => {
    const renderedComponent = renderComponent({
      ...initialProps,
      lineNumber: 'DP56672900',
      swatches: [swatch1, swatch2],
      productId: 111,
    })
    const swatchesList = renderedComponent.wrapper.find('Connect(SwatchList)')
    expect(swatchesList.props().selected).toBe(1)
  })

  it('should render with two swatches without showAllColours flag, and second default selected', () => {
    const renderedComponent = renderComponent({
      ...initialProps,
      lineNumber: 'dontexist',
      swatches: [swatch1, swatch2],
      productId: 111,
    })
    const swatchesList = renderedComponent.wrapper.find('Connect(SwatchList)')
    expect(swatchesList.props().selected).toBe(-1)
  })

  it('should render with two swatches, with selected and page from swatch, and without showAllColours flag', () => {
    const renderedComponent = renderComponent(
      Object.assign({}, initialProps, {
        swatches: [swatch1, swatch2],
        swatchProducts: {
          [productId]: {
            selected: 3,
            page: 2,
          },
        },
        selectedId: 987,
      })
    )
    const swatchesList = renderedComponent.wrapper.find('Connect(SwatchList)')
    expect(swatchesList.length).toBe(1)
    expect(swatchesList.props().maxSwatches).toBe(5)
    expect(swatchesList.props().selected).toBe(3)
    expect(swatchesList.props().page).toBe(2)
  })

  it('should render with showAllColours flag', () => {
    const renderedComponent = renderComponent(
      Object.assign({}, initialProps, {
        swatches: [swatch1, swatch2],
        swatchProducts: {},
        showAllColours: true,
      })
    )
    const swatchesList = renderedComponent.wrapper.find('Connect(SwatchList)')
    expect(swatchesList.length).toBe(1)
    expect(swatchesList.props().maxSwatches).toBe(2)
    expect(swatchesList.props().selected).toBe(1)
    expect(swatchesList.props().page).toBe(0)
  })

  it('should call the onSelect callback prop with the selected swatch product', () => {
    const onSelect = jest.fn()
    const swatches = [swatch1, swatch2]

    const { wrapper } = renderComponent({
      onSelect,
      showAllColours: true,
      swatches,
      swatchProducts: {},
      selectedId,
    })

    const event = new Event('select')
    wrapper.find(SwatchList).simulate('select', event, 0)

    expect(onSelect).toHaveBeenCalledWith(event, swatches[0])
  })

  describe('@qubit', () => {
    it('should render a qubit react wrapper for color swatches with correct props', () => {
      const swatches = [swatch1, swatch2]
      const { wrapper } = renderComponent({
        ...initialProps,
        swatches,
      })
      const qubitWrapper = wrapper.find(QubitReact)

      expect(qubitWrapper.prop('id')).toBe(
        'qubit-plp-color-swatches-replacement'
      )
      expect(qubitWrapper.prop('swatches')).toBe(swatches)
      expect(qubitWrapper.prop('pageClass')).toBeUndefined()
    })
  })
})
