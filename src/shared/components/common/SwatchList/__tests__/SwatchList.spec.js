import testComponentHelper from 'test/unit/helpers/test-component'
import SwatchList from '../SwatchList'
import Swatch from '../../Swatch/Swatch'

const renderComponent = testComponentHelper(SwatchList.WrappedComponent)

const swatches = [
  {
    imageUrl: 'swatch0',
    colourName: 'swatch0',
    swatchProduct: {
      productId: 'swatch0',
    },
  },
  {
    imageUrl: 'swatch1',
    colourName: 'swatch1',
    swatchProduct: {
      productId: 'swatch1',
    },
  },
  {
    imageUrl: 'swatch2',
    colourName: 'swatch2',
    swatchProduct: {
      productId: 'swatch2',
    },
  },
]

const lotsOfSwatches = [
  ...swatches,
  {
    imageUrl: 'swatch3',
    colourName: 'swatch3',
    swatchProduct: {
      productId: 'swatch3',
    },
  },
  {
    imageUrl: 'swatch4',
    colourName: 'swatch4',
    swatchProduct: {
      productId: 'swatch4',
    },
  },
  {
    imageUrl: 'swatch5',
    colourName: 'swatch5',
    swatchProduct: {
      productId: 'swatch5',
    },
  },
  {
    imageUrl: 'swatch6',
    colourName: 'swatch6',
    swatchProduct: {
      productId: 'swatch6',
    },
  },
  {
    imageUrl: 'swatch7',
    colourName: 'swatch7',
    swatchProduct: {
      productId: 'swatch7',
    },
  },
]

const evenMoreSwatches = [
  ...lotsOfSwatches,
  {
    imageUrl: 'swatch8',
    colourName: 'swatch8',
    swatchProduct: {
      productId: 'swatch8',
    },
  },
  {
    imageUrl: 'swatch9',
    colourName: 'swatch9',
    swatchProduct: {
      productId: 'swatch9',
    },
  },
  {
    imageUrl: 'swatch10',
    colourName: 'swatch10',
    swatchProduct: {
      productId: 'swatch10',
    },
  },
  {
    imageUrl: 'swatch11',
    colourName: 'swatch11',
    swatchProduct: {
      productId: 'swatch11',
    },
  },
  {
    imageUrl: 'swatch12',
    colourName: 'swatch12',
    swatchProduct: {
      productId: 'swatch12',
    },
  },
]

const props = {
  seoUrl: '',
  swatches,
  page: 0,
  selected: 0,
  maxSwatches: 4,
  productId: '1234',
  resetSwatchesPage: jest.fn(),
}

