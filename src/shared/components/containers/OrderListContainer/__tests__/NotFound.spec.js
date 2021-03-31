import testComponentHelper from 'test/unit/helpers/test-component'
import notFound from '../NotFound'

describe('<NotFound />', () => {
  const renderComponent = testComponentHelper(notFound)
  const initialProps = {
    message: 'mockedNotFoundMessage',
  }

  describe('@render', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })
})
