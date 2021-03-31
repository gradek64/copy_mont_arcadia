import testComponentHelper from 'test/unit/helpers/test-component'
import RatingImage from './RatingImage'

describe('<RatingImage/>', () => {
  const renderComponent = testComponentHelper(RatingImage.WrappedComponent)
  const initialProps = {
    rating: 4.5,
    bazaarVoiceId: '6025-en_gb',
    bazaarVoiceEnabled: true,
  }

  describe('@renders', () => {
    it('in default state - rating number', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('in default state - rating string', () => {
      expect(
        renderComponent({ ...initialProps, rating: '4.5' }).getTree()
      ).toMatchSnapshot()
    })

    it('with a > 2 decimal place rating - rating number', () => {
      expect(
        renderComponent({ ...initialProps, rating: 3.58999 }).getTree()
      ).toMatchSnapshot()
    })

    it('with a > 2 decimal place rating - rating string', () => {
      expect(
        renderComponent({ ...initialProps, rating: '3.58999' }).getTree()
      ).toMatchSnapshot()
    })

    it('with a rating with zeros in the decimal places - rating number', () => {
      expect(
        renderComponent({ ...initialProps, rating: 3.0 }).getTree()
      ).toMatchSnapshot()
    })

    it('with a rating with zeros in the decimal places - rating string', () => {
      expect(
        renderComponent({ ...initialProps, rating: '3.00' }).getTree()
      ).toMatchSnapshot()
    })

    describe('when bazaarVoiceEnabled is equal to false', () => {
      it('should render an empty component', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          bazaarVoiceEnabled: false,
        })
        expect(wrapper.html()).toBeNull()
      })
    })
  })
})
