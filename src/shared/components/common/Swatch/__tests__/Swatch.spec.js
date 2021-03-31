import Swatch from '../Swatch'
import testComponentHelper from 'test/unit/helpers/test-component'
import { Link } from 'react-router'

const renderComponent = testComponentHelper(Swatch)
const onSelectSpy = jest.fn()
const onSwatchClickSpy = jest.fn()
const props = {
  imageUrl: 'imageUrl',
  colourName: 'colourName',
  index: 0,
  selected: true,
  swatchProduct: {
    productId: '123456',
  },
  onSelect: onSelectSpy,
  seoUrl: 'seo-url',
}

beforeEach(() => {
  onSelectSpy.mockReset()
  onSwatchClickSpy.mockReset()
})

describe('<Swatch />', () => {
  describe('@render', () => {
    it('renders in the default state', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })

    it('renders a `Link` to the productId', () => {
      const { wrapper } = renderComponent({ ...props })
      expect(
        wrapper
          .find('.Swatch-link')
          .first()
          .prop('to')
      ).toBe('seo-url')
    })

    it('renders an image if there is no colour name available', () => {
      const { wrapper } = renderComponent({
        ...props,
        colourName: '',
      })
      expect(
        wrapper
          .find('.Swatch-linkImage')
          .first()
          .prop('src')
      ).toBe(props.imageUrl)
      expect(
        wrapper
          .find('.Swatch-link')
          .first()
          .prop('style')
      ).toEqual({})
    })

    it('uses the colour name to display the colour if available', () => {
      const { wrapper } = renderComponent({
        ...props,
      })

      expect(wrapper.find('.Swatch-linkImage')).toHaveLength(0)
      expect(
        wrapper
          .find('.Swatch-link')
          .first()
          .prop('style')
      ).toEqual({
        background: '#colourName',
      })
    })

    it('applies selected class when selected', () => {
      const { wrapper } = renderComponent({ ...props })
      expect(wrapper.hasClass('is-selected')).toBe(true)
    })
  })

  describe('@events', () => {
    it('`onSelectSpy` is called when `<Link />` is clicked and `onSelect` prop is passed into component', () => {
      const { wrapper } = renderComponent({ ...props })
      const onClickObject = { preventDefault: () => {} }

      wrapper.find(Link).prop('onClick')(onClickObject)

      expect(onSelectSpy).toHaveBeenCalledTimes(1)
      expect(onSelectSpy).toHaveBeenCalledWith(onClickObject, props.index)
    })

    describe('onSwatchClick', () => {
      describe('when onSwatchClick is undefined', () => {
        it('it should not be called', () => {
          const { wrapper } = renderComponent({ ...props })
          const clickEvent = { preventDefault: () => {} }
          wrapper.find(Link).prop('onClick')(clickEvent)

          expect(onSelectSpy).toHaveBeenCalledTimes(1)
          expect(onSwatchClickSpy).toHaveBeenCalledTimes(0)
        })
      })
      describe('when onSwatchClick is not undefined', () => {
        it('it should be called once and with the right argument', () => {
          const { wrapper } = renderComponent({
            ...props,
            onSwatchClick: onSwatchClickSpy,
          })
          const clickEvent = { preventDefault: () => {} }
          wrapper.find(Link).prop('onClick')(clickEvent)

          expect(onSelectSpy).toHaveBeenCalledTimes(1)
          expect(onSwatchClickSpy).toHaveBeenCalledTimes(1)
          expect(onSwatchClickSpy).toHaveBeenCalledWith(clickEvent)
        })
      })
    })
  })
})
