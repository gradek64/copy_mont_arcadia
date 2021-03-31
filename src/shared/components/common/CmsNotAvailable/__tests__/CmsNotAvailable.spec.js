import testComponentHelper from 'test/unit/helpers/test-component'
import CmsNotAvailable from '../../../../../shared/components/common/CmsNotAvailable/CmsNotAvailable'

const renderComponent = testComponentHelper(CmsNotAvailable)

describe('<CmsNotAvailable />', () => {
  it('renders correct message', () => {
    const { wrapper } = renderComponent()
    expect(wrapper.find('.CmsNotAvailable')).toHaveLength(1)
    expect(wrapper.find('.CmsNotAvailable').text()).toBe(
      `Sorry, there's been an error with loading the page. Please try again later`
    )
  })
})
