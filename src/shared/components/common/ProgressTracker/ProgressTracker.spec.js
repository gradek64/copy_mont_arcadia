import testComponentHelper from 'test/unit/helpers/test-component'
import ProgressTracker from './ProgressTracker'

describe('<ProgressTracker />', () => {
  const renderComponent = testComponentHelper(ProgressTracker)
  const initialProps = {
    steps: [
      { title: 'Delivery' },
      {
        title: 'Payment',
        active: true,
      },
      { title: 'Thank You' },
    ],
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
