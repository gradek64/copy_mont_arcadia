import testComponentHelper from 'test/unit/helpers/test-component'

import Separator from '../Separator'

describe('<Separator />', () => {
  const renderComponent = testComponentHelper(Separator)
  it('should render Separator component correctly when no props passed', () => {
    const { getTree } = renderComponent()
    expect(getTree()).toMatchSnapshot()
  })
  it('should render Separator component correctly when props passed', () => {
    const { getTree } = renderComponent({margin:'15px 0', backgroundColor:'black'})
    expect(getTree()).toMatchSnapshot()
  })
})