describe('<SwatchList/>', () => {
  describe('@renders', () => {
    it('renders in default state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })

    it('should render 3 <Swatch/> components if 3 swatches have been passed in via `swatches` props', () => {
      const { wrapper } = renderComponent({ ...props })
      expect(wrapper.find(Swatch).length).toEqual(3)
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('correct swatch is selected', () => {
      const { wrapper } = renderComponent({ ...props, selected: 1 })
      expect(
        wrapper
          .find(Swatch)
          .at(1)
          .prop('selected')
      ).toBe(true)
    })

    it('displays a next page button when needed', () => {
      const { wrapper } = renderComponent({
        ...props,
        swatches: lotsOfSwatches,
        selected: 1,
      })
      expect(wrapper.find('.SwatchList-button').length).toEqual(1)
    })

    it('has no buttons if not needed', () => {
      const { wrapper } = renderComponent({ ...props, selected: 1 })
      expect(wrapper.find('.SwatchList-button').length).toEqual(0)
    })

    it('always shows correct amount of swatches on first page when there are pages', () => {
      const { wrapper } = renderComponent({
        ...props,
        swatches: evenMoreSwatches,
        selected: 1,
        page: 0,
        maxSwatches: 6,
      })

      const length2 = wrapper.find(Swatch).length

      expect(length2).toEqual(5)
    })

    it('always shows correct amount of swatches on second page when there are pages', () => {
      const { wrapper } = renderComponent({
        ...props,
        swatches: evenMoreSwatches,
        selected: 1,
        page: 1,
        maxSwatches: 6,
      })

      const length2 = wrapper.find(Swatch).length

      expect(length2).toEqual(4)
    })

    it('shows swatches in rows on a PDP, with a final short row when there is no pagination', () => {
      const { wrapper } = renderComponent({
        ...props,
        pageClass: 'pdp',
        swatches: evenMoreSwatches,
        selected: 1,
        maxSwatches: 13,
      })

      const numSwatches = wrapper.find(Swatch).length
      expect(wrapper.find('.SwatchList-row').length).toEqual(1)
      expect(wrapper.find('.SwatchList-cell').length).toEqual(13)
      expect(numSwatches).toEqual(13)
    })

    it('should not show swatches in rows on a PLP', () => {
      const { wrapper } = renderComponent({
        ...props,
        pageClass: 'plp',
        swatches: evenMoreSwatches,
        selected: 1,
        maxSwatches: 13,
      })

      const numSwatches = wrapper.find(Swatch).length
      expect(wrapper.find('.SwatchList-row').length).toBe(0)
      expect(wrapper.find('.SwatchList-row--short').length).toBe(0)
      expect(wrapper.find('.SwatchList-cell').length).toBe(0)
      expect(wrapper.find('.SwatchList-cell-short').length).toBe(0)
      expect(numSwatches).toEqual(13)
    })

    it('shows swatches in rows on a PDP when there is no pagination', () => {
      const evenNumberOfSwatches = evenMoreSwatches.splice(0, 12)
      const { wrapper } = renderComponent({
        ...props,
        pageClass: 'pdp',
        swatches: evenNumberOfSwatches,
        selected: 1,
        maxSwatches: 12,
      })

      const numSwatches = wrapper.find(Swatch).length
      expect(wrapper.find('.SwatchList-row').length).toEqual(1)
      expect(wrapper.find('.SwatchList-cell').length).toEqual(12)
      expect(wrapper.find('.SwatchList-cell--short').length).toEqual(0)
      expect(numSwatches).toEqual(12)
    })

    it('displays a next page button when needed', () => {
      const { wrapper } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        page: 0,
        maxSwatches: 4,
      })
      expect(wrapper.find('.SwatchList-button').length).toEqual(1)
      expect(wrapper.find('.SwatchList-button--next').length).toEqual(1)
    })

    it('displays a prev page button when needed', () => {
      const { wrapper } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        page: 4,
        maxSwatches: 4,
      })
      expect(wrapper.find('.SwatchList-button').length).toEqual(1)
      expect(wrapper.find('.SwatchList-button--prev').length).toEqual(1)
    })

    it('displays both buttons when needed', () => {
      const { wrapper } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        page: 1,
        maxSwatches: 6,
      })
      expect(wrapper.find('.SwatchList-button--prev').length).toEqual(1)
      expect(wrapper.find('.SwatchList-button--next').length).toEqual(1)
    })

    it('passes down `onSwatchClick` to Swatch', () => {
      const onSwatchClick = jest.fn()
      const { wrapper } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        page: 1,
        onSwatchClick,
      })
      expect(
        wrapper
          .find(Swatch)
          .at(1)
          .props().onSwatchClick
      ).toEqual(onSwatchClick)
    })

    it('passes down `onSelect` click handler to Swatch', () => {
      const onSelect = jest.fn()
      const { wrapper } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        page: 1,
        onSelect,
      })
      expect(
        wrapper
          .find(Swatch)
          .at(1)
          .props().onSelect
      ).toEqual(onSelect)
    })

    it('fires nextSwatches when next button is clicked', () => {
      const nextSwatches = jest.fn()
      const { wrapper } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        page: 1,
        nextSwatches,
      })
      wrapper.find('.SwatchList-button--next').simulate('click', {
        preventDefault: () => {},
        stopPropagation: () => {},
      })
      expect(nextSwatches).toHaveBeenCalled()
    })

    it('fires `prevSwatches` when prev button is clicked', () => {
      const prevSwatches = jest.fn()
      const { wrapper } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        page: 1,
        prevSwatches,
      })
      wrapper.find('.SwatchList-button--prev').simulate('click', {
        preventDefault: () => {},
        stopPropagation: () => {},
      })
      expect(prevSwatches).toHaveBeenCalled()
    })

    it('should reset swatches page when the page plus maxSwatches is greater than swatches.length', () => {
      const { instance } = renderComponent({
        ...props,
        selected: 1,
        swatches: lotsOfSwatches,
        maxSwatches: 4,
        page: 6,
      })

      expect(instance.props.resetSwatchesPage).toBeCalled()
    })
  })
})
