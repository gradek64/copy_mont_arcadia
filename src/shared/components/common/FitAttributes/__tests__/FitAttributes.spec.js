import renderComponentHelper from '../../../../../../test/unit/helpers/test-component'
import FitAttributes from '../FitAttributes'
import { Link } from 'react-router'

const renderComponent = renderComponentHelper(FitAttributes)

const initialProps = {
  fitAttributes: [
    {
      catentryId: '20434610',
      TPMName: 'Tall',
      isTPMActive: true,
      TPMUrl: '/en/tsuk/product/moto-star-stud-denim-borg-jacket-7196268',
    },
    {
      catentryId: '20906473',
      TPMName: 'Petite',
      isTPMActive: false,
      TPMUrl: '/en/tsuk/product/moto-knot-tie-jumpsuit-7178618',
    },
    {
      catentryId: '20865068',
      TPMName: 'Maternity',
      isTPMActive: false,
      TPMUrl: '/en/tsuk/product/moto-side-striped-denim-skirt-7216592',
    },
  ],
}

describe('<FitAttributes/>', () => {
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    describe('not quickview', () => {
      it('renders the correct amount of fit attribute links', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find('.FitAttributes-link').length).toBe(3)
      })

      it('first `Link` item has class of `FitAttributes--stateActive`', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(
          wrapper
            .find(Link)
            .first()
            .hasClass('FitAttributes--stateActive')
        ).toBe(true)
      })

      it('only one `Link` item has class of `FitAttributes--stateActive`', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.find('.FitAttributes--stateActive').length).toBe(1)
      })
    })
    describe('quickview', () => {
      it('renders the correct amount of fit attribute buttons', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isQuickview: true,
        })
        expect(wrapper.find('.FitAttributes-link').length).toBe(3)
      })

      it('first item has class of `FitAttributes--stateActive`', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isQuickview: true,
        })
        expect(
          wrapper
            .find('.FitAttributes-link')
            .first()
            .hasClass('FitAttributes--stateActive')
        ).toBe(true)
      })

      it('only one item has class of `FitAttributes--stateActive`', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isQuickview: true,
        })
        expect(wrapper.find('.FitAttributes--stateActive').length).toBe(1)
      })
    })
  })
  describe('@events', () => {
    describe('isQuickview is true', () => {
      it('should not call onClick when isTPMActive is true', () => {
        const props = {
          ...initialProps,
          isQuickview: false,
          onClick: jest.fn(),
        }
        const { wrapper } = renderComponent(props)

        wrapper
          .find('.FitAttributes-link')
          .first()
          .simulate('click')
        expect(props.onClick).not.toHaveBeenCalled()
      })
      it('should call onClick when isTPMActive is false', () => {
        const props = {
          ...initialProps,
          isQuickview: true,
          onClick: jest.fn(),
        }
        const { wrapper } = renderComponent(props)

        wrapper
          .find('.FitAttributes-link')
          .at(1)
          .simulate('click')
        expect(props.onClick).toHaveBeenCalled()
      })
      it('should call swatchChange', () => {
        const props = {
          ...initialProps,
          isQuickview: false,
          swatchChange: jest.fn(),
        }
        const { wrapper } = renderComponent(props)

        // works irrespective of isTMPActive prop
        wrapper
          .find('.FitAttributes-link')
          .at(0)
          .simulate('click')
        wrapper
          .find('.FitAttributes-link')
          .at(1)
          .simulate('click')
        expect(props.swatchChange).toHaveBeenCalledTimes(2)
      })
    })
    describe('isQuickview is false', () => {
      it('should not call onClick regardless of isTMPActive attribute', () => {
        const props = {
          ...initialProps,
          isQuickview: false,
          onClick: jest.fn(),
        }

        const { wrapper } = renderComponent(props)

        wrapper
          .find('.FitAttributes-link')
          .at(0)
          .simulate('click')

        wrapper
          .find('.FitAttributes-link')
          .at(1)
          .simulate('click')

        expect(props.onClick).toHaveBeenCalledTimes(0)
      })
      it('should call swatchChange', () => {
        const props = {
          ...initialProps,
          isQuickview: false,
          swatchChange: jest.fn(),
        }

        const { wrapper } = renderComponent(props)

        wrapper
          .find('.FitAttributes-link')
          .at(0)
          .simulate('click')

        wrapper
          .find('.FitAttributes-link')
          .at(1)
          .simulate('click')

        expect(props.swatchChange).toHaveBeenCalledTimes(2)
      })
    })
  })
})
