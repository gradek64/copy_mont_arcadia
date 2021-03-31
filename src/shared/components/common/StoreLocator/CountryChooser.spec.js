import testComponentHelper from 'test/unit/helpers/test-component'
import CountryChooser from './CountryChooser'
import Select from '../FormComponents/Select/Select'

describe('<CountryChooser/>', () => {
  const initialProps = {
    countries: [],
    isMobile: true,
    getCountries: jest.fn(),
    selectCountry: jest.fn(),
  }
  const countries = ['United Kingdom', 'Germany', 'Spain', 'Gibraltar']
  const renderComponent = testComponentHelper(CountryChooser.WrappedComponent)

  describe('@renders', () => {
    describe('mobile', () => {
      it('in default state', () => {
        expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
      })
      it('with className', () => {
        expect(
          renderComponent({
            ...initialProps,
            className: 'test-countryChooser',
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with name', () => {
        expect(
          renderComponent({
            ...initialProps,
            className: 'test-name',
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with countries', () => {
        expect(
          renderComponent({
            ...initialProps,
            countries,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with selectedCountry', () => {
        expect(
          renderComponent({
            ...initialProps,
            selectedCountry: 'Gibraltar',
          }).getTree()
        ).toMatchSnapshot()
      })
      it('as landingPage', () => {
        expect(
          renderComponent({
            ...initialProps,
            isLandingPage: true,
          }).getTree()
        ).toMatchSnapshot()
      })
    })
    describe('desktop', () => {
      it('in default state', () => {
        expect(
          renderComponent({ ...initialProps, isMobile: false }).getTree()
        ).toMatchSnapshot()
      })
      it('with className', () => {
        expect(
          renderComponent({
            ...initialProps,
            isMobile: false,
            className: 'test-countryChooser',
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with name', () => {
        expect(
          renderComponent({
            ...initialProps,
            isMobile: false,
            className: 'test-name',
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with countries', () => {
        expect(
          renderComponent({
            ...initialProps,
            isMobile: false,
            countries,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('with selectedCountry', () => {
        expect(
          renderComponent({
            ...initialProps,
            isMobile: false,
            selectedCountry: 'Gibraltar',
          }).getTree()
        ).toMatchSnapshot()
      })
      it('as landingPage', () => {
        expect(
          renderComponent({
            ...initialProps,
            isMobile: false,
            isLandingPage: true,
          }).getTree()
        ).toMatchSnapshot()
      })
    })
  })
  describe('@lifecycle', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
  })
  describe('@events', () => {
    describe('<select />', () => {
      it('calls selectCountry handler on select', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          countries,
          getCountries: jest.fn(),
          selectCountry: jest.fn(),
          selectedCountry: 'United Kingdom',
        })

        expect(instance.props.selectCountry).not.toBeCalled()
        wrapper
          .find(Select)
          .simulate('change', { target: { value: 'Germany' } })
        expect(instance.props.selectCountry).toHaveBeenCalledTimes(1)
      })

      it('does not call selectCountry when the same country have been choosen', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          countries,
          getCountries: jest.fn(),
          selectCountry: jest.fn(),
          selectedCountry: 'United Kingdom',
        })

        expect(instance.props.selectCountry).not.toBeCalled()
        wrapper
          .find(Select)
          .simulate('change', { target: { value: 'United Kingdom' } })
        expect(instance.props.selectCountry).not.toBeCalled()
      })
    })
  })
})
